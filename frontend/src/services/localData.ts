import { Scheme, EligibilityResult, CategoryInfo, StateInfo, CitizenProfile, ApplicationChecklist } from '../types';

export const VERIFIED_SCHEMES_DATA: Scheme[] = [
  {
    id: '1',
    slug: 'pm-kisan-samman-nidhi',
    name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    short_name: 'PM-KISAN',
    description: 'An initiative by the Government of India that provides income support to all landholding farmer families across the country to assist with agricultural inputs and domestic needs.',
    government_level: 'central',
    state_code: undefined,
    state_name: 'All India',
    department: 'Ministry of Agriculture and Farmers Welfare',
    category: 'Agriculture',
    target_beneficiaries: ['Small and Marginal Farmers', 'Landholding Cultivators'],
    benefits: [
      'Direct benefit transfer of ₹6,000 per year into bank accounts',
      'Paid in three equal four-monthly installments of ₹2,000 each',
      'Direct credit via Aadhaar-enabled bank transfer without intermediaries',
      'Enables procurement of quality seeds, fertilizers, and agricultural inputs'
    ],
    application_mode: 'Online & Assisted (CSC)',
    application_url: 'https://pmkisan.gov.in/RegistrationFormNew.aspx',
    official_source_url: 'https://pmkisan.gov.in/',
    last_verified_at: '2026-10-15T00:00:00Z',
    is_featured: true,
    documents: [
      {
        id: 'doc-1-1',
        document_name: 'Aadhaar Card',
        is_required: true,
        description: 'Mandatory identity proof; must be linked with applicant bank account.'
      },
      {
        id: 'doc-1-2',
        document_name: 'Land Ownership Record (Khatauni / RoR / Pattadar Passbook)',
        is_required: true,
        description: 'Official state land revenue record proving cultivable land ownership.'
      },
      {
        id: 'doc-1-3',
        document_name: 'Active Bank Passbook',
        is_required: true,
        description: 'Bank account statement showing IFSC code and active Aadhaar NPCI seeding.'
      }
    ],
    rules: [
      {
        id: 'rule-1',
        rule_type: 'composite',
        rule_definition: {
          allowed_states: ['ALL'],
          farmer_required: true,
          min_age: 18,
          unverified_conditions: [
            'Active land ownership record in state revenue database',
            'Not an institutional landholder or income-tax payer'
          ]
        },
        source_url: 'https://pmkisan.gov.in/'
      }
    ]
  },
  {
    id: '2',
    slug: 'ayushman-bharat-pmjay',
    name: 'Ayushman Bharat — Pradhan Mantri Jan Arogya Yojana (PM-JAY)',
    short_name: 'AB PM-JAY',
    description: 'The world\'s largest government-funded health assurance scheme, offering health insurance coverage for secondary and tertiary care hospitalization to economically vulnerable citizens.',
    government_level: 'central',
    state_code: undefined,
    state_name: 'All India',
    department: 'National Health Authority (NHA), Ministry of Health and Family Welfare',
    category: 'Healthcare',
    target_beneficiaries: ['Low-income Families', 'Senior Citizens (70+)', 'SECC Deprived Households'],
    benefits: [
      'Health cover of ₹5,00,000 per family per year for secondary and tertiary care',
      'Covers up to 3 days of pre-hospitalization and 15 days of post-hospitalization expenses',
      'Cashless treatment at over 27,000 empanelled public and private hospitals across India',
      'Special Ayushman Vay Vandana Card available to all senior citizens aged 70+ irrespective of family income'
    ],
    application_mode: 'Online & Empanelled Hospital Kiosks',
    application_url: 'https://beneficiary.nha.gov.in/',
    official_source_url: 'https://nha.gov.in/PM-JAY',
    last_verified_at: '2026-10-18T00:00:00Z',
    is_featured: true,
    documents: [
      {
        id: 'doc-2-1',
        document_name: 'Aadhaar Card',
        is_required: true,
        description: 'Used for instant electronic KYC verification on the Beneficiary Portal.'
      },
      {
        id: 'doc-2-2',
        document_name: 'Ration Card / Family ID',
        is_required: true,
        description: 'State ration card or NFSA card indicating family composition.'
      }
    ],
    rules: [
      {
        id: 'rule-2',
        rule_type: 'composite',
        rule_definition: {
          allowed_states: ['ALL'],
          max_annual_income: 250000,
          unverified_conditions: ['Deprivation criteria under SECC 2011 or valid state Food Security Card']
        },
        source_url: 'https://beneficiary.nha.gov.in/'
      }
    ]
  },
  {
    id: '3',
    slug: 'nsp-post-matric-scholarship-sc-st',
    name: 'Post-Matric Scholarship for SC and ST Students',
    short_name: 'NSP Post-Matric',
    description: 'Centrally sponsored scholarship scheme to provide financial assistance to Scheduled Caste and Scheduled Tribe students studying at post-matriculation or post-secondary stage.',
    government_level: 'central',
    state_code: undefined,
    state_name: 'All India',
    department: 'Ministry of Social Justice and Empowerment / Ministry of Tribal Affairs',
    category: 'Education',
    target_beneficiaries: ['SC Students', 'ST Students', 'Post-Matric College Students'],
    benefits: [
      '100% compulsory non-refundable fees reimbursed directly to institution or student',
      'Monthly maintenance allowance from ₹2,500 to ₹13,500 depending on course group',
      'Additional disability allowances and book bank grants where applicable',
      'Covers degree, diploma, post-graduate, and doctoral qualifications'
    ],
    application_mode: 'Online (National Scholarship Portal)',
    application_url: 'https://scholarships.gov.in/',
    official_source_url: 'https://scholarships.gov.in/',
    last_verified_at: '2026-10-12T00:00:00Z',
    is_featured: true,
    documents: [
      {
        id: 'doc-3-1',
        document_name: 'Caste Certificate',
        is_required: true,
        description: 'Permanent caste certificate issued by an authorized state revenue officer (Tahsildar / SDO).'
      },
      {
        id: 'doc-3-2',
        document_name: 'Income Certificate',
        is_required: true,
        description: 'Competent authority certificate validating family income is below ₹2.50 Lakh p.a.'
      },
      {
        id: 'doc-3-3',
        document_name: 'Previous Qualifying Marksheet',
        is_required: true,
        description: 'Class 10 / 12 or previous semester passing certificate.'
      },
      {
        id: 'doc-3-4',
        document_name: 'College Bonafide & Fee Receipt',
        is_required: true,
        description: 'Bonafide student certificate and official tuition fee payment receipt.'
      }
    ],
    rules: [
      {
        id: 'rule-3',
        rule_type: 'composite',
        rule_definition: {
          allowed_states: ['ALL'],
          student_required: true,
          allowed_categories: ['SC', 'ST'],
          max_annual_income: 250000,
          min_age: 15,
          max_age: 35
        },
        source_url: 'https://scholarships.gov.in/'
      }
    ]
  },
  {
    id: '4',
    slug: 'pradhan-mantri-awas-yojana-gramin',
    name: 'Pradhan Mantri Awas Yojana — Gramin (PMAY-G)',
    short_name: 'PMAY-G',
    description: 'Flagship rural housing scheme dedicated to assisting rural families living in kutcha or dilapidated houses in constructing a hygienic, permanent pucca dwelling with basic amenities.',
    government_level: 'central',
    state_code: undefined,
    state_name: 'All India',
    department: 'Ministry of Rural Development',
    category: 'Housing',
    target_beneficiaries: ['Houseless Families', 'Rural Households living in Kutcha Homes'],
    benefits: [
      'Financial assistance of ₹1,20,000 in plain areas and ₹1,30,000 in hilly/difficult/IAP areas',
      '90 to 95 days of unskilled labour support under MGNREGS (approx ₹20,000+)',
      'Additional assistance of ₹12,000 for toilet construction under Swachh Bharat Mission',
      'Convergent assistance for electricity connection (Saubhagya) and LPG (Ujjwala)'
    ],
    application_mode: 'Gram Panchayat Selection & AwaasApp',
    application_url: 'https://pmayg.nic.in/netiay/AwaasPlus/CitizenCorner.aspx',
    official_source_url: 'https://pmayg.nic.in/',
    last_verified_at: '2026-10-08T00:00:00Z',
    is_featured: false,
    documents: [
      {
        id: 'doc-4-1',
        document_name: 'Aadhaar Card',
        is_required: true,
        description: 'Aadhaar details of all family members.'
      },
      {
        id: 'doc-4-2',
        document_name: 'MGNREGA Job Card',
        is_required: true,
        description: 'Registered Job Card to transfer 90 days of construction wages.'
      },
      {
        id: 'doc-4-3',
        document_name: 'Bank Account Details',
        is_required: true,
        description: 'Geo-tagged photograph of current kutcha dwelling and active bank passbook.'
      }
    ],
    rules: [
      {
        id: 'rule-4',
        rule_type: 'composite',
        rule_definition: {
          allowed_states: ['ALL'],
          max_annual_income: 200000,
          unverified_conditions: [
            'Must not own a motorized vehicle, mechanized farm equipment, or pucca house',
            'Listed in Awaas+ survey list'
          ]
        },
        source_url: 'https://pmayg.nic.in/'
      }
    ]
  },
  {
    id: '5',
    slug: 'atal-pension-yojana',
    name: 'Atal Pension Yojana (APY)',
    short_name: 'APY',
    description: 'A guaranteed periodic pension scheme administered by PFRDA targeted towards unorganized sector workers, securing retirement savings with government-backed returns.',
    government_level: 'central',
    state_code: undefined,
    state_name: 'All India',
    department: 'Pension Fund Regulatory and Development Authority (PFRDA)',
    category: 'Senior Citizens',
    target_beneficiaries: ['Unorganized Sector Workers', 'Self-employed Citizens', 'Young Adults (18-40)'],
    benefits: [
      'Guaranteed monthly pension of ₹1,000, ₹2,000, ₹3,000, ₹4,000, or ₹5,000 upon reaching age 60',
      'Same pension continued to spouse for lifetime upon subscriber death',
      'Full accumulated pension corpus returned to designated nominee after both die',
      'Tax deduction benefits under Section 80CCD'
    ],
    application_mode: 'Online Banking & Bank Branches',
    application_url: 'https://enps.nsdl.com/eNPS/ApySubRegistration.html',
    official_source_url: 'https://www.npscra.nsdl.co.in/scheme-details.php',
    last_verified_at: '2026-10-10T00:00:00Z',
    is_featured: true,
    documents: [
      {
        id: 'doc-5-1',
        document_name: 'Savings Bank Account',
        is_required: true,
        description: 'Active savings account in any commercial or regional rural bank with auto-debit facility.'
      },
      {
        id: 'doc-5-2',
        document_name: 'Aadhaar Card',
        is_required: true,
        description: 'For identity verification and KYC records.'
      }
    ],
    rules: [
      {
        id: 'rule-5',
        rule_type: 'composite',
        rule_definition: {
          allowed_states: ['ALL'],
          min_age: 18,
          max_age: 40,
          unverified_conditions: ['Subscriber must not be an income-tax payer']
        },
        source_url: 'https://www.npscra.nsdl.co.in/'
      }
    ]
  },
  {
    id: '6',
    slug: 'pradhan-mantri-mudra-yojana',
    name: 'Pradhan Mantri MUDRA Yojana (PMMY)',
    short_name: 'MUDRA',
    description: 'Provides formal institutional micro-credit up to ₹10 Lakhs to micro and small non-farm, non-corporate enterprises without requiring collateral.',
    government_level: 'central',
    state_code: undefined,
    state_name: 'All India',
    department: 'Department of Financial Services, Ministry of Finance',
    category: 'Employment',
    target_beneficiaries: ['Small Business Owners', 'Shopkeepers', 'Artisans', 'First-time Entrepreneurs'],
    benefits: [
      'Shishu category: Collateral-free loans up to ₹50,000 for seed stage',
      'Kishore category: Loans from ₹50,001 up to ₹5,00,000 for equipment purchase',
      'Tarun category: Loans from ₹5,00,001 up to ₹10,00,000 for business expansion',
      'Zero collateral, competitive interest rates'
    ],
    application_mode: 'Online (Udyamimitra) & Bank Branches',
    application_url: 'https://www.udyamimitra.in/',
    official_source_url: 'https://www.mudra.org.in/',
    last_verified_at: '2026-10-14T00:00:00Z',
    is_featured: false,
    documents: [
      {
        id: 'doc-6-1',
        document_name: 'Identity & Address Proof',
        is_required: true,
        description: 'Aadhaar / Voter ID / PAN Card.'
      },
      {
        id: 'doc-6-2',
        document_name: 'Business Address Proof & Quotation',
        is_required: true,
        description: 'Rent agreement/Udyam registration and proforma invoice for machinery or materials.'
      }
    ],
    rules: [
      {
        id: 'rule-6',
        rule_type: 'composite',
        rule_definition: {
          allowed_states: ['ALL'],
          min_age: 18,
          unverified_conditions: ['Must have viable business plan and not be a defaulter at any financial institution']
        },
        source_url: 'https://www.mudra.org.in/'
      }
    ]
  },
  {
    id: '7',
    slug: 'pm-svanidhi',
    name: 'PM Street Vendor\'s AtmaNirbhar Nidhi (PM SVANidhi)',
    short_name: 'PM SVANidhi',
    description: 'Special micro-credit facility empowering urban street vendors to restart livelihoods with affordable working capital and digital transaction incentives.',
    government_level: 'central',
    state_code: undefined,
    state_name: 'All India',
    department: 'Ministry of Housing and Urban Affairs',
    category: 'Financial Assistance',
    target_beneficiaries: ['Street Vendors', 'Hawkers', 'Thela-walas', 'Urban Micro-merchants'],
    benefits: [
      '1st Tranche collateral-free working capital loan of ₹10,000 (1 year tenure)',
      '2nd Tranche loan of up to ₹20,000 on prompt repayment of first loan',
      '7% per annum interest subsidy directly credited via DBT'
    ],
    application_mode: 'Online Portal & Mobile App',
    application_url: 'https://pmsvanidhi.mohua.gov.in/',
    official_source_url: 'https://pmsvanidhi.mohua.gov.in/',
    last_verified_at: '2026-10-16T00:00:00Z',
    is_featured: false,
    documents: [
      {
        id: 'doc-7-1',
        document_name: 'Aadhaar Card',
        is_required: true,
        description: 'Linked to active mobile number for OTP confirmation.'
      },
      {
        id: 'doc-7-2',
        document_name: 'Certificate of Vending (CoV) / Identity Card',
        is_required: true,
        description: 'Document issued by Municipality or Town Vending Committee (TVC).'
      }
    ],
    rules: [
      {
        id: 'rule-7',
        rule_type: 'composite',
        rule_definition: {
          allowed_states: ['ALL'],
          min_age: 18,
          unverified_conditions: ['Possession of Certificate of Vending or Urban Local Body recommendation letter']
        },
        source_url: 'https://pmsvanidhi.mohua.gov.in/'
      }
    ]
  },
  {
    id: '8',
    slug: 'sukanya-samriddhi-yojana',
    name: 'Sukanya Samriddhi Yojana (SSY)',
    short_name: 'SSY',
    description: 'A government-backed small savings scheme under Beti Bachao Beti Padhao designed to build a fund for girl child higher education and marriage.',
    government_level: 'central',
    state_code: undefined,
    state_name: 'All India',
    department: 'Department of Economic Affairs, Ministry of Finance / India Post',
    category: 'Women & Child Welfare',
    target_beneficiaries: ['Girl Children (under 10 years)', 'Parents / Legal Guardians'],
    benefits: [
      'Highest interest rate among small savings schemes (8.2% p.a. compounded annually)',
      'Complete Triple EEE tax exemption under Section 80C'
    ],
    application_mode: 'Post Offices & Authorized Commercial Bank Branches',
    application_url: 'https://www.indiapost.gov.in/',
    official_source_url: 'https://www.nsiindia.gov.in/',
    last_verified_at: '2026-10-05T00:00:00Z',
    is_featured: true,
    documents: [
      {
        id: 'doc-8-1',
        document_name: 'Birth Certificate of Girl Child',
        is_required: true,
        description: 'Official birth certificate issued by municipal corporation or registrar.'
      },
      {
        id: 'doc-8-2',
        document_name: 'Guardian Identity and Address Proof',
        is_required: true,
        description: 'Aadhaar Card or PAN Card of the parent or legal guardian.'
      }
    ],
    rules: [
      {
        id: 'rule-8',
        rule_type: 'composite',
        rule_definition: {
          allowed_states: ['ALL'],
          gender_required: 'Female',
          max_age: 10,
          unverified_conditions: ['Account opened by natural or legal guardian on behalf of minor girl']
        },
        source_url: 'https://www.nsiindia.gov.in/'
      }
    ]
  },
  {
    id: '9',
    slug: 'rythu-bharosa-telangana',
    name: 'Rythu Bharosa / Rythu Bandhu Scheme',
    short_name: 'Rythu Bharosa',
    description: 'Telangana government\'s pioneer direct investment support scheme for agriculture, providing seasonal financial assistance per acre to farmers before sowing seasons.',
    government_level: 'state',
    state_code: 'TG',
    state_name: 'Telangana',
    department: 'Agriculture and Cooperation Department, Government of Telangana',
    category: 'Agriculture',
    target_beneficiaries: ['Telangana Landholding Cultivators', 'Small and Marginal Farmers'],
    benefits: [
      'Financial assistance of ₹15,000 per acre per year (₹7,500 per acre per crop season)',
      'Direct credit into farmers bank accounts through e-Kuber portal',
      'Relieves farmers from the debt trap of private non-institutional moneylenders'
    ],
    application_mode: 'Online via Dharani Revenue Records',
    application_url: 'https://rythubandhu.telangana.gov.in/',
    official_source_url: 'https://rythubandhu.telangana.gov.in/',
    last_verified_at: '2026-10-19T00:00:00Z',
    is_featured: true,
    documents: [
      {
        id: 'doc-9-1',
        document_name: 'Telangana Pattadar Passbook (Dharani Record)',
        is_required: true,
        description: 'Electronic title deed-cum-passbook issued by Revenue Department.'
      },
      {
        id: 'doc-9-2',
        document_name: 'Aadhaar Card',
        is_required: true,
        description: 'Linked with Pattadar Passbook record.'
      }
    ],
    rules: [
      {
        id: 'rule-9',
        rule_type: 'composite',
        rule_definition: {
          allowed_states: ['TG'],
          farmer_required: true,
          min_age: 18,
          unverified_conditions: ['Possession of electronic Pattadar Passbook recorded on Dharani portal']
        },
        source_url: 'https://rythubandhu.telangana.gov.in/'
      }
    ]
  },
  {
    id: '10',
    slug: 'aarogyasri-telangana',
    name: 'Dr. YSR / Rajiv Aarogyasri Health Scheme (Telangana)',
    short_name: 'Aarogyasri (TG)',
    description: 'Comprehensive healthcare assurance scheme by the Telangana Government providing catastrophic healthcare treatment to BPL families across accredited network hospitals.',
    government_level: 'state',
    state_code: 'TG',
    state_name: 'Telangana',
    department: 'Aarogyasri Health Care Trust, Government of Telangana',
    category: 'Healthcare',
    target_beneficiaries: ['Food Security Card Holders in Telangana', 'Low-income Families'],
    benefits: [
      'Cashless medical and surgical cover up to ₹10,00,000 per family per annum',
      'Covers 1,672 listed medical therapies and critical surgical procedures'
    ],
    application_mode: 'Hospital Aarogya Mithra Desk',
    application_url: 'https://aarogyasri.telangana.gov.in/',
    official_source_url: 'https://aarogyasri.telangana.gov.in/',
    last_verified_at: '2026-10-19T00:00:00Z',
    is_featured: true,
    documents: [
      {
        id: 'doc-10-1',
        document_name: 'Food Security Card (White Ration Card)',
        is_required: true,
        description: 'Issued by Department of Consumer Affairs, Food & Civil Supplies, Telangana.'
      },
      {
        id: 'doc-10-2',
        document_name: 'Aadhaar Card',
        is_required: true,
        description: 'For patient and attending family member identification.'
      }
    ],
    rules: [
      {
        id: 'rule-10',
        rule_type: 'composite',
        rule_definition: {
          allowed_states: ['TG'],
          max_annual_income: 200000,
          unverified_conditions: ['Holder of Telangana Food Security Card (White Ration Card)']
        },
        source_url: 'https://aarogyasri.telangana.gov.in/'
      }
    ]
  },
  {
    id: '11',
    slug: 'gruha-lakshmi-karnataka',
    name: 'Gruha Lakshmi Scheme (Karnataka)',
    short_name: 'Gruha Lakshmi',
    description: 'Flagship welfare guarantee scheme of the Government of Karnataka offering direct financial security to female heads of households.',
    government_level: 'state',
    state_code: 'KA',
    state_name: 'Karnataka',
    department: 'Department of Women and Child Development, Government of Karnataka',
    category: 'Women & Child Welfare',
    target_beneficiaries: ['Women Heads of Household in Karnataka'],
    benefits: [
      'Fixed monthly financial assistance of ₹2,000 directly transferred via DBT',
      'Annual guaranteed support of ₹24,000 per eligible household'
    ],
    application_mode: 'Online (Seva Sindhu) / Grama One',
    application_url: 'https://sevasindhugs.karnataka.gov.in/',
    official_source_url: 'https://sevasindhu.karnataka.gov.in/',
    last_verified_at: '2026-10-15T00:00:00Z',
    is_featured: true,
    documents: [
      {
        id: 'doc-11-1',
        document_name: 'Ration Card (APL, BPL, or Antyodaya)',
        is_required: true,
        description: 'Card showing applicant as the woman head of family.'
      },
      {
        id: 'doc-11-2',
        document_name: 'Aadhaar Card of Woman Head & Husband',
        is_required: true,
        description: 'For e-KYC and family verification.'
      }
    ],
    rules: [
      {
        id: 'rule-11',
        rule_type: 'composite',
        rule_definition: {
          allowed_states: ['KA'],
          gender_required: 'Female',
          min_age: 18,
          unverified_conditions: ['Designated woman head of house on Ration Card', 'Neither applicant nor spouse files Income Tax or GST']
        },
        source_url: 'https://sevasindhu.karnataka.gov.in/'
      }
    ]
  },
  {
    id: '12',
    slug: 'yuva-nidhi-karnataka',
    name: 'Yuva Nidhi Scheme (Karnataka)',
    short_name: 'Yuva Nidhi',
    description: 'Unemployment assistance initiative by the Government of Karnataka granting monthly financial aid to educated youth who have graduated or completed diplomas.',
    government_level: 'state',
    state_code: 'KA',
    state_name: 'Karnataka',
    department: 'Department of Skill Development, Karnataka',
    category: 'Employment',
    target_beneficiaries: ['Unemployed Degree Holders', 'Unemployed Diploma Holders in Karnataka'],
    benefits: [
      '₹3,000 per month for degree holders for up to 24 months',
      '₹1,500 per month for diploma holders for up to 24 months'
    ],
    application_mode: 'Online (Seva Sindhu Portal)',
    application_url: 'https://sevasindhuservices.karnataka.gov.in/',
    official_source_url: 'https://sevasindhu.karnataka.gov.in/',
    last_verified_at: '2026-10-11T00:00:00Z',
    is_featured: false,
    documents: [
      {
        id: 'doc-12-1',
        document_name: 'Degree / Diploma Certificate',
        is_required: true,
        description: 'Official graduation certificate and final year marks cards.'
      },
      {
        id: 'doc-12-2',
        document_name: 'Karnataka Domicile Certificate',
        is_required: true,
        description: 'Proof of having studied at least 6 years in Karnataka.'
      }
    ],
    rules: [
      {
        id: 'rule-12',
        rule_type: 'composite',
        rule_definition: {
          allowed_states: ['KA'],
          min_age: 18,
          max_age: 35,
          unverified_conditions: ['Graduated with degree/diploma in 2022-23 onwards and remained unemployed for at least 6 months']
        },
        source_url: 'https://sevasindhuservices.karnataka.gov.in/'
      }
    ]
  },
  {
    id: '13',
    slug: 'mahadbt-post-matric-scholarship',
    name: 'Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti (MahaDBT)',
    short_name: 'MahaDBT Scholarship',
    description: 'Scholarship scheme by Maharashtra Government providing reimbursement of 50% tuition and exam fees to students belonging to economically weaker sections pursuing higher education.',
    government_level: 'state',
    state_code: 'MH',
    state_name: 'Maharashtra',
    department: 'Directorate of Higher Education, Maharashtra',
    category: 'Education',
    target_beneficiaries: ['EBC / Open / General Students in Maharashtra', 'College Students'],
    benefits: [
      '50% waiver of tuition fees and exam fees in government and aided professional colleges',
      'Direct credit into student or college account through MahaDBT portal'
    ],
    application_mode: 'Online (MahaDBT Portal)',
    application_url: 'https://mahadbt.maharashtra.gov.in/',
    official_source_url: 'https://mahadbt.maharashtra.gov.in/',
    last_verified_at: '2026-10-14T00:00:00Z',
    is_featured: false,
    documents: [
      {
        id: 'doc-13-1',
        document_name: 'Maharashtra Domicile Certificate',
        is_required: true,
        description: 'Issued by Tahsildar / Sub-Divisional Magistrate.'
      },
      {
        id: 'doc-13-2',
        document_name: 'Annual Income Certificate (Current Year)',
        is_required: true,
        description: 'Issued by competent authority proving family income <= ₹8.00 Lakh.'
      }
    ],
    rules: [
      {
        id: 'rule-13',
        rule_type: 'composite',
        rule_definition: {
          allowed_states: ['MH'],
          student_required: true,
          max_annual_income: 800000,
          min_age: 16,
          max_age: 32,
          unverified_conditions: ['Admitted through Centralized Admission Process (CAP) in Maharashtra']
        },
        source_url: 'https://mahadbt.maharashtra.gov.in/'
      }
    ]
  },
  {
    id: '14',
    slug: 'mukhyamantri-kanya-sumangala-up',
    name: 'Mukhyamantri Kanya Sumangala Yojana (Uttar Pradesh)',
    short_name: 'Kanya Sumangala',
    description: 'Pioneering conditional cash transfer initiative by the Uttar Pradesh Government to promote female literacy, health, and social equality by providing financial grants at key developmental milestones.',
    government_level: 'state',
    state_code: 'UP',
    state_name: 'Uttar Pradesh',
    department: 'Women and Child Development Department, Government of Uttar Pradesh',
    category: 'Women & Child Welfare',
    target_beneficiaries: ['Girl Children in Uttar Pradesh', 'Families with up to 2 Girls'],
    benefits: [
      'Total grant of up to ₹25,000 paid across 6 developmental milestones from birth to college degree enrollment',
      'Direct DBT credit to beneficiary account'
    ],
    application_mode: 'Online Portal (MKSY UP)',
    application_url: 'https://mksy.up.gov.in/',
    official_source_url: 'https://mksy.up.gov.in/',
    last_verified_at: '2026-10-17T00:00:00Z',
    is_featured: true,
    documents: [
      {
        id: 'doc-14-1',
        document_name: 'UP Resident / Domicile Certificate',
        is_required: true,
        description: 'Proof of permanent residence in Uttar Pradesh.'
      },
      {
        id: 'doc-14-2',
        document_name: 'Income Certificate',
        is_required: true,
        description: 'Certificate from Tahsildar indicating family income does not exceed ₹3,00,000 p.a.'
      }
    ],
    rules: [
      {
        id: 'rule-14',
        rule_type: 'composite',
        rule_definition: {
          allowed_states: ['UP'],
          gender_required: 'Female',
          max_age: 22,
          max_annual_income: 300000,
          unverified_conditions: ['Family must be permanent resident of Uttar Pradesh with maximum 2 children']
        },
        source_url: 'https://mksy.up.gov.in/'
      }
    ]
  }
];

