import re


def extract_scholarship_details(text):
    """
    Extract important scholarship information
    from webpage text.
    """

    text_lower = text.lower()

    scholarship = {
        "name": None,
        "state": None,
        "categories": [],
        "courses": [],
        "income_limit": None,
        "minimum_marks": None,
        "domicile_required": None,
        "benefits": None,
        "documents": []
    }

    # ==================================================
    # SCHOLARSHIP NAME
    # ==================================================

    name_patterns = [
        (
            r"\bssp scholarship\b",
            "SSP Scholarship"
        ),
        (
            r"\bprathibha scholarship programme\b",
            "Prathibha Scholarship Programme"
        ),
        (
            r"\bprathibha scholarship\b",
            "Prathibha Scholarship"
        ),
        (
            r"\bnsp scholarship\b",
            "NSP Scholarship"
        )
    ]

    for pattern, name in name_patterns:
        if re.search(pattern, text_lower):
            scholarship["name"] = name
            break

    # ==================================================
    # STATE
    # ==================================================
    #
    # IMPORTANT:
    # Do NOT select a state merely because the word
    # appears somewhere on the webpage.
    #
    # Look for state + relevant context.
    # ==================================================

    state_patterns = {
        "Karnataka": [
            r"\bstate of karnataka\b",
            r"\bkarnataka state\b",
            r"\bkarnataka domicile\b",
            r"\bdomicile of karnataka\b",
            r"\bresident of karnataka\b",
            r"\bgovernment of karnataka\b",
            r"\bgovernment\s+of\s+the\s+state\s+of\s+karnataka\b",
            r"\bkarnataka students\b",
            r"\bstudents of karnataka\b"
        ],

        "Assam": [
            r"\bgovernment of assam\b",
            r"\bassam domicile\b",
            r"\bdomicile of assam\b",
            r"\bassam students\b"
        ],

        "Goa": [
            r"\bgovernment of goa\b",
            r"\bgoa domicile\b",
            r"\bdomicile of goa\b",
            r"\bgoa students\b"
        ],

        "Maharashtra": [
            r"\bgovernment of maharashtra\b",
            r"\bmaharashtra domicile\b",
            r"\bdomicile of maharashtra\b",
            r"\bmaharashtra students\b"
        ],

        "Tamil Nadu": [
            r"\bgovernment of tamil nadu\b",
            r"\btamil nadu domicile\b",
            r"\bdomicile of tamil nadu\b",
            r"\btamil nadu students\b"
        ],

        "Telangana": [
            r"\bgovernment of telangana\b",
            r"\btelangana domicile\b",
            r"\bdomicile of telangana\b",
            r"\btelangana students\b"
        ],

        "Andhra Pradesh": [
            r"\bgovernment of andhra pradesh\b",
            r"\bandhra pradesh domicile\b",
            r"\bdomicile of andhra pradesh\b",
            r"\bandhra pradesh students\b"
        ],

        "Kerala": [
            r"\bgovernment of kerala\b",
            r"\bkerala domicile\b",
            r"\bdomicile of kerala\b",
            r"\bkerala students\b"
        ],

        "Rajasthan": [
            r"\bgovernment of rajasthan\b",
            r"\brajasthan domicile\b",
            r"\bdomicile of rajasthan\b",
            r"\brajasthan students\b"
        ],

        "Uttar Pradesh": [
            r"\bgovernment of uttar pradesh\b",
            r"\bup domicile\b",
            r"\bdomicile of uttar pradesh\b",
            r"\bup students\b"
        ],

        "West Bengal": [
            r"\bgovernment of west bengal\b",
            r"\bwest bengal domicile\b",
            r"\bdomicile of west bengal\b",
            r"\bwest bengal students\b"
        ]
    }

    for state, patterns in state_patterns.items():

        for pattern in patterns:

            if re.search(pattern, text_lower):

                scholarship["state"] = state
                break

        if scholarship["state"]:
            break

    # ==================================================
    # CATEGORIES
    # ==================================================

    category_patterns = {
        "SC": [
            r"\bscheduled caste\b",
            r"\bsc category\b",
            r"\bsc candidates\b",
            r"\bsc students\b"
        ],

        "ST": [
            r"\bscheduled tribe\b",
            r"\bst category\b",
            r"\bst candidates\b",
            r"\bst students\b"
        ],

        "OBC": [
            r"\bother backward classes\b",
            r"\bobc category\b",
            r"\bobc candidates\b",
            r"\bobc students\b"
        ],

        "Central OBC": [
            r"\bcentral obc\b"
        ],

        "Minority": [
            r"\bminority students\b",
            r"\bminority category\b",
            r"\bminority communities\b",
            r"\bminority community\b"
        ],

        "General": [
            r"\bgeneral category\b",
            r"\bgeneral candidates\b",
            r"\bgeneral students\b"
        ],

        "Defence Personnel": [
            r"\bdefence personnel\b",
            r"\bdefense personnel\b",
            r"\bdefence employees\b",
            r"\bdefense employees\b",
            r"\bchildren of defence personnel\b",
            r"\bchildren of defense personnel\b"
        ]
    }

    for category, patterns in category_patterns.items():

        for pattern in patterns:

            if re.search(pattern, text_lower):

                scholarship["categories"].append(category)
                break

    # Remove duplicates
    scholarship["categories"] = list(
        dict.fromkeys(scholarship["categories"])
    )

    # ==================================================
    # COURSES
    # ==================================================

    course_patterns = {
        "Engineering": [
            r"\bengineering students\b",
            r"\bengineering course\b",
            r"\bengineering degree\b",
            r"\bbachelor of engineering\b",
            r"\bbachelor of technology\b",
            r"\bb\.?\s*tech\b",
            r"\bb\.?\s*e\b"
        ],

        "BCom": [
            r"\bbachelor of commerce\b",
            r"\bb\.?\s*com\b"
        ],

        "ITI": [
            r"\bindustrial training institute\b",
            r"\biti students\b",
            r"\biti course\b"
        ],

        "Diploma": [
            r"\bdiploma course\b",
            r"\bdiploma students\b",
            r"\bdiploma degree\b"
        ],

        "Bachelors": [
            r"\bbachelor'?s degree\b",
            r"\bundergraduate students\b",
            r"\bundergraduate course\b"
        ],

        "Masters": [
            r"\bmaster'?s degree\b",
            r"\bpostgraduate students\b",
            r"\bpostgraduate course\b",
            r"\bpost graduate course\b"
        ]
    }

    for course, patterns in course_patterns.items():

        for pattern in patterns:

            if re.search(pattern, text_lower):

                scholarship["courses"].append(course)
                break

    scholarship["courses"] = list(
        dict.fromkeys(scholarship["courses"])
    )

    # ==================================================
    # INCOME LIMIT
    # ==================================================
    #
    # Only accept a number when it is clearly connected
    # to income.
    #
    # Examples:
    # ₹2.5 lakh -> 250000
    # ₹2 lakh -> 200000
    # INR 2,00,000 -> 200000
    #
    # A year such as 2026 is NOT accepted.
    # ==================================================

    income_patterns = [

        # income ... ₹2.5 lakh
        r"(?:annual\s+family\s+income|family\s+income|annual\s+income|income)"
        r".{0,150}?"
        r"(?:₹|rs\.?|inr)\s*"
        r"(\d+(?:\.\d+)?)\s*"
        r"(lakh|lakhs|lac|lacs)\b",

        # income ... 2.5 lakh
        r"(?:annual\s+family\s+income|family\s+income|annual\s+income|income)"
        r".{0,150}?"
        r"(\d+(?:\.\d+)?)\s*"
        r"(lakh|lakhs|lac|lacs)\b",

        # income ... ₹2,00,000
        r"(?:annual\s+family\s+income|family\s+income|annual\s+income|income)"
        r".{0,150}?"
        r"(?:₹|rs\.?|inr)\s*"
        r"(\d[\d,]*)",

        # income ... 2,00,000
        r"(?:annual\s+family\s+income|family\s+income|annual\s+income|income)"
        r".{0,150}?"
        r"(\d[\d,]*)"
    ]

    for pattern in income_patterns:

        match = re.search(
            pattern,
            text_lower,
            re.IGNORECASE
        )

        if not match:
            continue

        try:

            raw_value = match.group(1).replace(",", "").strip()

            value = float(raw_value)

            # If lakh/lac was captured
            if len(match.groups()) >= 2:

                unit = match.group(2)

                if unit in [
                    "lakh",
                    "lakhs",
                    "lac",
                    "lacs"
                ]:
                    value *= 100000

            # Reject unrealistic values
            if 10000 <= value <= 10000000:

                scholarship["income_limit"] = int(value)
                break

        except (ValueError, TypeError):
            continue

    # ==================================================
    # MINIMUM MARKS
    # ==================================================

    marks_patterns = [
        r"minimum\s+(?:of\s+)?(\d+(?:\.\d+)?)\s*%\s*marks",
        r"at least\s+(\d+(?:\.\d+)?)\s*%\s*marks",
        r"minimum\s+(\d+(?:\.\d+)?)\s*percent",
        r"minimum marks.{0,50}?(\d+(?:\.\d+)?)\s*%"
    ]

    for pattern in marks_patterns:

        match = re.search(
            pattern,
            text_lower,
            re.IGNORECASE
        )

        if match:

            try:

                value = float(match.group(1))

                scholarship["minimum_marks"] = (
                    int(value)
                    if value.is_integer()
                    else value
                )

                break

            except (ValueError, TypeError):
                continue

    # ==================================================
    # DOMICILE
    # ==================================================

    domicile_patterns = [
        r"domicile\s+of\s+(?:the\s+state\s+of\s+)?karnataka",
        r"karnataka\s+domicile",
        r"domiciled\s+in\s+karnataka",
        r"resident\s+of\s+karnataka",
        r"residents\s+of\s+karnataka",
        r"permanent\s+resident\s+of\s+karnataka"
    ]

    for pattern in domicile_patterns:

        if re.search(pattern, text_lower):

            scholarship["domicile_required"] = "Karnataka"
            break

    # ==================================================
    # BENEFITS
    # ==================================================

    benefit_patterns = [
        (
            r"directly transferred.*?student.*?bank account",
            "Scholarship amount transferred directly "
            "to the student's bank account"
        ),
        (
            r"scholarship amount.*?bank account",
            "Scholarship amount transferred directly "
            "to the student's bank account"
        ),
        (
            r"financial assistance",
            "Financial assistance provided to eligible students"
        )
    ]

    for pattern, benefit_text in benefit_patterns:

        if re.search(pattern, text_lower):

            scholarship["benefits"] = benefit_text
            break

    # ==================================================
    # DOCUMENTS
    # ==================================================

    document_patterns = {
        "SATS ID": [
            r"\bsats\s+id\b"
        ],

        "Caste Certificate": [
            r"\bcaste certificate\b"
        ],

        "Income Certificate": [
            r"\bincome certificate\b"
        ],

        "Aadhaar Card": [
            r"\baadhaar\b",
            r"\baadhar\b"
        ],

        "Domicile Certificate": [
            r"\bdomicile certificate\b"
        ],

        "University/Institute Details": [
            r"\buniversity/institute details\b",
            r"\buniversity details\b"
        ],

        "Institute Details": [
            r"\binstitute details\b"
        ]
    }

    for document, patterns in document_patterns.items():

        for pattern in patterns:

            if re.search(pattern, text_lower):

                scholarship["documents"].append(document)
                break

    scholarship["documents"] = list(
        dict.fromkeys(scholarship["documents"])
    )

    return scholarship