# MeritMap – Smart Scholarship Discovery and Eligibility Platform

**Discover scholarships. Understand eligibility. Unlock opportunities.**

MeritMap is a smart scholarship discovery platform designed to help students find relevant scholarship opportunities based on their personal, academic, and financial profiles. It combines web search, information extraction, eligibility assessment, and AI-assisted explanations to make scholarship discovery more accessible and understandable.

## 📌 Table of Contents

* [Overview](#overview)
* [Problem Statement](#problem-statement)
* [Our Solution](#our-solution)
* [Key Features](#key-features)
* [Technology Stack](#technology-stack)
* [System Architecture](#system-architecture)
* [Project Structure](#project-structure)
* [Prerequisites](#prerequisites)
* [Installation and Setup](#installation-and-setup)
* [Environment Configuration](#environment-configuration)
* [Running the Application](#running-the-application)
* [API Endpoints](#api-endpoints)
* [Eligibility Assessment](#eligibility-assessment)
* [Security Considerations](#security-considerations)
* [Limitations](#limitations)
* [Future Enhancements](#future-enhancements)
* [Contributors](#contributors)

## Overview

Students often struggle to discover scholarships that match their academic qualifications, family income, category, location, and other eligibility requirements. Scholarship information is distributed across multiple websites and portals, making the process time-consuming and confusing.

MeritMap aims to simplify this process by bringing scholarship discovery and eligibility assessment into a single platform.

The application collects relevant student information, searches for scholarship opportunities, extracts available details, and assesses potential eligibility based on the available criteria.

## Problem Statement

Many students miss scholarship opportunities because:

* Scholarship information is scattered across different websites.
* Eligibility conditions can be difficult to understand.
* Students may not know which scholarships match their profiles.
* Manually comparing eligibility requirements takes time.
* Important application details may be difficult to identify.

## Our Solution

MeritMap provides a centralized approach to scholarship discovery and preliminary eligibility assessment.

The platform combines search results from the web with structured scholarship information and rule-based eligibility checks. AI-assisted explanations help users understand why a scholarship may match their profile and which requirements need further verification.

MeritMap is intended to support students in discovering opportunities; it does not replace official scholarship authorities or guarantee selection.

## Key Features

### 1. Scholarship Discovery

* Searches for scholarship opportunities using the SerpApi search service.
* Helps discover relevant scholarship websites, portals, and announcements.
* Organizes available information into a structured format.

### 2. Student Profile Management

* Accepts relevant student profile details.
* Supports profile information such as state, course, category, income, marks, age, gender, and disability status where applicable.
* Uses profile details to support personalized scholarship assessment.

### 3. Eligibility Assessment

* Evaluates scholarship requirements against available student information.
* Uses rule-based checks to identify potential matches.
* Distinguishes between eligible, possibly eligible, ineligible, and cases requiring verification.

### 4. AI-Assisted Explanations

* Integrates a locally configured Ollama model for eligibility explanations.
* Helps make eligibility assessments easier to understand.
* Supports explanations based on the information available to the application.

### 5. Structured Scholarship Information

* Extracts and parses scholarship-related information from search results and web pages.
* Organizes available details for further processing.
* Stores scholarship records in MongoDB when the database is configured and accessible.

### 6. Web Application

* Provides a frontend for interacting with the scholarship discovery system.
* Connects the frontend to the backend API.
* Presents scholarship information and eligibility results to users.

## Technology Stack

| Component                     | Technology                                |
| ----------------------------- | ----------------------------------------- |
| Frontend                      | React, Vite, JavaScript, CSS              |
| Backend API                   | Node.js, Express.js                       |
| Search Integration            | SerpApi                                   |
| Search and Extraction Service | Python, Flask                             |
| Database                      | MongoDB Atlas, Mongoose                   |
| Eligibility Engine            | JavaScript                                |
| AI Explanation Service        | Ollama, locally configured language model |
| Environment Configuration     | dotenv                                    |
| Development Tools             | Visual Studio Code, Git, GitHub           |

## System Architecture

```text
                    STUDENT
                       |
                       v
             React Frontend (Vite)
                       |
                       v
             Node.js / Express API
                       |
          +------------+-------------+
          |            |             |
          v            v             v
    Python Search   Eligibility    AI Explanation
    Service         Engine         Service (Ollama)
          |            |             |
          v            |             |
        SerpApi        |             |
          |            |             |
          v            v             v
       Scholarship Search and Assessment
                       |
                       v
                 MongoDB Atlas
```

*Note: This diagram represents the intended application flow. Actual execution depends on service configuration, available search results, and database connectivity.*

## Project Structure

```text
MeritMap/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── models/
│   │   ├── Profile.js
│   │   └── Scholarship.js
│   ├── routes/
│   │   ├── searchRoutes.js
│   │   └── scholarshipRoutes.js
│   ├── server.js
│   ├── aiService.js
│   ├── Modelfile
│   └── package.json
│
├── ai/
│   ├── eligibility.js
│   └── testeligibility.js
│
├── serpapi/
│   ├── app.py
│   ├── api_output.py
│   ├── search_engine.py
│   ├── webpage_extractor.py
│   ├── scholarship_extractor.py
│   ├── scholarship_parser.py
│   └── eligibility_checker.py
│
├── .gitignore
└── README.md
```

Some supporting files and tests may be present in addition to the files listed above.

## Prerequisites

Install or configure the following before running the application:

* Node.js and npm
* Python 3
* Git
* A SerpApi API key
* A MongoDB Atlas database and connection URI
* Ollama, if using the local AI explanation service
* The language model specified in the backend configuration

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/keerthanac200/MeritMap.git
cd MeritMap
```

If you have already cloned the repository, navigate to your existing project folder instead.

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Install Backend Dependencies

Open another terminal from the project root:

```bash
cd backend
npm install
```

### 4. Install Python Dependencies

From the project root, create and activate a virtual environment if you do not already have one.

**Windows PowerShell:**

```powershell
cd serpapi
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
```

If the virtual environment already exists, activate it rather than recreating it.

Install the required Python packages:

```powershell
python -m pip install Flask python-dotenv google-search-results requests beautifulsoup4
```

Verify the SerpApi Python client against the import and API usage in `search_engine.py`. If the project uses a different compatible client version, install the version required by that implementation.

## Environment Configuration

Create a `backend/.env` file and configure the environment variables expected by the application.

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_uri
SERPAPI_API_KEY=your_serpapi_api_key
```

Replace the example values with your actual configuration. Keep credentials private.

The Python search service must also be able to access the SerpApi key. Verify the environment-file path used by `serpapi/search_engine.py` and ensure it matches your actual configuration.

Do not commit `.env` files, database credentials, or API keys to GitHub.

### MongoDB Atlas Setup

1. Create or select your MongoDB Atlas project and database cluster.
2. Create a database user.
3. Configure Network Access to allow your development machine's current public IP address.
4. Obtain the connection URI.
5. Add the URI to `backend/.env` as `MONGODB_URI`.
6. Restart the backend and verify that the database connects successfully.

## Running the Application

Run each service in a separate terminal.

### Terminal 1: Python Search Service

From the `serpapi` directory, activate the virtual environment and run:

```powershell
python app.py
```

The service is expected to listen on port `5001` according to the current backend integration.

### Terminal 2: Node.js Backend

From the `backend` directory:

```powershell
node server.js
```

The backend is expected to run at:

```text
http://localhost:5000
```

### Terminal 3: React Frontend

From the `frontend` directory:

```powershell
npm run dev
```

Open the local URL printed by Vite, typically:

```text
http://localhost:5173
```

Keep the terminals running while testing the application.

### Troubleshooting

* **`Cannot GET /`:** The backend may not define a route for `/`. Test an implemented API endpoint instead.
* **MongoDB connection failure:** Verify `MONGODB_URI`, cluster status, database credentials, and Atlas Network Access.
* **SerpApi errors:** Check the API key, usage limits, network connectivity, and the Python service logs.
* **Frontend dependency errors:** Check the Node.js version and dependency installation. Preserve the lockfile when troubleshooting.
* **No scholarship results:** Verify that the Python service is running, inspect the backend logs, and confirm that search results are being parsed correctly.
* **AI explanation failures:** Verify Ollama is running and that the configured model exists.

## API Endpoints

The following endpoints reflect the backend routes identified in the project. Confirm their exact request and response schemas in the source code.

| Method | Endpoint                | Purpose                                                  |
| ------ | ----------------------- | -------------------------------------------------------- |
| GET    | `/api/health`           | Check backend health                                     |
| POST   | `/api/profile`          | Save student profile information                         |
| POST   | `/api/search`           | Search for scholarships and assess eligibility           |
| GET    | `/api/scholarships`     | Retrieve scholarship records                             |
| POST   | `/api/scholarships`     | Create a scholarship record                              |
| GET    | `/api/scholarships/:id` | Retrieve a scholarship by ID                             |
| POST   | `/search`               | Internal Python scholarship search endpoint on port 5001 |

### Example: Scholarship Search

A search request may include the student's state, course, and category. Refer to `backend/routes/searchRoutes.js` for the exact required fields and request format.

The response is designed to return a success indicator, result count, and scholarship information when the search completes successfully.

## Eligibility Assessment

MeritMap uses a rule-based eligibility engine to compare student profile information with scholarship criteria.

The assessment may consider:

* State or location
* Course or education level
* Category
* Family income
* Academic marks
* Age
* Gender
* Disability status

The engine can return statuses such as:

* **Eligible:** Available criteria indicate a potential match.
* **Maybe Eligible:** Some criteria match, but additional information may be required.
* **Not Eligible:** One or more known requirements are not satisfied.
* **Needs Verification:** Official rules or incomplete information require further checking.

These results are preliminary assessments, not official eligibility decisions. Scholarship rules can change, and users should verify requirements on the official scholarship website before applying.

## Security Considerations

* Never commit API keys, passwords, or database URIs to version control.
* Keep `.env` files excluded through `.gitignore`.
* If a credential has been exposed, revoke or rotate it.
* Validate and sanitize user input.
* Configure MongoDB Atlas access with the minimum necessary permissions.
* Use HTTPS and appropriate security controls when deploying publicly.
* Avoid logging sensitive student information or database credentials.

## Limitations

* Search results depend on SerpApi availability, query quality, and usage limits.
* Extracted scholarship information may be incomplete or outdated.
* Eligibility results depend on the accuracy of available rules and student-provided information.
* AI-generated explanations may be incorrect and should be checked against official requirements.
* Database features require a working MongoDB connection.
* Local AI explanations require Ollama and the configured model to be available.
* Application availability depends on the frontend, backend, and Python service running with compatible configurations.

## Future Enhancements

* Improve scholarship extraction and data validation.
* Add official application links, deadlines, and document checklists.
* Include scholarship deadline reminders.
* Expand coverage of government, institutional, and private scholarships.
* Improve explainability and verification of eligibility decisions.
* Add automated tests for API integration and end-to-end workflows.
* Deploy the platform with secure configuration and monitoring.
* Improve accessibility and the student user experience.

## Contributors

MeritMap is developed collaboratively by a student hackathon team.

* **Keerthana.C** — SerpApi Integration and API Development
* **Aishwarya.C** — Backend Development
* **Supriya.J.K** — AI and Eligibility Engine
* **Dhanushree.B.S** — Frontend Development

## License

No license file was identified in the reviewed project files. Until a license is added, the project should not be assumed to be open-source under a specific license.

---

**MeritMap — Making scholarship discovery simpler, clearer, and more accessible.**
