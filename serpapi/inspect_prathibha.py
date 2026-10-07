from webpage_extractor import extract_webpage_text


url = "https://www.myscheme.gov.in/schemes/psp"

print("\nFetching Prathibha Scholarship page...\n")

text = extract_webpage_text(url)

print("=" * 80)
print("EXTRACTED TEXT")
print("=" * 80)

print(text)

print("\n")
print("Total characters:", len(text))