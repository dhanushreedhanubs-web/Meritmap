from webpage_extractor import extract_webpage_text


url = "https://www.theglobalscholarship.org/scholarships/--ssp-scholarship?source=main"

text = extract_webpage_text(url)


print("\n===== WEBPAGE CONTENT =====\n")

print(text[:5000])