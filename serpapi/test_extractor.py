from webpage_extractor import extract_webpage_text
from scholarship_extractor import extract_scholarship_details


url = "https://www.theglobalscholarship.org/scholarships/--ssp-scholarship?source=main"


print("\nFetching scholarship webpage...\n")

text = extract_webpage_text(url)


scholarship = extract_scholarship_details(text)


print("===== STRUCTURED SCHOLARSHIP =====\n")

for key, value in scholarship.items():
    print(f"{key}: {value}")