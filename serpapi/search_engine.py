import os
import serpapi
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("SERPAPI_KEY")

if not api_key:
    raise ValueError("SERPAPI_KEY not found in .env")

client = serpapi.Client(api_key=api_key)


def search_scholarships(student):
    """
    Search scholarships based on a student's profile.
    """

    query = (
        f"{student['state']} {student['course']} scholarship "
        f"{student['category']} SSP eligibility "
        f"income marks 2026"
    )
    results = client.search({
        "engine": "google",
        "q": query,
        "location": "Bengaluru, Karnataka, India",
        "num": 10    
    })

    organic_results = results.get("organic_results", [])

    scholarships = []

    for result in organic_results:

        title = result.get("title", "")
        link = result.get("link", "")
        snippet = result.get("snippet", "")

        text = f"{title} {snippet}".lower()

        score = 0

        # Trusted sources get extra points
        trusted_domains = [
            ".gov.in",
            ".nic.in",
            "aicte-india.org",
            "scholarships.gov.in",
            "buddy4study.com"
        ]

        for domain in trusted_domains:
            if domain in link.lower():
                score += 3

        # Scholarship-related keywords
        keywords = [
            "scholarship",
            "scholarships",
            "eligibility",
            "income",
            "sc/st",
            "application",
            "financial assistance",
            "tuition fee",
            "ssp"
        ]

        for keyword in keywords:
            if keyword in text:
                score += 1

        # Ignore clearly unsuitable sources
        blocked_domains = [
            "facebook.com",
            "instagram.com",
            "youtube.com",
            "scribd.com",
            "justdial.com",
            "bseindia.com"
        ]

        if any(domain in link.lower() for domain in blocked_domains):
            continue

        # Ignore weak results
        if score < 2:
            continue

        # Identify source type
        if ".gov.in" in link.lower() or ".nic.in" in link.lower():
            source_type = "Government"

        elif "instagram.com" in link.lower() or "facebook.com" in link.lower():
            source_type = "Social Media"

        elif "youtube.com" in link.lower():
            source_type = "Video"

        elif "college" in link.lower() or "university" in link.lower():
            source_type = "College/University"

        elif "scholarship" in link.lower():
            source_type = "Scholarship Portal"

        else:
            source_type = "Other"

        scholarship = {
            "title": title,
            "link": link,
            "snippet": snippet,
            "relevance_score": score,
            "source_type": source_type
        }

        scholarships.append(scholarship)

    # Highest relevance first
    scholarships.sort(
        key=lambda x: x["relevance_score"],
        reverse=True
    )

    return scholarships