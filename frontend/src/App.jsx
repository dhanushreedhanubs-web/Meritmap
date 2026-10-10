import { useState } from "react";
import "./App.css";

function App() {
  const [scholarships, setScholarships] = useState([]);
const [error, setError] = useState("");
  const [profile, setProfile] = useState({
    name: "",
    state: "",
    course: "",
    year: "",
    income: "",
    category: "",
    gender: "",
    marks: "",
  });

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const requiredFields = [
    "name",
    "state",
    "course",
    "year",
    "income",
    "category",
    "gender",
    "marks",
  ];

  const isComplete = requiredFields.every(
    (field) => String(profile[field]).trim() !== ""
  );

  if (!isComplete) {
    alert("Please complete all fields before continuing.");
    return;
  }

  try {
    // Send student profile to backend
    const profileResponse = await fetch(
      "http://localhost:5000/api/profile",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      }
    );

    const profileData = await profileResponse.json();

    console.log("Profile response:", profileData);

    // Create search query from student's profile
    const query = `${profile.course} scholarships ${profile.state} ${profile.category}`;

    // Ask backend for scholarships
    const searchResponse = await fetch(
      "http://localhost:5000/api/search",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
       body: JSON.stringify({
  query: query,
  student: {
    ...profile,
    age: Number(profile.age),
    year: Number(profile.year),
    income: Number(profile.income),
    marks: Number(profile.marks),
    disability:
      profile.disability === true ||
      profile.disability === "true",
  },
}), 
      }
    );

    const searchData = await searchResponse.json();

    console.log("Scholarship results:", searchData);
    if (!searchResponse.ok || !searchData.success) {
  throw new Error(searchData.message || "Scholarship search failed.");
}

setScholarships(searchData.scholarships || []);
setError("");

if (!searchData.scholarships?.length) {
  setError("No scholarships found. Try another course or state.");
}

   
  } catch (error) {
    console.error("Error:", error);
    alert("Could not connect to the backend.");
  }
};

  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">🎓 MeritMap</div>
        <span className="tagline">Find opportunities made for you</span>
      </header>

      <main className="container">
        <section className="hero">
          <h1>Find Scholarships You Qualify For</h1>
          <p>
            Tell us about yourself and MeritMap will help you discover
            scholarships and government benefits that match your profile.
          </p>
        </section>

        <section className="form-card">
          <h2>Student Profile</h2>

          <p className="form-subtitle">
            Enter your details to find personalized opportunities.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="field">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={profile.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="field">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  placeholder="e.g. Karnataka"
                  value={profile.state}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="field">
                <label>Course</label>
                <input
                  type="text"
                  name="course"
                  placeholder="e.g. BCA"
                  value={profile.course}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="field">
                <label>Year of Study</label>
                <input
                  type="number"
                  name="year"
                  placeholder="e.g. 2"
                  value={profile.year}
                  onChange={handleChange}
                  min="1"
                  max="6"
                  required
                />
              </div>

              <div className="field">
                <label>Annual Family Income (₹)</label>
                <input
                  type="number"
                  name="income"
                  placeholder="e.g. 250000"
                  value={profile.income}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

              <div className="field">
                <label>Category</label>
                <select
                  name="category"
                  value={profile.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="EWS">EWS</option>
                </select>
              </div>

              <div className="field">
                <label>Gender</label>
                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="field">
                <label>Marks / CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  name="marks"
                  placeholder="e.g. 8.5"
                  value={profile.marks}
                  onChange={handleChange}
                  min="0"
                  max="10"
                  required
                />
              </div>
            </div>

            <button type="submit" className="submit-btn">
              Find Scholarships 🚀
            </button>
                    </form>
        </section>

        {/* Scholarship Search Results */}
                {/* Scholarship Search Results */}
        {error && (
          <p className="search-error">
            {error}
          </p>
        )}

        {scholarships.length > 0 && (
          <section className="scholarship-results">
            <h2>🎓 Scholarship Results</h2>

            <div className="scholarship-list">
              {scholarships.map((scholarship, index) => (
                <article
                  className="scholarship-card"
                  key={
                    scholarship._id ||
                    scholarship.applicationLink ||
                    index
                  }
                >
                  <h3>{scholarship.title}</h3>

                  <p className="scholarship-description">
                    {scholarship.description ||
                      "No description available."}
                  </p>

                  <p>
                    <span className="scholarship-status">
                      {scholarship.status || "Needs Verification"}
                    </span>
                  </p>

                  <p className="scholarship-score">
                    <strong>Match Score:</strong>{" "}
                    {scholarship.matchScore ?? 0}%
                  </p>

                  {scholarship.reasons?.length > 0 && (
                    <ul className="scholarship-reasons">
                      {scholarship.reasons.map((reason, reasonIndex) => (
                        <li key={reasonIndex}>{reason}</li>
                      ))}
                    </ul>
                  )}

                  {scholarship.applicationLink && (
                    <a
                      className="scholarship-link"
                      href={scholarship.applicationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Scholarship ↗
                    </a>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}
    
      </main>

      <footer>
        <p>© 2026 MeritMap • Discover. Match. Achieve.</p>
      </footer>
    </div>
  );
}

export default App;