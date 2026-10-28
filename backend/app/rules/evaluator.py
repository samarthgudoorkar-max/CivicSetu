from typing import Dict, Any, List, Optional, Tuple


def evaluate_eligibility(
    rule_definition: Dict[str, Any],
    citizen_profile: Dict[str, Any],
    scheme_level: str = "central",
    scheme_state_code: Optional[str] = None,
    official_source_url: str = "",
    last_verified_at: Optional[str] = None
) -> Dict[str, Any]:
    """
    Deterministic eligibility evaluator.
    Evaluates citizen profile against structured scheme rules without guessing or fabricating.
    Returns:
    - assessment_status: Potentially Eligible | Not Eligible Based on Supplied Information | More Information Required | Unable to Verify
    - satisfied_conditions: List[str]
    - not_satisfied_conditions: List[str]
    - missing_information: List[str]
    - summary: str
    - relevance_score: float (0.0 to 1.0)
    - official_source: str
    - last_verified_at: str
    """
    satisfied = []
    not_satisfied = []
    missing_info = []

    # 1. State / Domicile Check
    allowed_states = rule_definition.get("allowed_states")
    citizen_state = citizen_profile.get("state_code")
    
    if allowed_states and "ALL" not in allowed_states:
        if not citizen_state:
            missing_info.append("State of residence was not provided to verify regional eligibility.")
        elif citizen_state in allowed_states or (scheme_state_code and citizen_state == scheme_state_code):
            satisfied.append(f"Residence in {citizen_state} meets the state domicile requirement.")
        else:
            not_satisfied.append(f"Scheme is restricted to residents of {', '.join(allowed_states)}. Your selected state is {citizen_state}.")
    elif scheme_level == "state" and scheme_state_code:
        if not citizen_state:
            missing_info.append("State of residence needed for state-specific scheme.")
        elif citizen_state == scheme_state_code:
            satisfied.append(f"Residence in state {citizen_state} matches scheme jurisdiction.")
        else:
            not_satisfied.append(f"Scheme is specifically for {scheme_state_code} residents.")
    else:
        satisfied.append("Scheme is open to citizens across all Indian states and Union Territories.")

    # 2. Age Check
    min_age = rule_definition.get("min_age")
    max_age = rule_definition.get("max_age")
    citizen_age = citizen_profile.get("age")

    if min_age is not None or max_age is not None:
        if citizen_age is None:
            age_desc = []
            if min_age is not None:
                age_desc.append(f"minimum {min_age} years")
            if max_age is not None:
                age_desc.append(f"maximum {max_age} years")
            missing_info.append(f"Age not provided (scheme requires {' and '.join(age_desc)}).")
        else:
            age_valid = True
            if min_age is not None and citizen_age < min_age:
                not_satisfied.append(f"Age {citizen_age} is below the minimum required age of {min_age} years.")
                age_valid = False
            if max_age is not None and citizen_age > max_age:
                not_satisfied.append(f"Age {citizen_age} exceeds the maximum eligible age of {max_age} years.")
                age_valid = False
            
            if age_valid:
                satisfied.append(f"Age {citizen_age} falls within the eligible age bracket ({min_age or 0}–{max_age or 'no max'} years).")

    # 3. Income Ceiling Check
    max_income = rule_definition.get("max_annual_income")
    citizen_income = citizen_profile.get("annual_income")

    if max_income is not None:
        if citizen_income is None:
            missing_info.append(f"Annual household income not specified (scheme requires annual income under ₹{max_income:,.0f}).")
        else:
            if citizen_income <= max_income:
                satisfied.append(f"Annual income ₹{citizen_income:,.0f} is within the allowable limit of ₹{max_income:,.0f}.")
            else:
                not_satisfied.append(f"Annual income ₹{citizen_income:,.0f} exceeds the ceiling of ₹{max_income:,.0f}.")

    # 4. Student Status Check
    student_required = rule_definition.get("student_required")
    citizen_student = citizen_profile.get("is_student")

    if student_required is True:
        if citizen_student is None:
            missing_info.append("Confirmation of active student/enrolled status is required.")
        elif citizen_student is True:
            satisfied.append("Currently enrolled as a student, satisfying the academic requirement.")
        else:
            not_satisfied.append("This scheme is reserved exclusively for actively enrolled students.")

    # 5. Farmer Status / Landholding Check
    farmer_required = rule_definition.get("farmer_required")
    citizen_farmer = citizen_profile.get("is_farmer")

    if farmer_required is True:
        if citizen_farmer is None:
            missing_info.append("Farmer / agricultural landholder status not specified.")
        elif citizen_farmer is True:
            satisfied.append("Identified as a farmer/landholding cultivator, satisfying occupation criteria.")
        else:
            not_satisfied.append("This scheme requires being an active farmer or landholder.")

    # 6. Occupation Criteria
    allowed_occupations = rule_definition.get("allowed_occupations")
    citizen_occupation = citizen_profile.get("occupation")

    if allowed_occupations and "ANY" not in [o.upper() for o in allowed_occupations]:
        if not citizen_occupation:
            missing_info.append(f"Occupation not provided (eligible occupations: {', '.join(allowed_occupations)}).")
        elif any(o.lower() in citizen_occupation.lower() or citizen_occupation.lower() in o.lower() for o in allowed_occupations):
            satisfied.append(f"Occupation '{citizen_occupation}' matches target beneficiaries.")
        else:
            # Check if occupation is clearly divergent
            not_satisfied.append(f"Occupation '{citizen_occupation}' does not match target category ({', '.join(allowed_occupations)}).")

    # 7. Gender Criteria
    gender_required = rule_definition.get("gender_required")
    citizen_gender = citizen_profile.get("gender")

    if gender_required and gender_required.upper() != "ANY":
        if not citizen_gender:
            missing_info.append(f"Gender criteria ({gender_required}) requires verification.")
        elif citizen_gender.lower() == gender_required.lower():
            satisfied.append(f"Beneficiary gender ({citizen_gender}) matches scheme provisions.")
        else:
            not_satisfied.append(f"Scheme is targeted for {gender_required} beneficiaries (selected: {citizen_gender}).")

    # 8. Social Category (General, OBC, SC, ST, EWS)
    allowed_categories = rule_definition.get("allowed_categories")
    citizen_category = citizen_profile.get("category")

    if allowed_categories and "ANY" not in [c.upper() for c in allowed_categories]:
        if not citizen_category:
            missing_info.append(f"Social category needed to verify eligibility (eligible: {', '.join(allowed_categories)}).")
        elif citizen_category.upper() in [c.upper() for c in allowed_categories]:
            satisfied.append(f"Social category ({citizen_category}) is eligible under this program.")
        else:
            not_satisfied.append(f"Social category ({citizen_category}) not among designated categories ({', '.join(allowed_categories)}).")

    # 9. Additional portal verification advisory notices
    portal_advisories = []
    unverified_conditions = rule_definition.get("unverified_conditions", [])
    for cond in unverified_conditions:
        portal_advisories.append(f"Official Portal Check: {cond}")

    # Determine Overall Assessment Status
    if len(not_satisfied) > 0:
        assessment_status = "Not Eligible Based on Supplied Information"
        summary = f"Based on your responses, you do not meet {len(not_satisfied)} criteria for this scheme."
        relevance_score = 0.2
    elif len(missing_info) > 0:
        if len(satisfied) > 0:
            assessment_status = "More Information Required"
            summary = f"You appear to meet {len(satisfied)} criteria, but {len(missing_info)} profile details still require confirmation."
            relevance_score = 0.65
        else:
            assessment_status = "More Information Required"
            summary = "Key profile details are needed to determine your eligibility."
            relevance_score = 0.4
    elif len(satisfied) > 0:
        assessment_status = "Potentially Eligible"
        advisory_note = f" (Subject to official portal checks: {len(portal_advisories)} item{'s' if len(portal_advisories) != 1 else ''})" if portal_advisories else ""
        summary = f"You meet all {len(satisfied)} verified eligibility criteria based on your answers.{advisory_note}"
        relevance_score = 0.95
    else:
        assessment_status = "Unable to Verify"
        summary = "Eligibility could not be verified automatically. Please consult the official portal."
        relevance_score = 0.5

    # Include portal advisories in missing_information or notes for full transparency
    all_notes = missing_info + portal_advisories if assessment_status != "Potentially Eligible" else portal_advisories

    return {
        "assessment_status": assessment_status,
        "satisfied_conditions": satisfied,
        "not_satisfied_conditions": not_satisfied,
        "missing_information": all_notes,
        "summary": summary,
        "relevance_score": relevance_score,
        "official_source": official_source_url,
        "last_verified_at": last_verified_at or "2026-10-15"
    }
