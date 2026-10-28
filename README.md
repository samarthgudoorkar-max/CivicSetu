# CivicSetu (सिविकसेतु / సివిక్‌సేతు)
### Intelligent Government Scheme Discovery & Citizen Assistance Platform

🌐 **Live Application URL:** [https://samarthgudoorkar-max.github.io/CivicSetu/](https://samarthgudoorkar-max.github.io/CivicSetu/)

> **Government Services, Simplified.**  
> *Government schemes, made simple.*

CivicSetu is an accessible, production-oriented citizen assistance platform that simplifies access to Indian Central and State Government schemes and public services.

CivicSetu is an independent citizen-assistance platform, not an official Government of India website.

---

## 🎨 Visual Design System & Official Color Palette

CivicSetu strictly implements the specified visual hierarchy and color distribution:

| Color | Hex Code | Visual Role | Approximate Distribution |
| :--- | :--- | :--- | :--- |
| **White & Neutrals** | `#FFFFFF` / `#F8FAFC` | Main surfaces, cards, forms, navigation background | ~50% |
| **Navy Blue** | `#1A3C6E` | Main headings, primary navigation, primary CTAs, logo emblem | ~20% |
| **Saffron** | `#FF9933` | Selected tabs, key benefit highlights, secondary CTAs, accent bar | ~20% |
| **Green** | `#138808` | Eligibility indicators, verified checkmarks, positive progress badges | ~10% |

- **Restrained Tricolor Bar**: Saffron segment, clean white space, and green segment embedded under the main navigation bar.
- **Typography**: Inter for crisp interface text, paired with Google Noto Sans (Devanagari & Telugu) for high-legibility regional script rendering.
- **Accessible Radii & Depth**: 10–16px subtle border radii, high-contrast text, clear focus rings, and zero distracting glassmorphism or neon effects.

---

## 🚀 Key Features

1. **Searchable Scheme Discovery Catalogue (`/schemes`)**
   - Search by scheme name, benefits, keywords, or administering department.
   - Comprehensive filtering by Category (Education, Healthcare, Agriculture, Employment, Women & Child Welfare, Housing, Senior Citizens, Financial Assistance).
   - Central vs. State Government filter with dynamic State selector (Telangana, Karnataka, Maharashtra, Uttar Pradesh, etc.).
   - Target beneficiary filters (Farmers, Students, Women, Seniors, Micro-entrepreneurs).
   - Sorting by recommendations, alphabetical order, and latest verification dates.

2. **Transparent, Deterministic Eligibility Matching Engine (`/eligibility`, `/results`)**
   - **Zero Black-Box Probabilities**: Replaces vague percentages with deterministic evaluation against published gazette rules.
   - 4 Clear Assessment States:
     1. `Potentially Eligible`
     2. `Not Eligible Based on Supplied Information`
     3. `More Information Required`
     4. `Unable to Verify`
   - **Full Explainability**: For every scheme, displays exact conditions satisfied, conditions not met, and portal-specific verification advisories.
   - **Zero-Aadhaar Privacy Commitment**: Collects only broad demographic ranges (state, age, occupation, broad income range). Never asks for Aadhaar numbers, PAN cards, or bank credentials.

3. **Scheme Detail Pages (`/schemes/:slug`)**
   - Official department name and jurisdictional level.
   - Structured breakdown of financial and service benefits.
   - Verified eligibility conditions and age/income brackets.
   - Required document checklist with mandatory vs optional designations.
   - Official ministerial portal gateways and verification dates.

4. **Application Preparation Assistant & Tracker (`/applications`)**
   - Interactive document checklist for tracking preparation progress.
   - 5-Stage Journey Tracker: `Research` ➔ `Documents Ready` ➔ `Applied Online` ➔ `Verification` ➔ `Completed`.
   - Personal notes and target deadline manager.
   - Clear distinction between personal preparation tracking and sovereign government portal approvals.

5. **Citizen Dashboard (`/dashboard`)**
   - Summary statistics of saved schemes and tracked checklists.
   - Interactive Recharts visualization of eligibility outcome distribution.
   - Quick access to shortlisted schemes and deadlines.

6. **Multilingual Interface (i18n)**
   - English, Hindi (हिंदी), and Telugu (తెలుగు) with persistent language state.
   - Preserves official departmental names and official portal URLs.

7. **Contextual Grounded CivicSetu Assistant**
   - Explains complex government circular language in plain English or regional languages.
   - Strictly grounded in verified database records with official source citations.
   - Operates deterministically without requiring external API keys.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript & Vite
- **Styling**: Tailwind CSS & Lucide React
- **Routing**: React Router DOM v6
- **Data Fetching**: TanStack Query (React Query)
- **Data Visualization**: Recharts
- **Internationalization**: i18next & react-i18next

### Backend
- **Framework**: FastAPI (Python 3.14)
- **Validation**: Pydantic v2
- **ORM & Database**: SQLAlchemy 2.0 (Async) with SQLite (default) and Supabase PostgreSQL support
- **Testing**: Pytest & pytest-asyncio

---

## 📁 Repository Architecture

```text
CivicSetu/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── assistant.py       # Grounded Q&A assistant endpoint
│   │   │   ├── checklists.py      # Application checklist CRUD
│   │   │   ├── eligibility.py     # Deterministic eligibility evaluation endpoint
│   │   │   ├── profile.py         # Citizen preferences & dashboard stats
│   │   │   ├── saved.py           # Saved schemes management
│   │   │   └── schemes.py         # Scheme search, catalogue & filter APIs
│   │   ├── core/
│   │   │   ├── config.py          # Environment settings & CORS
│   │   │   └── database.py        # Async SQLAlchemy engine & session factory
│   │   ├── models/
│   │   │   ├── models.py          # SQLAlchemy ORM models
│   │   │   └── schemas.py         # Pydantic v2 request & response schemas
│   │   ├── rules/
│   │   │   └── evaluator.py       # Reusable deterministic rule engine
│   │   ├── seed/
│   │   │   └── seed_data.py       # 14 verified Central & State government schemes
│   │   └── main.py                # FastAPI application entrypoint & lifespan
│   ├── tests/
│   │   ├── test_api.py            # API integration tests
│   │   └── test_rules.py          # Deterministic rule evaluator unit tests
│   ├── pytest.ini                 # Pytest configuration
│   ├── requirements.txt           # Python dependencies
│   └── run.py                     # Uvicorn server launcher
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── assistant/         # CivicAssistantDrawer chat widget
│   │   │   ├── layout/            # Header, Footer, TricolorBar, Layout
│   │   │   └── schemes/           # SchemeCard, SchemeBadge
│   │   ├── context/
│   │   │   ├── AuthContext.tsx    # Citizen personas & profile state
│   │   │   └── SavedSchemesContext.tsx # Fast save/unsave state
│   │   ├── i18n/
│   │   │   └── locales/           # English (en), Hindi (hi), Telugu (te)
│   │   ├── pages/                 # Home, Schemes, Detail, Eligibility, Results, Dashboard, etc.
│   │   ├── services/
│   │   │   └── api.ts             # REST API client
│   │   ├── types/
│   │   │   └── index.ts           # Shared TypeScript interfaces
│   │   ├── App.tsx                # Client routing configuration
│   │   ├── main.tsx               # DOM mount
│   │   └── index.css              # Tailwind directives & WCAG focus rings
│   ├── package.json
│   ├── tailwind.config.js         # Official color system configuration
│   └── vite.config.ts             # Dev server & backend proxy
├── .env.example
└── README.md
```

---

## ⚡ Quick Start & Local Setup

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v20/v26)
- **Python**: v3.10+ (tested on Python 3.14)

