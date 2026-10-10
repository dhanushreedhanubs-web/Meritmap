import os
import serpapi
from dotenv import load_dotenv

load_dotenv(
    os.path.join(os.path.dirname(__file__), "../backend/.env")
)

api_key = os.getenv("SERPAPI_KEY")

if not api_key:
    raise ValueError("SERPAPI_KEY not found in backend/.env")

client = serpapi.Client(api_key=api_key)


def search_scholarships(student):
    """Search for scholarship opportunities using the student's profile."""

    state = student.get("state", "")
    course = student.get("course", "")
    category = student.get("category", "")

    query = (
        f"{state} {course} scholarship {category} "
        "government official eligibility application"
    ).strip()

    response = client.search({
        "engine": "google",
        "q": query,
        "location": "India",
        "num": 10
    })

    organic_results = response.get("organic_results", [])
    scholarships = []

    for result in organic_results:
        title = result.get("title", "") or ""
        link = result.get("link", "") or ""
        snippet = (
            result.get("snippet", "")
            or result.get("description", "")
            or ""
        )

        if not title or not link:
            continue

        link_lower = link.lower()

        blocked_domains = [
            "facebook.com",
            "instagram.com",
            "youtube.com",
            "justdial.com"
        ]

        if any(domain in link_lower for domain in blocked_domains):
            continue

        trusted_domains = [
            ".gov.in",
            ".nic.in",
            "scholarships.gov.in",
            "aicte-india.org",
            "buddy4study.com"
        ]

        score = sum(
            3 for domain in trusted_domains
            if domain in link_lower
        )

        text = f"{title} {snippet}".lower()

        keywords = [
            "scholarship",
            "scholarships",
            "financial aid",
            "financial assistance",
            "fee reimbursement",
            "stipend",
            "eligibility",
            "student grant",
            "education assistance",
            "ssp"
        ]

        score += sum(1 for keyword in keywords if keyword in text)

        scholarships.append({
            "title": title,
            "name": title,
            "link": link,
            "snippet": snippet,
            "description": snippet,
            "relevance_score": score,
            "source_type": (
                "Government"
                if ".gov.in" in link_lower or ".nic.in" in link_lower
                else "Scholarship Portal"
                if "scholarship" in link_lower
                else "Other"
            )
        })

    scholarships.sort(
        key=lambda item: item["relevance_score"],
        reverse=True
    )

    return scholarships