from search_engine import search_scholarships
from scholarship_parser import extract_scholarship_data


student = {
    "state": "Karnataka",
    "course": "Engineering",
    "year": "2nd Year",
    "category": "SC",
    "income": 180000
}


results = search_scholarships(student)


print("\n===== MERITMAP SCHOLARSHIP DATA =====\n")


for i, result in enumerate(results, start=1):

    scholarship = extract_scholarship_data(result)

    print(f"{i}. {scholarship['name']}")
    print(f"   Link: {scholarship['link']}")
    print(f"   Description: {scholarship['description']}")
    print(f"   State: {scholarship['state']}")
    print(f"   Course: {scholarship['course']}")
    print(f"   Category: {scholarship['category']}")
    print(f"   Income: {scholarship['income_limit']}")
    print()