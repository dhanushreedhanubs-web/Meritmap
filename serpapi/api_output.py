import json

from search_engine import search_scholarships
from webpage_extractor import extract_webpage_text
from scholarship_extractor import extract_scholarship_details


def is_scholarship_result(result):
    """
    Check whether a SerpApi search result looks like
    an actual scholarship/financial-aid result.
    """

    title = result.get("title", "") or ""
    description = result.get("description", "") or ""

    text = f"{title} {description}".lower()

    scholarship_keywords = [
        "scholarship",
        "scholarships",
        "financial aid",
        "stipend",
        "fee reimbursement",
        "education assistance"
    ]

    return any(keyword in text for keyword in scholarship_keywords)


def get_scholarship_data(student):
    """
    Complete MeritMap pipeline.

    Student profile
        ↓
    SerpApi search
        ↓
    Search results
        ↓
    Webpage extraction
        ↓
    Scholarship data extraction
        ↓
    Fallback to search-result information
        ↓
    Structured JSON
    """

    search_results = search_scholarships(student)

    scholarships = []

    print(f"\nFound {len(search_results)} search results.")

    for index, result in enumerate(search_results, start=1):

        title = result.get("title", "")
        url = result.get("link", "")
        description = result.get("description", "")

        print(f"\n--- Processing result {index} ---")
        print(f"Title: {title}")
        print(f"URL: {url}")

        # Ignore results that do not look like scholarships
        if not is_scholarship_result(result):
            print("Skipped: not identified as a scholarship result.")
            continue

        if not url:
            print("Skipped: no URL.")
            continue

        scholarship = None

        # --------------------------------------------------
        # STEP 1: Try extracting the actual webpage
        # --------------------------------------------------

        try:
            webpage_text = extract_webpage_text(url)

            if webpage_text:

                print("Webpage extracted successfully.")

                try:
                    scholarship = extract_scholarship_details(
                        webpage_text
                    )

                    if scholarship:
                        print("Scholarship parser completed.")

                except (ValueError, AttributeError, TypeError) as e:
                    print(f"Parser failed: {e}")

            else:
                print("Webpage extraction failed.")

        except Exception as e:
            print(f"Could not access webpage: {e}")

        # --------------------------------------------------
        # STEP 2: Validate parsed scholarship
        # --------------------------------------------------

        if scholarship:

            scholarship["link"] = url

            # If parser found a name, keep it.
            # Otherwise use the SerpApi title.
            if not scholarship.get("name"):
                scholarship["name"] = title

            # If parser did not find state, use student's state.
            if not scholarship.get("state"):
                 scholarship["state"] = "Unknown"
            scholarships.append(scholarship)

            print(
                f"Added scholarship: "
                f"{scholarship.get('name')}"
            )

            continue

        # --------------------------------------------------
        # STEP 3: FALLBACK
        # --------------------------------------------------

        print("Using SerpApi search-result fallback.")

        fallback_scholarship = {
            "name": title,
            "state": "Unknown",
            "domicile_required": None,
            "benefits": description or None,
            "documents": [],
            "link": url
        }

        scholarships.append(fallback_scholarship)

        print(
            f"Added fallback scholarship: {title}"
        )

    return scholarships


if __name__ == "__main__":

    student = {
        "state": "Karnataka",
        "course": "Engineering",
        "year": "2nd Year",
        "category": "SC",
        "income": 180000,
        "marks": 65
    }

    results = get_scholarship_data(student)

    print("\n===== MERITMAP SCHOLARSHIP DATA =====")

    print(
        json.dumps(
            results,
            indent=4,
            ensure_ascii=False
        )
    )