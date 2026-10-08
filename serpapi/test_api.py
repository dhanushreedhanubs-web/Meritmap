import requests

student = {
    "state": "Karnataka",
    "course": "Engineering",
    "year": "2nd Year",
    "category": "SC",
    "income": 180000,
    "marks": 65
}

response = requests.post(
    "http://127.0.0.1:5001/search",
    json=student
)

print("Status Code:", response.status_code)
print("\n===== MERITMAP API RESPONSE =====")

print(response.json())