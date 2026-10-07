import os
import serpapi
from dotenv import load_dotenv

# Load .env
load_dotenv()

# Get API key
api_key = os.getenv("SERPAPI_KEY")

if not api_key:
    print("ERROR: SERPAPI_KEY not found in .env")
    exit()

# Create SerpApi client
client = serpapi.Client(api_key=api_key)

# Student profile
student = {
    "state": "Karnataka",
    "course": "Engineering",
    "year": "2nd Year",
    "category": "SC",
    "income": 180000
}

# Create a search query from the student profile
query = (
    f"{student['state']} "
    f"{student['course']} scholarships 2026 "
    f"{student['category']} "
    f"income below {student['income']}"
)

print(f"\nSearching for: {query}\n")

# Search using SerpApi
results = client.search({
    "engine": "google",
    "q": query,
    "location": "Bengaluru, Karnataka, India"
})
# Get organic search results
organic_results = results.get("organic_results", [])

print("\n===== MERITMAP SCHOLARSHIP SEARCH =====\n")

for i, result in enumerate(organic_results, start=1):
    title = result.get("title", "No title")
    link = result.get("link", "No link")
    snippet = result.get("snippet", "No description")

    print(f"{i}. {title}")
    print(f"   Link: {link}")
    print(f"   Description: {snippet}")
    print()