### 2. Backend Setup
```bash
# Navigate to backend
cd backend

# Create virtual environment and activate
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run automated tests
pytest

# Start the FastAPI server (runs on port 8000)
python run.py
```
*The database automatically creates `civicsetu.db` and seeds 14 verified Central and State schemes upon initial launch.*

### 3. Frontend Setup
In a new terminal window:
```bash
# Navigate to frontend
cd frontend

# Install npm packages
npm install

# Start the Vite development server (runs on port 5173 / 5174)
npm run dev
```

Open `http://localhost:5173` (or the URL displayed in the terminal) in your browser.

---

## 🧪 Automated Testing

CivicSetu includes automated unit tests covering both the backend REST APIs and the deterministic eligibility evaluator:

```bash
cd backend
./venv/bin/pytest -v
```

Tests verify:
- Accurate qualification for farmers under PM-KISAN and Rythu Bharosa.
- Rejection when age, state domicile, or income ceilings are exceeded with clear explanations.
- Proper handling of missing information and partial answers.
- API endpoints for scheme listings, slug queries, categories, states, and eligibility evaluation.

---

## 🎯 Hackathon Evaluation Walkthrough

Follow this 2-minute scenario to test all features:

1. **Homepage Exploration (`/`)**:
   - Notice the authentic tricolor-inspired accent bar, authoritative typography, and clean white/navy/saffron aesthetic.
   - Test the category cards (e.g. Agriculture or Education).
   - Use the search bar to search for `"scholarship"` or `"farmer"`.

2. **Persona Switching & Multilingual Experience**:
   - In the header, click the language pill to switch between **English**, **हिंदी**, and **తెలుగు**.
   - Click the Citizen Persona badge in the top right to switch between pre-configured citizen profiles (e.g., *Ramesh Reddy — Telangana Farmer* or *Neha Patil — Maharashtra Student*).

3. **Run Eligibility Evaluation (`/eligibility`)**:
   - Click **"Check Eligibility"**.
   - Complete the 4-step questionnaire (Notice zero personal identity documents or Aadhaar numbers are requested).
   - Click **"Evaluate My Eligibility"**.

4. **Inspect Explainable Results (`/results`)**:
   - View categorized cards: *Potentially Eligible*, *More Information Needed*, *Not Eligible*.
   - Click **"View Criteria"** on any card to see exactly which rules passed (green checkmark) or failed (red cross).

5. **Scheme Details & Application Preparation (`/schemes/:slug` & `/applications`)**:
   - Click **"View Details"** on *PM-KISAN* or *Rythu Bharosa*.
   - Click **"Add to My Checklist"**.
   - In `/applications`, check off prepared documents, change stages from *Research* to *Documents Ready*, and write personal notes.

6. **Contextual Grounded Assistant**:
   - Click the floating **CivicSetu Assistant** bubble in the bottom right corner.
   - Ask: *"What documents do I need for PM-KISAN?"* or *"Who can apply for Ayushman Bharat?"*.
   - Receive grounded answers with official source references.

---

## 🔒 Privacy & Non-Affiliation Disclaimers

- **Non-Affiliation**: CivicSetu is an independent public assistance platform. It is not affiliated with, endorsed by, or operated by the Government of India or any State Government.
- **Informational Guidance**: Final eligibility, verification, and benefit approvals are made exclusively by the responsible government authority upon application on the official ministerial portal.
- **Zero-Aadhaar Guarantee**: CivicSetu does not collect, store, or transmit Aadhaar numbers or government identity cards.
