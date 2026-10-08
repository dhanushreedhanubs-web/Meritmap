from search_engine import search_scholarships


student = {
    "state": "Karnataka",
    "course": "Engineering",
    "year": "2nd Year",
    "category": "SC",
    "income": 180000
}


results = search_scholarships(student)


print("\n===== MERITMAP RESULTS =====\n")

for i, scholarship in enumerate(results, start=1):
    print(f"{i}. {scholarship['title']}")
    print(f"   Link: {scholarship['link']}")
    print(f"   Description: {scholarship['snippet']}")
    print(f"   Source Type: {scholarship['source_type']}")
    print(f"   Relevance Score: {scholarship['relevance_score']}")
    print()