export const CATEGORIES_DATA: CategoryInfo[] = [
  { id: 'Education', name: 'Education', icon: 'GraduationCap', description: 'Scholarships, tuition waivers, and student financial aid.', scheme_count: 2 },
  { id: 'Healthcare', name: 'Healthcare', icon: 'HeartPulse', description: 'Cashless health insurance, maternal care, and medical treatment.', scheme_count: 2 },
  { id: 'Agriculture', name: 'Agriculture', icon: 'Sprout', description: 'Farmer income support, input subsidies, and crop assistance.', scheme_count: 2 },
  { id: 'Employment', name: 'Employment', icon: 'Briefcase', description: 'Skill development, unemployment allowances, and micro-business loans.', scheme_count: 2 },
  { id: 'Women & Child Welfare', name: 'Women & Child Welfare', icon: 'Users', description: 'Financial empowerment, girl child support, and maternity grants.', scheme_count: 3 },
  { id: 'Housing', name: 'Housing', icon: 'Home', description: 'Pucca home construction assistance and rural housing grants.', scheme_count: 1 },
  { id: 'Senior Citizens', name: 'Senior Citizens', icon: 'ShieldCheck', description: 'Guaranteed pensions, retirement security, and elderly care.', scheme_count: 1 },
  { id: 'Financial Assistance', name: 'Financial Assistance', icon: 'IndianRupee', description: 'Working capital, street vendor credit, and direct transfers.', scheme_count: 1 }
];

