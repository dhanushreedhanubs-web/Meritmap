import os
import serpapi
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("SERPAPI_KEY")

print("API key loaded:", bool(api_key))

client = serpapi.Client(api_key=api_key)

query = (
    "Karnataka Engineering scholarship SC eligibility "
    "family income marks application 2026 official scholarship portal"
)

print("\nSearching SerpApi...")
print("Query:", query)

try:
    results = client.search({
        "engine": "google",
        "q": query,
        "location": "Bengaluru, Karnataka, India",
        "num": 10
    })

    print("\nResponse keys:")
    print(results.keys())

    print("\nOrganic results:")
    organic = results.get("organic_results", [])

    print("Count:", len(organic))

    for i, result in enumerate(organic, 1):
        print(f"\n{i}. {result.get('title')}")
        print(result.get('link'))
        print(result.get('snippet'))

except Exception as e:
    print("\nERROR:")
    print(type(e).__name__, e)