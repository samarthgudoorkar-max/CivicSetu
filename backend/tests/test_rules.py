import pytest
from app.rules.evaluator import evaluate_eligibility


def test_rule_evaluator_eligible_pmkisan():
    rule_def = {
        "allowed_states": ["ALL"],
        "farmer_required": True,
        "min_age": 18,
    }
    citizen_profile = {
        "state_code": "TG",
        "age": 35,
        "is_farmer": True,
    }
    result = evaluate_eligibility(
        rule_definition=rule_def,
        citizen_profile=citizen_profile,
        scheme_level="central"
    )

    assert result["assessment_status"] == "Potentially Eligible"
    assert len(result["satisfied_conditions"]) >= 2
    assert len(result["not_satisfied_conditions"]) == 0
    assert result["relevance_score"] >= 0.9


def test_rule_evaluator_ineligible_age():
    rule_def = {
        "allowed_states": ["ALL"],
        "min_age": 18,
        "max_age": 40
    }
    citizen_profile = {
        "state_code": "MH",
        "age": 55,
    }
    result = evaluate_eligibility(
        rule_definition=rule_def,
        citizen_profile=citizen_profile,
        scheme_level="central"
    )

    assert result["assessment_status"] == "Not Eligible Based on Supplied Information"
    assert any("exceeds the maximum" in s for s in result["not_satisfied_conditions"])
    assert result["relevance_score"] < 0.5


def test_rule_evaluator_ineligible_state():
    rule_def = {
        "allowed_states": ["TG"],
        "farmer_required": True
    }
    citizen_profile = {
        "state_code": "UP",
        "age": 30,
        "is_farmer": True
    }
    result = evaluate_eligibility(
        rule_definition=rule_def,
        citizen_profile=citizen_profile,
        scheme_level="state",
        scheme_state_code="TG"
    )

    assert result["assessment_status"] == "Not Eligible Based on Supplied Information"
    assert any("restricted to residents of TG" in s or "specifically for TG" in s for s in result["not_satisfied_conditions"])


def test_rule_evaluator_missing_info():
    rule_def = {
        "allowed_states": ["ALL"],
        "max_annual_income": 250000,
        "student_required": True
    }
    citizen_profile = {
        "state_code": "KA",
        "age": 20,
        # income and student status omitted
    }
    result = evaluate_eligibility(
        rule_definition=rule_def,
        citizen_profile=citizen_profile,
        scheme_level="central"
    )

    assert result["assessment_status"] == "More Information Required"
    assert len(result["missing_information"]) >= 2
    assert any("Annual household income" in m for m in result["missing_information"])


def test_rule_evaluator_income_exceeded():
    rule_def = {
        "allowed_states": ["ALL"],
        "max_annual_income": 250000,
    }
    citizen_profile = {
        "state_code": "KA",
        "age": 24,
        "annual_income": 450000
    }
    result = evaluate_eligibility(
        rule_definition=rule_def,
        citizen_profile=citizen_profile,
        scheme_level="central"
    )

    assert result["assessment_status"] == "Not Eligible Based on Supplied Information"
    assert any("exceeds the ceiling" in s for s in result["not_satisfied_conditions"])
