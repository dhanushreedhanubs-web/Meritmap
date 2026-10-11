
import { useState } from 'react';
import './App.css';

function App() {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const values = Object.fromEntries(formData.entries());

    const student = {
      name: values.name.trim(),
      state: values.state,
      course: values.field,
      year: values.studyLevel,
      income: Number(values.income),
      marks: Number(values.percentage),
      category: values.category,
    };

    setLoading(true);
    setSearchError('');
    setScholarships([]);
    setHasSearched(true);

    try {
      // Step 1: Save the student's profile.
      const profileResponse = await fetch(
        'http://localhost:5000/api/profile',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(student),
        }
      );

      const profileResult = await profileResponse.json();

      if (!profileResponse.ok) {
        throw new Error(
          profileResult.message || 'Could not save your profile.'
        );
      }

      // Step 2: Search for scholarships.
      const searchResponse = await fetch(
        'http://localhost:5000/api/search',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(student),
        }
      );

      const searchResult = await searchResponse.json();

      if (!searchResponse.ok || !searchResult.success) {
        throw new Error(
          searchResult.message || 'Scholarship search failed.'
        );
      }

      setScholarships(searchResult.scholarships || []);

      // Scroll down to show the results.
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    } catch (error) {
      console.error('Scholarship search error:', error);
      setSearchError(
        error.message ||
          'Something went wrong. Please check that the services are running.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <nav className="navbar">
        <a className="logo" href="#home">
          MeritMap<span>.</span>
        </a>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#how-it-works">How it works</a>
          <a href="#results">Scholarships</a>
        </div>

        <button
          className="nav-button"
          onClick={() =>
            document.getElementById('search')?.scrollIntoView({
              behavior: 'smooth',
            })
          }
        >
          Find Scholarships
        </button>
      </nav>

      <main>
        {/* HERO SECTION */}
        <section className="hero" id="home">
          <div className="hero-content">
            <div className="eyebrow">✦ YOUR FUTURE, FUNDED</div>

            <h1>
              Your dreams deserve
              <br />
              a <span>scholarship.</span>
            </h1>

            <p>
              Discover scholarships that match your goals, education
              and financial needs. Let AI help you find opportunities
              made for you.
            </p>

            <div className="hero-actions">
              <button
                className="primary-button"
                onClick={() =>
                  document.getElementById('search')?.scrollIntoView({
                    behavior: 'smooth',
                  })
                }
              >
                Find my scholarships ↗
              </button>

              <a className="text-link" href="#how-it-works">
                See how it works ↓
              </a>
            </div>

            <div className="trust-note">
              <span>✓</span> Personalized discovery · Smarter opportunities
            </div>
          </div>

          <div
            className="hero-art"
            aria-label="Scholarship discovery illustration"
          >
            <div className="art-orbit orbit-one"></div>
            <div className="art-orbit orbit-two"></div>

            <div className="art-card">
              <div className="cap-icon">🎓</div>
              <div className="art-label">YOUR NEXT CHAPTER</div>
              <h3>
                Big dreams.
                <br />
                Less financial stress.
              </h3>
              <div className="art-divider"></div>
              <div className="art-stat">
                <span>Opportunity awaits</span>
                <strong>✦</strong>
              </div>
            </div>

            <div className="floating-note note-top">✦ Find your fit</div>
            <div className="floating-note note-bottom">
              ♡ Made for your goals
            </div>
            <div className="decor-star star-one">✳</div>
            <div className="decor-star star-two">✦</div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="steps-section" id="how-it-works">
          <div className="section-heading">
            <span className="eyebrow">A SIMPLER WAY FORWARD</span>
            <h2>Your next opportunity starts here.</h2>
            <p>
              Three simple steps between you and your next big opportunity.
            </p>
          </div>

          <div className="steps-grid">
            <article className="step-card">
              <div className="step-number">01</div>
              <div className="step-icon">♧</div>
              <h3>Tell us about you</h3>
              <p>
                Share your education, interests and goals to get started.
              </p>
            </article>

            <article className="step-card featured-step">
              <div className="step-number">02</div>
              <div className="step-icon">✧</div>
              <h3>Discover your matches</h3>
              <p>
                Find relevant scholarship opportunities with personalized
                AI assistance.
              </p>
            </article>

            <article className="step-card">
              <div className="step-number">03</div>
              <div className="step-icon">↗</div>
              <h3>Take the next step</h3>
              <p>
                Explore eligibility details, deadlines and application
                information.
              </p>
            </article>
          </div>
        </section>

        {/* STUDENT PROFILE FORM */}
        <section className="search-section" id="search">
          <div className="search-copy">
            <span className="eyebrow">LET'S FIND YOUR MATCH</span>
            <h2>Every student deserves a chance.</h2>
            <p>
              Tell us about your education and financial needs.
              MeritMap will search for scholarships and explain
              their eligibility requirements.
            </p>
          </div>

          <form className="search-form" onSubmit={handleSubmit}>
            <label htmlFor="name">Student name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              required
            />

            <label htmlFor="studyLevel">
              What is your current study level?
            </label>
            <select
              id="studyLevel"
              name="studyLevel"
              required
              defaultValue=""
            >
              <option value="" disabled>
                Select your study level
              </option>
              <option>Class 10</option>
              <option>Class 12</option>
              <option>Diploma</option>
              <option>Undergraduate</option>
              <option>Postgraduate</option>
              <option>PhD / Research</option>
            </select>

            <label htmlFor="field">Area of study</label>
            <select
              id="field"
              name="field"
              required
              defaultValue=""
            >
              <option value="" disabled>
                Select your area
              </option>
              <option>Engineering &amp; Technology</option>
              <option>Science</option>
              <option>Arts &amp; Humanities</option>
              <option>Commerce &amp; Management</option>
              <option>Medicine &amp; Healthcare</option>
              <option>Law</option>
              <option>Other</option>
            </select>

            <label htmlFor="state">State or Union Territory</label>
            <select
              id="state"
              name="state"
              required
              defaultValue=""
            >
              <option value="" disabled>
                Select your state
              </option>
              <option>Karnataka</option>
              <option>Kerala</option>
              <option>Tamil Nadu</option>
              <option>Andhra Pradesh</option>
              <option>Telangana</option>
              <option>Maharashtra</option>
              <option>Delhi</option>
              <option>Other</option>
            </select>

            <label htmlFor="category">Student category</label>
            <select
              id="category"
              name="category"
              required
              defaultValue=""
            >
              <option value="" disabled>
                Select your category
              </option>
              <option value="General">General</option>
              <option value="OBC">OBC</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="EWS">EWS</option>
              <option value="Other">Other / Prefer not to say</option>
            </select>

            <label htmlFor="income">Annual family income (₹)</label>
            <input
              id="income"
              name="income"
              type="number"
              min="0"
              step="1"
              placeholder="e.g. 200000"
              required
            />

            <label htmlFor="percentage">Academic percentage (%)</label>
            <input
              id="percentage"
              name="percentage"
              type="number"
              min="0"
              max="100"
              step="0.01"
              placeholder="e.g. 85"
              required
            />

            <button
              className="primary-button form-button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? 'Finding scholarships...'
                : 'Find my opportunities ↗'}
            </button>

            <p className="form-note">
              Your journey starts with one small step.
            </p>
          </form>
        </section>

        {/* SCHOLARSHIP RESULTS */}
        <section className="results-section" id="results">
          <div className="section-heading">
            <span className="eyebrow">YOUR SCHOLARSHIP MATCHES</span>
            <h2>Opportunities for your future.</h2>
            <p>
              Review the scholarship details and check the requirements
              before applying.
            </p>
          </div>

          {loading && (
            <p className="results-message" role="status">
              Searching for scholarships and preparing your results...
            </p>
          )}

          {searchError && (
            <p className="results-message results-error" role="alert">
              {searchError}
            </p>
          )}

          {!loading &&
            !searchError &&
            hasSearched &&
            scholarships.length === 0 && (
              <p className="results-message">
                No scholarships were found. Please try again later
                or check your profile details.
              </p>
            )}

          {!loading && scholarships.length > 0 && (
            <div className="scholarship-grid">
              {scholarships.map((scholarship, index) => {
                const eligibility = scholarship.eligibilityResult;
                const ai = scholarship.aiExplanation;
                const applicationLink = scholarship.applicationLink || '';

               const safeApplicationLink = (() => {
  try {
    const url = new URL(applicationLink);

    return url.protocol === 'https:' || url.protocol === 'http:'
      ? url.href
      : '';
  } catch {
    return '';
  }
})();

                return (
                  <article
                    className="scholarship-card"
                    key={
                      scholarship._id ||
                      scholarship.applicationLink ||
                      `${scholarship.title}-${index}`
                    }
                  >
                   <span
  className={`scholarship-tag ${
    eligibility?.status === 'Eligible'
      ? 'status-eligible'
      : eligibility?.status === 'Not Eligible'
        ? 'status-not-eligible'
        : 'status-verification'
  }`}
>
  {eligibility?.status === 'Eligible'
    ? '✓ Eligible'
    : eligibility?.status === 'Not Eligible'
      ? '✕ Not Eligible'
      : eligibility?.status === 'Needs Verification'
        ? '⚠ Needs Verification'
        : 'Eligibility Not Checked'}
</span>

                    <h3>
                      {scholarship.title || 'Scholarship opportunity'}
                    </h3>
                    {typeof eligibility?.matchScore === 'number' && (
  <div className="match-score">
    <span>Criteria match score</span>

    <strong>{eligibility.matchScore}%</strong>

    <div
      className="match-score-track"
      role="progressbar"
      aria-label="Criteria match score"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.max(
        0,
        Math.min(100, eligibility.matchScore)
      )}
    >
      <div
        className="match-score-fill"
        style={{
          width: `${Math.max(
            0,
            Math.min(100, eligibility.matchScore)
          )}%`,
        }}
      />
    </div>
  </div>
)}

                    {scholarship.amount && (
                      <p className="scholarship-amount">
                        Award: {scholarship.amount}
                      </p>
                    )}

                    {scholarship.description && (
                      <p>{scholarship.description}</p>
                    )}

                    {scholarship.eligibility && (
                      <p>
                        <strong>Eligibility:</strong>{' '}
                        {scholarship.eligibility}
                      </p>
                    )}

                    {eligibility && (
                      <div className="ai-explanation">
                        <h4>Eligibility explanation</h4>

                        <p>
                          {ai?.explanation ||
                            (eligibility.eligible
                              ? 'Your profile appears to meet the checked requirements.'
                              : 'Your profile may not meet all the checked requirements. Review the details before applying.')}
                        </p>

                        {Array.isArray(ai?.requirementsMet) &&
                          ai.requirementsMet.length > 0 && (
                            <>
                              <strong>Requirements met</strong>
                              <ul>
                                {ai.requirementsMet.map((item, i) => (
                                  <li key={i}>{item}</li>
                                ))}
                              </ul>
                            </>
                          )}

                        {Array.isArray(ai?.missingInformation) &&
                          ai.missingInformation.length > 0 && (
                            <>
                              <strong>Missing information</strong>
                              <ul>
                                {ai.missingInformation.map((item, i) => (
                                  <li key={i}>{item}</li>
                                ))}
                              </ul>
                            </>
                          )}

                        {Array.isArray(ai?.nextSteps) &&
                          ai.nextSteps.length > 0 && (
                            <>
                              <strong>Next steps</strong>
                              <ul>
                                {ai.nextSteps.map((item, i) => (
                                  <li key={i}>{item}</li>
                                ))}
                              </ul>
                            </>
                          )}

                        {scholarship.aiExplanationError && (
                          <p className="ai-unavailable">
                            The AI explanation was unavailable for
                            this scholarship.
                          </p>
                        )}
                      </div>
                    )}

                    {safeApplicationLink && (
                      <a
                        className="apply-link"
                        href={safeApplicationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View application ↗
                      </a>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <a className="logo" href="#home">
          MeritMap<span>.</span>
        </a>
        <p>
          Helping students find opportunities for a brighter future.
        </p>
        <span>Made with purpose ✦</span>
      </footer>
    </div>
  );
}

export default App;
