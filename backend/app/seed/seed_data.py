from datetime import datetime, timezone
from typing import List, Dict, Any
from app.models.models import Scheme, EligibilityRule, SchemeDocument


def get_verified_schemes() -> List[Dict[str, Any]]:
    return [
        {
            "slug": "pm-kisan-samman-nidhi",
            "name": "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
            "short_name": "PM-KISAN",
            "description": "An initiative by the Government of India that provides income support to all landholding farmer families across the country to assist with agricultural inputs and domestic needs.",
            "government_level": "central",
            "state_code": None,
            "state_name": "All India",
            "department": "Ministry of Agriculture and Farmers Welfare",
            "category": "Agriculture",
            "target_beneficiaries": ["Small and Marginal Farmers", "Landholding Cultivators"],
            "benefits": [
                "Direct benefit transfer of ₹6,000 per year into bank accounts",
                "Paid in three equal four-monthly installments of ₹2,000 each",
                "Direct credit via Aadhaar-enabled bank transfer without intermediaries",
                "Enables procurement of quality seeds, fertilizers, and agricultural inputs"
            ],
            "application_mode": "Online & Assisted (CSC)",
            "application_url": "https://pmkisan.gov.in/RegistrationFormNew.aspx",
            "official_source_url": "https://pmkisan.gov.in/",
            "last_verified_at": datetime(2026, 10, 15, tzinfo=timezone.utc),
            "is_featured": True,
            "rules": [
                {
                    "rule_type": "composite",
                    "rule_definition": {
                        "allowed_states": ["ALL"],
                        "farmer_required": True,
                        "min_age": 18,
                        "unverified_conditions": ["Active land ownership record in state revenue database", "Not an institutional landholder or income-tax payer"]
                    },
                    "source_url": "https://pmkisan.gov.in/Documents/OperationalGuidelines.pdf"
                }
            ],
            "documents": [
                {
                    "document_name": "Aadhaar Card",
                    "is_required": True,
                    "description": "Mandatory identity proof; must be linked with applicant bank account."
                },
                {
                    "document_name": "Land Ownership Record (Khatauni / RoR / Pattadar Passbook)",
                    "is_required": True,
                    "description": "Official state land revenue record proving cultivable land ownership."
                },
                {
                    "document_name": "Active Bank Passbook",
                    "is_required": True,
                    "description": "Bank account statement showing IFSC code and active Aadhaar NPCI seeding."
                }
            ]
        },
        {
            "slug": "ayushman-bharat-pmjay",
            "name": "Ayushman Bharat — Pradhan Mantri Jan Arogya Yojana (PM-JAY)",
            "short_name": "AB PM-JAY",
            "description": "The world's largest government-funded health assurance scheme, offering health insurance coverage for secondary and tertiary care hospitalization to economically vulnerable citizens.",
            "government_level": "central",
            "state_code": None,
            "state_name": "All India",
            "department": "National Health Authority (NHA), Ministry of Health and Family Welfare",
            "category": "Healthcare",
            "target_beneficiaries": ["Low-income Families", "Senior Citizens (70+)", "SECC Deprived Households"],
            "benefits": [
                "Health cover of ₹5,00,000 per family per year for secondary and tertiary care",
                "Covers up to 3 days of pre-hospitalization and 15 days of post-hospitalization expenses",
                "Cashless treatment at over 27,000 empanelled public and private hospitals across India",
                "Special Ayushman Vay Vandana Card available to all senior citizens aged 70+ irrespective of family income"
            ],
            "application_mode": "Online & Empanelled Hospital Kiosks",
            "application_url": "https://beneficiary.nha.gov.in/",
            "official_source_url": "https://nha.gov.in/PM-JAY",
            "last_verified_at": datetime(2026, 10, 18, tzinfo=timezone.utc),
            "is_featured": True,
            "rules": [
                {
                    "rule_type": "composite",
                    "rule_definition": {
                        "allowed_states": ["ALL"],
                        "max_annual_income": 250000,
                        "unverified_conditions": ["Deprivation criteria under SECC 2011 or valid state Food Security Card"]
                    },
                    "source_url": "https://beneficiary.nha.gov.in/"
                }
            ],
            "documents": [
                {
                    "document_name": "Aadhaar Card",
                    "is_required": True,
                    "description": "Used for instant electronic KYC verification on the Beneficiary Portal."
                },
                {
                    "document_name": "Ration Card / Family ID",
                    "is_required": True,
                    "description": "State ration card or NFSA card indicating family composition."
                }
            ]
        },
        {
            "slug": "nsp-post-matric-scholarship-sc-st",
            "name": "Post-Matric Scholarship for SC and ST Students",
            "short_name": "NSP Post-Matric",
            "description": "Centrally sponsored scholarship scheme to provide financial assistance to Scheduled Caste and Scheduled Tribe students studying at post-matriculation or post-secondary stage.",
            "government_level": "central",
            "state_code": None,
            "state_name": "All India",
            "department": "Ministry of Social Justice and Empowerment / Ministry of Tribal Affairs",
            "category": "Education",
            "target_beneficiaries": ["SC Students", "ST Students", "Post-Matric College Students"],
            "benefits": [
                "100% compulsory non-refundable fees reimbursed directly to institution or student",
                "Monthly maintenance allowance from ₹2,500 to ₹13,500 depending on course group",
                "Additional disability allowances and book bank grants where applicable",
                "Covers degree, diploma, post-graduate, and doctoral qualifications"
            ],
            "application_mode": "Online (National Scholarship Portal)",
            "application_url": "https://scholarships.gov.in/",
            "official_source_url": "https://scholarships.gov.in/",
            "last_verified_at": datetime(2026, 10, 12, tzinfo=timezone.utc),
            "is_featured": True,
            "rules": [
                {
                    "rule_type": "composite",
                    "rule_definition": {
                        "allowed_states": ["ALL"],
                        "student_required": True,
                        "allowed_categories": ["SC", "ST"],
                        "max_annual_income": 250000,
                        "min_age": 15,
                        "max_age": 35
                    },
                    "source_url": "https://scholarships.gov.in/"
                }
            ],
            "documents": [
                {
                    "document_name": "Caste Certificate",
                    "is_required": True,
                    "description": "Permanent caste certificate issued by an authorized state revenue officer (Tahsildar / SDO)."
                },
                {
                    "document_name": "Income Certificate",
                    "is_required": True,
                    "description": "Competent authority certificate validating family income is below ₹2.50 Lakh p.a."
                },
                {
                    "document_name": "Previous Qualifying Marksheet",
                    "is_required": True,
                    "description": "Class 10 / 12 or previous semester passing certificate."
                },
                {
                    "document_name": "College Bonafide & Fee Receipt",
                    "is_required": True,
                    "description": "Bonafide student certificate and official tuition fee payment receipt."
                }
            ]
        },
        {
            "slug": "pradhan-mantri-awas-yojana-gramin",
            "name": "Pradhan Mantri Awas Yojana — Gramin (PMAY-G)",
            "short_name": "PMAY-G",
            "description": "Flagship rural housing scheme dedicated to assisting rural families living in kutcha or dilapidated houses in constructing a hygienic, permanent pucca dwelling with basic amenities.",
            "government_level": "central",
            "state_code": None,
            "state_name": "All India",
            "department": "Ministry of Rural Development",
            "category": "Housing",
            "target_beneficiaries": ["Houseless Families", "Rural Households living in Kutcha Homes"],
            "benefits": [
                "Financial assistance of ₹1,20,000 in plain areas and ₹1,30,000 in hilly/difficult/IAP areas",
                "90 to 95 days of unskilled labour support under MGNREGS (approx ₹20,000+)",
                "Additional assistance of ₹12,000 for toilet construction under Swachh Bharat Mission",
                "Convergent assistance for electricity connection (Saubhagya) and LPG (Ujjwala)"
            ],
            "application_mode": "Gram Panchayat Selection & AwaasApp",
            "application_url": "https://pmayg.nic.in/netiay/AwaasPlus/CitizenCorner.aspx",
            "official_source_url": "https://pmayg.nic.in/",
            "last_verified_at": datetime(2026, 10, 8, tzinfo=timezone.utc),
            "is_featured": False,
            "rules": [
                {
                    "rule_type": "composite",
                    "rule_definition": {
                        "allowed_states": ["ALL"],
                        "max_annual_income": 200000,
                        "unverified_conditions": ["Must not own a motorized vehicle, mechanized farm equipment, or pucca house", "Listed in Awaas+ survey list"]
                    },
                    "source_url": "https://pmayg.nic.in/"
                }
            ],
            "documents": [
                {
                    "document_name": "Aadhaar Card",
                    "is_required": True,
                    "description": "Aadhaar details of all family members."
                },
                {
                    "document_name": "MGNREGA Job Card",
                    "is_required": True,
                    "description": "Registered Job Card to transfer 90 days of construction wages."
                },
                {
                    "document_name": "Bank Account Details",
                    "is_required": True,
                    "description": "Geo-tagged photograph of current kutcha dwelling and active bank passbook."
                }
            ]
        },
        {
            "slug": "atal-pension-yojana",
            "name": "Atal Pension Yojana (APY)",
            "short_name": "APY",
            "description": "A guaranteed periodic pension scheme administered by PFRDA targeted towards unorganized sector workers, securing retirement savings with government-backed returns.",
            "government_level": "central",
            "state_code": None,
            "state_name": "All India",
            "department": "Pension Fund Regulatory and Development Authority (PFRDA)",
            "category": "Senior Citizens",
            "target_beneficiaries": ["Unorganized Sector Workers", "Self-employed Citizens", "Young Adults (18-40)"],
            "benefits": [
                "Guaranteed monthly pension of ₹1,000, ₹2,000, ₹3,000, ₹4,000, or ₹5,000 upon reaching age 60",
                "Same pension continued to spouse for lifetime upon subscriber death",
                "Full accumulated pension corpus returned to designated nominee after both die",
                "Tax deduction benefits under Section 80CCD"
            ],
            "application_mode": "Online Banking & Bank Branches",
            "application_url": "https://enps.nsdl.com/eNPS/ApySubRegistration.html",
            "official_source_url": "https://www.npscra.nsdl.co.in/scheme-details.php",
            "last_verified_at": datetime(2026, 10, 10, tzinfo=timezone.utc),
            "is_featured": True,
            "rules": [
                {
                    "rule_type": "composite",
                    "rule_definition": {
                        "allowed_states": ["ALL"],
                        "min_age": 18,
                        "max_age": 40,
                        "unverified_conditions": ["Subscriber must not be an income-tax payer (effective 1 Oct 2022)"]
                    },
                    "source_url": "https://www.npscra.nsdl.co.in/"
                }
            ],
            "documents": [
                {
                    "document_name": "Savings Bank Account",
                    "is_required": True,
                    "description": "Active savings account in any commercial or regional rural bank with auto-debit facility."
                },
                {
                    "document_name": "Aadhaar Card",
                    "is_required": True,
                    "description": "For identity verification and KYC records."
                }
            ]
        },
        {
            "slug": "pradhan-mantri-mudra-yojana",
            "name": "Pradhan Mantri MUDRA Yojana (PMMY)",
            "short_name": "MUDRA",
            "description": "Provides formal institutional micro-credit up to ₹10 Lakhs (and up to ₹20 Lakhs for Tarun Plus) to micro and small non-farm, non-corporate enterprises without requiring collateral.",
            "government_level": "central",
            "state_code": None,
            "state_name": "All India",
            "department": "Department of Financial Services, Ministry of Finance",
            "category": "Employment",
            "target_beneficiaries": ["Small Business Owners", "Shopkeepers", "Artisans", "First-time Entrepreneurs"],
            "benefits": [
                "Shishu category: Collateral-free loans up to ₹50,000 for seed stage",
                "Kishore category: Loans from ₹50,001 up to ₹5,00,000 for equipment purchase",
                "Tarun category: Loans from ₹5,00,001 up to ₹10,00,000 for business expansion",
                "Zero collateral, no processing charges for Shishu loans, competitive interest rates"
            ],
            "application_mode": "Online (Udyamimitra) & Bank Branches",
            "application_url": "https://www.udyamimitra.in/",
            "official_source_url": "https://www.mudra.org.in/",
            "last_verified_at": datetime(2026, 10, 14, tzinfo=timezone.utc),
            "is_featured": False,
            "rules": [
                {
                    "rule_type": "composite",
                    "rule_definition": {
                        "allowed_states": ["ALL"],
                        "min_age": 18,
                        "unverified_conditions": ["Must have viable business plan and not be a defaulter at any financial institution"]
                    },
                    "source_url": "https://www.mudra.org.in/"
                }
            ],
            "documents": [
                {
                    "document_name": "Identity & Address Proof",
                    "is_required": True,
                    "description": "Aadhaar / Voter ID / PAN Card."
                },
                {
                    "document_name": "Business Address Proof & Quotation",
                    "is_required": True,
                    "description": "Rent agreement/Udyam registration and proforma invoice for machinery or materials."
                },
                {
                    "document_name": "Bank Statement",
                    "is_required": True,
                    "description": "Last 6 months account statement of applicant."
                }
            ]
        },
        {
            "slug": "pm-svanidhi",
            "name": "PM Street Vendor's AtmaNirbhar Nidhi (PM SVANidhi)",
            "short_name": "PM SVANidhi",
            "description": "Special micro-credit facility empowering urban, peri-urban, and rural street vendors to restart livelihoods with affordable working capital and digital transaction incentives.",
            "government_level": "central",
            "state_code": None,
            "state_name": "All India",
            "department": "Ministry of Housing and Urban Affairs",
            "category": "Financial Assistance",
            "target_beneficiaries": ["Street Vendors", "Hawkers", "Thela-walas", "Urban Micro-merchants"],
            "benefits": [
                "1st Tranche collateral-free working capital loan of ₹10,000 (1 year tenure)",
                "2nd Tranche loan of up to ₹20,000 on prompt repayment of first loan",
                "3rd Tranche loan of up to ₹50,000 for sustained digital operations",
                "7% per annum interest subsidy directly credited via DBT",
                "Monthly cashback up to ₹100 for digital payments using QR code"
            ],
            "application_mode": "Online Portal & Mobile App",
            "application_url": "https://pmsvanidhi.mohua.gov.in/",
            "official_source_url": "https://pmsvanidhi.mohua.gov.in/",
            "last_verified_at": datetime(2026, 10, 16, tzinfo=timezone.utc),
            "is_featured": False,
            "rules": [
                {
                    "rule_type": "composite",
                    "rule_definition": {
                        "allowed_states": ["ALL"],
                        "min_age": 18,
                        "unverified_conditions": ["Possession of Certificate of Vending or Urban Local Body recommendation letter"]
                    },
                    "source_url": "https://pmsvanidhi.mohua.gov.in/"
                }
            ],
            "documents": [
                {
                    "document_name": "Aadhaar Card",
                    "is_required": True,
                    "description": "Linked to active mobile number for OTP confirmation."
                },
                {
                    "document_name": "Certificate of Vending (CoV) / Identity Card",
                    "is_required": True,
                    "description": "Document issued by Municipality or Town Vending Committee (TVC)."
                }
            ]
        },
        {
            "slug": "sukanya-samriddhi-yojana",
            "name": "Sukanya Samriddhi Yojana (SSY)",
            "short_name": "SSY",
            "description": "A government-backed small savings scheme under the 'Beti Bachao Beti Padhao' campaign designed to build a dedicated financial fund for the education and marriage of a girl child.",
            "government_level": "central",
            "state_code": None,
            "state_name": "All India",
            "department": "Department of Economic Affairs, Ministry of Finance / India Post",
            "category": "Women & Child Welfare",
            "target_beneficiaries": ["Girl Children (under 10 years)", "Parents / Legal Guardians"],
            "benefits": [
                "Highest interest rate among small savings schemes (8.2% p.a. compounded annually)",
                "Complete Triple EEE tax exemption under Section 80C (investment, interest, and maturity amount)",
                "Partial withdrawal allowed up to 50% for higher education expenses after girl reaches age 18",
                "Account matures after 21 years from the date of opening"
            ],
            "application_mode": "Post Offices & Authorized Commercial Bank Branches",
            "application_url": "https://www.indiapost.gov.in/Financial/Pages/Content/Sukanya-Samriddhi-Account.aspx",
            "official_source_url": "https://www.nsiindia.gov.in/",
            "last_verified_at": datetime(2026, 10, 5, tzinfo=timezone.utc),
            "is_featured": True,
            "rules": [
                {
                    "rule_type": "composite",
                    "rule_definition": {
                        "allowed_states": ["ALL"],
                        "gender_required": "Female",
                        "max_age": 10,
                        "unverified_conditions": ["Account must be opened by natural or legal guardian on behalf of the minor girl"]
                    },
                    "source_url": "https://www.nsiindia.gov.in/"
                }
            ],
            "documents": [
                {
                    "document_name": "Birth Certificate of Girl Child",
                    "is_required": True,
                    "description": "Official birth certificate issued by municipal corporation or registrar of births."
                },
                {
                    "document_name": "Guardian Identity and Address Proof",
                    "is_required": True,
                    "description": "Aadhaar Card or PAN Card of the parent or legal guardian."
                }
            ]
        },
        {
            "slug": "rythu-bharosa-telangana",
            "name": "Rythu Bharosa / Rythu Bandhu Scheme",
            "short_name": "Rythu Bharosa",
            "description": "Telangana government's pioneer direct investment support scheme for agriculture, providing seasonal financial assistance per acre to farmers before kharif and rabi sowing seasons.",
            "government_level": "state",
            "state_code": "TG",
            "state_name": "Telangana",
            "department": "Agriculture and Cooperation Department, Government of Telangana",
            "category": "Agriculture",
            "target_beneficiaries": ["Telangana Landholding Cultivators", "Small and Marginal Farmers"],
            "benefits": [
                "Financial assistance of ₹15,000 per acre per year (₹7,500 per acre per crop season)",
                "Direct credit into farmers bank accounts through e-Kuber portal",
                "Relieves farmers from the debt trap of private non-institutional moneylenders",
                "Covers costs of seeds, tilling, fertilizer, insecticides, and labour"
            ],
            "application_mode": "Online via Dharani Revenue Records",
            "application_url": "https://rythubandhu.telangana.gov.in/",
            "official_source_url": "https://rythubandhu.telangana.gov.in/",
            "last_verified_at": datetime(2026, 10, 19, tzinfo=timezone.utc),
            "is_featured": True,
            "rules": [
                {
                    "rule_type": "composite",
                    "rule_definition": {
                        "allowed_states": ["TG"],
                        "farmer_required": True,
                        "min_age": 18,
                        "unverified_conditions": ["Possession of electronic Pattadar Passbook recorded on Dharani portal"]
                    },
                    "source_url": "https://rythubandhu.telangana.gov.in/"
                }
            ],
            "documents": [
                {
                    "document_name": "Telangana Pattadar Passbook (Dharani Record)",
                    "is_required": True,
                    "description": "Electronic title deed-cum-passbook issued by Revenue Department."
                },
                {
                    "document_name": "Aadhaar Card",
                    "is_required": True,
                    "description": "Linked with Pattadar Passbook record."
                },
                {
                    "document_name": "Bank Account Passbook Copy",
                    "is_required": True,
                    "description": "Active savings account in Telangana."
                }
            ]
        },
        {
            "slug": "aarogyasri-telangana",
            "name": "Dr. YSR / Rajiv Aarogyasri Health Scheme (Telangana)",
            "short_name": "Aarogyasri (TG)",
            "description": "Comprehensive healthcare assurance scheme by the Telangana Government providing catastrophic healthcare treatment to BPL families across accredited network hospitals.",
            "government_level": "state",
            "state_code": "TG",
            "state_name": "Telangana",
            "department": "Aarogyasri Health Care Trust, Government of Telangana",
            "category": "Healthcare",
            "target_beneficiaries": ["Food Security Card Holders in Telangana", "Low-income Families"],
            "benefits": [
                "Cashless medical and surgical cover up to ₹10,00,000 per family per annum",
                "Covers 1,672 listed medical therapies and critical surgical procedures",
                "Free follow-up consultations and prescription medications for one year post-surgery",
                "Round-the-clock help desks (Aarogyamithra) at all network hospitals"
            ],
            "application_mode": "Hospital Aarogya Mithra Desk",
            "application_url": "https://aarogyasri.telangana.gov.in/",
            "official_source_url": "https://aarogyasri.telangana.gov.in/",
            "last_verified_at": datetime(2026, 10, 19, tzinfo=timezone.utc),
            "is_featured": True,
            "rules": [
                {
                    "rule_type": "composite",
                    "rule_definition": {
                        "allowed_states": ["TG"],
                        "max_annual_income": 200000,
                        "unverified_conditions": ["Holder of Telangana Food Security Card (White Ration Card)"]
                    },
                    "source_url": "https://aarogyasri.telangana.gov.in/"
                }
            ],
            "documents": [
                {
                    "document_name": "Food Security Card (White Ration Card)",
                    "is_required": True,
                    "description": "Issued by Department of Consumer Affairs, Food & Civil Supplies, Telangana."
                },
                {
                    "document_name": "Aadhaar Card",
                    "is_required": True,
                    "description": "For patient and attending family member identification."
                }
            ]
        },
        {
            "slug": "gruha-lakshmi-karnataka",
            "name": "Gruha Lakshmi Scheme (Karnataka)",
            "short_name": "Gruha Lakshmi",
            "description": "Flagship welfare guarantee scheme of the Government of Karnataka offering direct financial security to female heads of households to foster gender equality and financial autonomy.",
            "government_level": "state",
            "state_code": "KA",
            "state_name": "Karnataka",
            "department": "Department of Women and Child Development, Government of Karnataka",
            "category": "Women & Child Welfare",
            "target_beneficiaries": ["Women Heads of Household in Karnataka"],
            "benefits": [
                "Fixed monthly financial assistance of ₹2,000 directly transferred via DBT",
                "Annual guaranteed support of ₹24,000 per eligible household",
                "Strengthens purchasing power and nutritional well-being of low-income families",
                "Zero application fee across all Seva Sindhu / Bangalore One centres"
            ],
            "application_mode": "Online (Seva Sindhu) / Grama One / Karnataka One",
            "application_url": "https://sevasindhugs.karnataka.gov.in/",
            "official_source_url": "https://sevasindhu.karnataka.gov.in/",
            "last_verified_at": datetime(2026, 10, 15, tzinfo=timezone.utc),
            "is_featured": True,
            "rules": [
                {
                    "rule_type": "composite",
                    "rule_definition": {
                        "allowed_states": ["KA"],
                        "gender_required": "Female",
                        "min_age": 18,
                        "unverified_conditions": ["Designated woman head of house on Ration Card (APL/BPL/AAY)", "Neither applicant nor spouse files Income Tax or GST returns"]
                    },
                    "source_url": "https://sevasindhu.karnataka.gov.in/"
                }
            ],
            "documents": [
                {
                    "document_name": "Ration Card (APL, BPL, or Antyodaya)",
                    "is_required": True,
                    "description": "Card showing applicant as the woman head of family."
                },
                {
                    "document_name": "Aadhaar Card of Woman Head & Husband",
                    "is_required": True,
                    "description": "For e-KYC and family verification."
                },
                {
                    "document_name": "Aadhaar-Linked Bank Account Passbook",
                    "is_required": True,
                    "description": "Account enabled for NPCI direct benefit transfers."
                }
            ]
        },
        {
            "slug": "yuva-nidhi-karnataka",
            "name": "Yuva Nidhi Scheme (Karnataka)",
            "short_name": "Yuva Nidhi",
            "description": "Unemployment assistance initiative by the Government of Karnataka granting monthly financial aid to educated youth who have graduated or completed diplomas and are actively seeking employment.",
            "government_level": "state",
            "state_code": "KA",
            "state_name": "Karnataka",
            "department": "Department of Skill Development, Entrepreneurship and Livelihood, Karnataka",
            "category": "Employment",
            "target_beneficiaries": ["Unemployed Degree Holders", "Unemployed Diploma Holders in Karnataka"],
            "benefits": [
                "₹3,000 per month for degree holders for up to 24 months or until employment",
                "₹1,500 per month for diploma holders for up to 24 months or until employment",
                "Free skill training and placement support via Karnataka Skill Mission",
                "Direct bank transfer on monthly schedule"
            ],
            "application_mode": "Online (Seva Sindhu Portal)",
            "application_url": "https://sevasindhuservices.karnataka.gov.in/",
            "official_source_url": "https://sevasindhu.karnataka.gov.in/",
            "last_verified_at": datetime(2026, 10, 11, tzinfo=timezone.utc),
            "is_featured": False,
            "rules": [
                {
                    "rule_type": "composite",
                    "rule_definition": {
                        "allowed_states": ["KA"],
                        "min_age": 18,
                        "max_age": 35,
                        "unverified_conditions": ["Graduated with degree/diploma in or after 2022-23 and remained unemployed for at least 6 months", "Not pursuing higher studies or enrolled under apprentice programs"]
                    },
                    "source_url": "https://sevasindhuservices.karnataka.gov.in/"
                }
            ],
            "documents": [
                {
                    "document_name": "Degree / Diploma Certificate",
                    "is_required": True,
                    "description": "Official graduation certificate and final year marks cards."
                },
                {
                    "document_name": "Karnataka Domicile Certificate",
                    "is_required": True,
                    "description": "Proof of having studied at least 6 years in Karnataka or resident certificate."
                },
                {
                    "document_name": "Aadhaar Card",
                    "is_required": True,
                    "description": "Linked with bank account and mobile number."
                }
            ]
        },
        {
            "slug": "mahadbt-post-matric-scholarship",
            "name": "Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti (MahaDBT)",
            "short_name": "MahaDBT Scholarship",
            "description": "Scholarship scheme by Maharashtra Government providing reimbursement of 50% tuition and exam fees to students belonging to economically weaker sections pursuing higher education.",
            "government_level": "state",
            "state_code": "MH",
            "state_name": "Maharashtra",
            "department": "Directorate of Higher Education / Technical Education, Maharashtra",
            "category": "Education",
            "target_beneficiaries": ["EBC / Open / General Students in Maharashtra", "College Students"],
            "benefits": [
                "50% waiver of tuition fees and exam fees in government and aided professional colleges",
                "Direct credit into student or college account through MahaDBT portal",
                "Covers engineering, medicine, pharmacy, management, arts, commerce, and science courses"
            ],
            "application_mode": "Online (MahaDBT Portal)",
            "application_url": "https://mahadbt.maharashtra.gov.in/",
            "official_source_url": "https://mahadbt.maharashtra.gov.in/",
            "last_verified_at": datetime(2026, 10, 14, tzinfo=timezone.utc),
            "is_featured": False,
            "rules": [
                {
                    "rule_type": "composite",
                    "rule_definition": {
                        "allowed_states": ["MH"],
                        "student_required": True,
                        "max_annual_income": 800000,
                        "min_age": 16,
                        "max_age": 32,
                        "unverified_conditions": ["Admitted through Centralized Admission Process (CAP) in Maharashtra"]
                    },
                    "source_url": "https://mahadbt.maharashtra.gov.in/"
                }
            ],
            "documents": [
                {
                    "document_name": "Maharashtra Domicile Certificate",
                    "is_required": True,
                    "description": "Issued by Tahsildar / Sub-Divisional Magistrate."
                },
                {
                    "document_name": "Annual Income Certificate (Current Year)",
                    "is_required": True,
                    "description": "Issued by competent authority proving family income <= ₹8.00 Lakh."
                },
                {
                    "document_name": "CAP Allotment Letter",
                    "is_required": True,
                    "description": "Government CAP admission allotment confirmation."
                }
            ]
        },
        {
            "slug": "mukhyamantri-kanya-sumangala-up",
            "name": "Mukhyamantri Kanya Sumangala Yojana (Uttar Pradesh)",
            "short_name": "Kanya Sumangala",
            "description": "Pioneering conditional cash transfer initiative by the Uttar Pradesh Government to promote female literacy, health, and social equality by providing financial grants at key developmental milestones.",
            "government_level": "state",
            "state_code": "UP",
            "state_name": "Uttar Pradesh",
            "department": "Women and Child Development Department, Government of Uttar Pradesh",
            "category": "Women & Child Welfare",
            "target_beneficiaries": ["Girl Children in Uttar Pradesh", "Families with up to 2 Girls"],
            "benefits": [
                "Total grant of up to ₹25,000 paid across 6 developmental milestones",
                "Stage 1: ₹5,000 at birth of girl child",
                "Stage 2: ₹2,000 upon completing full immunization within 1 year",
                "Stage 3: ₹3,000 upon admission into Class 1",
                "Stage 4: ₹3,000 upon admission into Class 6",
                "Stage 5: ₹5,000 upon admission into Class 9",
                "Stage 6: ₹7,000 upon passing 10th/12th and enrolling in 2+ year undergraduate course"
            ],
            "application_mode": "Online Portal (MKSY UP)",
            "application_url": "https://mksy.up.gov.in/",
            "official_source_url": "https://mksy.up.gov.in/",
            "last_verified_at": datetime(2026, 10, 17, tzinfo=timezone.utc),
            "is_featured": True,
            "rules": [
                {
                    "rule_type": "composite",
                    "rule_definition": {
                        "allowed_states": ["UP"],
                        "gender_required": "Female",
                        "max_age": 22,
                        "max_annual_income": 300000,
                        "unverified_conditions": ["Family must be permanent resident of Uttar Pradesh with maximum 2 children"]
                    },
                    "source_url": "https://mksy.up.gov.in/"
                }
            ],
            "documents": [
                {
                    "document_name": "UP Resident / Domicile Certificate",
                    "is_required": True,
                    "description": "Proof of permanent residence in Uttar Pradesh."
                },
                {
                    "document_name": "Income Certificate",
                    "is_required": True,
                    "description": "Certificate from Tahsildar indicating family income does not exceed ₹3,00,000 p.a."
                },
                {
                    "document_name": "Birth Certificate of Girl Child",
                    "is_required": True,
                    "description": "Municipal or Panchayat birth certificate."
                },
                {
                    "document_name": "School Admission Certificate / Marksheet",
                    "is_required": False,
                    "description": "Required for Stages 3 through 6."
                }
            ]
        }
    ]


async def seed_database(session):
    from sqlalchemy import select
    # Check if schemes already exist
    result = await session.execute(select(Scheme).limit(1))
    if result.scalars().first() is not None:
        return  # already seeded

    schemes_data = get_verified_schemes()
    for s_data in schemes_data:
        rules_data = s_data.pop("rules", [])
        docs_data = s_data.pop("documents", [])

        scheme = Scheme(**s_data)
        session.add(scheme)
        await session.flush()

        for r_data in rules_data:
            rule = EligibilityRule(scheme_id=scheme.id, **r_data)
            session.add(rule)

        for d_data in docs_data:
            doc = SchemeDocument(scheme_id=scheme.id, **d_data)
            session.add(doc)

    await session.commit()
