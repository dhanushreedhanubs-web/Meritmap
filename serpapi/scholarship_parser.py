def extract_scholarship_data(result):
    """
    Convert a SerpApi search result into
    a structured scholarship record.
    """

    title = result.get("title", "")
    link = result.get("link", "")
    snippet = result.get("snippet", "")

    text = f"{title} {snippet}".lower()

    scholarship = {
        "name": title,
        "link": link,
        "description": snippet,
        "source_type": result.get("source_type", "Other"),

        # Information that can later be used
        # by the eligibility engine
        "state": None,
        "course": None,
        "category": None,
        "income_limit": None,
        "deadline": None,
        "benefits": None
    }

    # Detect state
    if "karnataka" in text:
        scholarship["state"] = "Karnataka"

    # Detect course
    if "engineering" in text or "b.tech" in text or "b.e" in text:
        scholarship["course"] = "Engineering"

    # Detect category
    if "sc/st" in text or "sc" in text:
        scholarship["category"] = "SC/ST"

    elif "obc" in text:
        scholarship["category"] = "OBC"

    elif "minority" in text:
        scholarship["category"] = "Minority"

    # Try to detect income information
    income_keywords = [
        "income",
        "family income",
        "annual income",
        "income limit"
    ]

    if any(keyword in text for keyword in income_keywords):
        scholarship["income_limit"] = "Mentioned in source"

    return scholarship