export const STATES_DATA: StateInfo[] = [
  { code: 'ALL', name: 'All India (Central Schemes)', is_central: true },
  { code: 'TG', name: 'Telangana', is_central: false },
  { code: 'KA', name: 'Karnataka', is_central: false },
  { code: 'MH', name: 'Maharashtra', is_central: false },
  { code: 'UP', name: 'Uttar Pradesh', is_central: false },
  { code: 'AP', name: 'Andhra Pradesh', is_central: false },
  { code: 'TN', name: 'Tamil Nadu', is_central: false },
  { code: 'KL', name: 'Kerala', is_central: false },
  { code: 'DL', name: 'Delhi', is_central: false },
  { code: 'GJ', name: 'Gujarat', is_central: false },
  { code: 'RJ', name: 'Rajasthan', is_central: false },
  { code: 'WB', name: 'West Bengal', is_central: false },
  { code: 'MP', name: 'Madhya Pradesh', is_central: false },
  { code: 'BR', name: 'Bihar', is_central: false }
];

// Client-Side Deterministic Evaluator (exact mirror of Python evaluator.py)
export function evaluateEligibilityClient(
  profile: Partial<CitizenProfile>,
  schemeSlug?: string
): EligibilityResult[] {
  let targetSchemes = VERIFIED_SCHEMES_DATA;
  if (schemeSlug) {
    targetSchemes = VERIFIED_SCHEMES_DATA.filter((s) => s.slug === schemeSlug);
  }

  const results: EligibilityResult[] = [];

  for (const scheme of targetSchemes) {
    const ruleDef = scheme.rules?.[0]?.rule_definition || {};
    const satisfied: string[] = [];
    const notSatisfied: string[] = [];
    const missingInfo: string[] = [];

    // 1. State / Domicile Check
    const allowedStates = ruleDef.allowed_states;
    const citizenState = profile.state_code;

    if (allowedStates && !allowedStates.includes('ALL')) {
      if (!citizenState) {
        missingInfo.push('State of residence was not provided to verify regional eligibility.');
      } else if (allowedStates.includes(citizenState) || citizenState === scheme.state_code) {
        satisfied.push(`Residence in ${citizenState} meets the state domicile requirement.`);
      } else {
        notSatisfied.push(`Scheme is restricted to residents of ${allowedStates.join(', ')}. Your selected state is ${citizenState}.`);
      }
    } else if (scheme.government_level === 'state' && scheme.state_code) {
      if (!citizenState) {
        missingInfo.push('State of residence needed for state-specific scheme.');
      } else if (citizenState === scheme.state_code) {
        satisfied.push(`Residence in state ${citizenState} matches scheme jurisdiction.`);
      } else {
        notSatisfied.push(`Scheme is specifically for ${scheme.state_code} residents.`);
      }
    } else {
      satisfied.push('Scheme is open to citizens across all Indian states and Union Territories.');
    }

    // 2. Age Check
    const minAge = ruleDef.min_age;
    const maxAge = ruleDef.max_age;
    const citizenAge = profile.age;

    if (minAge !== undefined || maxAge !== undefined) {
      if (citizenAge === undefined) {
        missingInfo.push(`Age not provided (scheme requires ${minAge ? `min ${minAge} yrs` : ''} ${maxAge ? `max ${maxAge} yrs` : ''}).`);
      } else {
        let ageValid = true;
        if (minAge !== undefined && citizenAge < minAge) {
          notSatisfied.push(`Age ${citizenAge} is below the minimum required age of ${minAge} years.`);
          ageValid = false;
        }
        if (maxAge !== undefined && citizenAge > maxAge) {
          notSatisfied.push(`Age ${citizenAge} exceeds the maximum eligible age of ${maxAge} years.`);
          ageValid = false;
        }
        if (ageValid) {
          satisfied.push(`Age ${citizenAge} falls within the eligible bracket (${minAge ?? 0}–${maxAge ?? 'no max'} years).`);
        }
      }
    }

    // 3. Income Check
    const maxIncome = ruleDef.max_annual_income;
    const citizenIncome = profile.annual_income;

    if (maxIncome !== undefined) {
      if (citizenIncome === undefined) {
        missingInfo.push(`Annual income not specified (scheme ceiling is ₹${maxIncome.toLocaleString('en-IN')}).`);
      } else if (citizenIncome <= maxIncome) {
        satisfied.push(`Annual income ₹${citizenIncome.toLocaleString('en-IN')} is within the limit of ₹${maxIncome.toLocaleString('en-IN')}.`);
      } else {
        notSatisfied.push(`Annual income ₹${citizenIncome.toLocaleString('en-IN')} exceeds the ceiling of ₹${maxIncome.toLocaleString('en-IN')}.`);
      }
    }

    // 4. Student Check
    if (ruleDef.student_required === true) {
      if (profile.is_student === undefined) {
        missingInfo.push('Confirmation of enrolled student status is required.');
      } else if (profile.is_student === true) {
        satisfied.push('Currently enrolled as a student, satisfying academic criteria.');
      } else {
        notSatisfied.push('This scheme is reserved exclusively for actively enrolled students.');
      }
    }

    // 5. Farmer Check
    if (ruleDef.farmer_required === true) {
      if (profile.is_farmer === undefined) {
        missingInfo.push('Farmer / agricultural landholder status not specified.');
      } else if (profile.is_farmer === true) {
        satisfied.push('Identified as an active farmer/cultivator, satisfying occupation criteria.');
      } else {
        notSatisfied.push('This scheme requires being an active farmer or landholder.');
      }
    }

    // 6. Gender Check
    if (ruleDef.gender_required && ruleDef.gender_required.toUpperCase() !== 'ANY') {
      if (!profile.gender) {
        missingInfo.push(`Gender requirement (${ruleDef.gender_required}) requires verification.`);
      } else if (profile.gender.toLowerCase() === ruleDef.gender_required.toLowerCase()) {
        satisfied.push(`Gender (${profile.gender}) matches scheme criteria.`);
      } else {
        notSatisfied.push(`Scheme is targeted for ${ruleDef.gender_required} beneficiaries (selected: ${profile.gender}).`);
      }
    }

    // 7. Social Category
    if (ruleDef.allowed_categories && !ruleDef.allowed_categories.includes('ANY')) {
      if (!profile.category) {
        missingInfo.push(`Social category needed (eligible: ${ruleDef.allowed_categories.join(', ')}).`);
      } else if (ruleDef.allowed_categories.map((c) => c.toUpperCase()).includes(profile.category.toUpperCase())) {
        satisfied.push(`Social category (${profile.category}) is eligible under this program.`);
      } else {
        notSatisfied.push(`Social category (${profile.category}) not among designated categories (${ruleDef.allowed_categories.join(', ')}).`);
      }
    }

    // Portal advisories
    const portalAdvisories = (ruleDef.unverified_conditions || []).map((c) => `Official Portal Check: ${c}`);

    let assessmentStatus: EligibilityResult['assessment_status'];
    let summary: string;
    let relevanceScore: number;

    if (notSatisfied.length > 0) {
      assessmentStatus = 'Not Eligible Based on Supplied Information';
      summary = `Based on your answers, you do not meet ${notSatisfied.length} criteria for this scheme.`;
      relevanceScore = 0.2;
    } else if (missingInfo.length > 0) {
      assessmentStatus = 'More Information Required';
      summary = `You meet ${satisfied.length} criteria, but ${missingInfo.length} profile details need confirmation.`;
      relevanceScore = 0.65;
    } else if (satisfied.length > 0) {
      assessmentStatus = 'Potentially Eligible';
      summary = `You meet all ${satisfied.length} verified eligibility criteria based on your answers.`;
      relevanceScore = 0.95;
    } else {
      assessmentStatus = 'Unable to Verify';
      summary = 'Eligibility could not be verified automatically.';
      relevanceScore = 0.5;
    }

    results.push({
      scheme_id: scheme.id,
      scheme_slug: scheme.slug,
      scheme_name: scheme.name,
      category: scheme.category,
      government_level: scheme.government_level,
      state_name: scheme.state_name,
      assessment_status: assessmentStatus,
      relevance_score: relevanceScore,
      summary,
      satisfied_conditions: satisfied,
      not_satisfied_conditions: notSatisfied,
      missing_information: assessmentStatus === 'Potentially Eligible' ? portalAdvisories : [...missingInfo, ...portalAdvisories],
      official_source: scheme.official_source_url,
      last_verified_at: scheme.last_verified_at,
    });
  }

  const orderMap = {
    'Potentially Eligible': 1,
    'More Information Required': 2,
    'Unable to Verify': 3,
    'Not Eligible Based on Supplied Information': 4,
  };

  results.sort((a, b) => (orderMap[a.assessment_status] || 5) - (orderMap[b.assessment_status] || 5) || b.relevance_score - a.relevance_score);

  return results;
}
