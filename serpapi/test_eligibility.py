from search_engine import search_scholarships
from webpage_extractor import extract_webpage_text
from scholarship_extractor import extract_scholarship_details
from eligibility_checker import check_eligibility


student = {
    "name": "Test Student",
    "state": "Karnataka",
    "course": "Engineering",
    "year": "2nd Year",
    "category": "SC",
    "income": 180000,
    "marks": 65
}


print("\n===== MERITMAP ELIGIBILITY TEST =====\n")
print("Searching scholarships...\n")

search_results = search_scholarships(student)

print(f"Found {len(search_results)} search results.\n")


for index, result in enumerate(search_results, start=1):

    title = result.get("title", "Unknown Scholarship")
    url = result.get("link")

    print("=" * 60)
    print(f"{index}. {title}")
    print(f"URL: {url}")

    if not url:
        print("Skipped: no URL")
        continue

    print("\nFetching webpage...")

    text = extract_webpage_text(url)

    if not text:
        print("Skipped: webpage could not be extracted.")
        continue

    print("Extracting scholarship requirements...")

    scholarship = extract_scholarship_details(text)

    # Always trust the SerpApi search title for the scholarship name.
    # The webpage parser should focus only on requirements.
    scholarship["name"] = title

    scholarship["link"] = url

    print("\nScholarship:")
    print("Name:", scholarship["name"])
    print("State:", scholarship["state"])
    print("Categories:", scholarship["categories"])
    print("Courses:", scholarship["courses"])
    print("Income Limit:", scholarship["income_limit"])
    print("Minimum Marks:", scholarship["minimum_marks"])

    print("\nChecking eligibility...")

    result_data = check_eligibility(student, scholarship)

    print("\n===== ELIGIBILITY RESULT =====")
    print("Student:", student["name"])
    print("Scholarship:", scholarship["name"])
    print("Status:", result_data["status"])

    if result_data["reasons"]:
        print("\nReasons:")
        for reason in result_data["reasons"]:
            print("✓", reason)

    if result_data["failed_reasons"]:
        print("\nFailed Requirements:")
        for reason in result_data["failed_reasons"]:
            print("✗", reason)

    if result_data["missing_requirements"]:
        print("\nMissing Information:")
        for reason in result_data["missing_requirements"]:
            print("?", reason)

    print()