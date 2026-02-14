import React from 'react';
import { Link } from "react-router-dom"; // Import Link for routing

function CardiB() {
  return (

<div className="container" style={{ color: "black" }}>
        <div className="row gy-4">
          {/* Counsellors Section */}
          
          <div className="col-md-6  mb-4 ">
            <div className="card h-100 shadow">
              <div className="row g-0">
                <div className="col-md-4">
                  <img
                    src="data:image/jpeg;base64,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"
                    className="img-fluid rounded-start"
                    alt="Self counselling"
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h3 className="card-title">Self Counselling Material</h3>
                    <div className="card-text">
                      <p>
                        "The only journey is the journey within."
                        <br /> - Rainer Maria Rilke
                      </p>
                      <p>
                        Take a moment for self-reflection. Here are some
                        resources to help you on your journey:
                      </p>
                      <ul>
                        <li>
                          <a
                            href="https://www.verywellmind.com/self-reflection-importance-benefits-and-strategies-7500858"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            The Importance of Self-Reflection: How Looking
                            Inward Can Improve Your Mental Health
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://www.mentalhealth.gov/get-help/immediate-help"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Immediate Help in a Crisis
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://positivepsychology.com/building-self-awareness-activities/"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            How to Increase Self Awareness
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6  mb-4">
            <div className="card h-100 shadow">
              {" "}
              <div className="row g-0">
                <div className="col-md-4 ">
                  <img
                    src="data:image/png;base64,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"
                    className="img-fluid rounded-start"
                    alt="SEEK COUNSELLING"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h3 className="card-title">
                      When and Why Seek Counselling
                    </h3>
                    <div className="card-text">
                      <p>
                        If you find yourself facing challenges such as stress,
                        anxiety, or emotional difficulties, seeking counseling
                        can provide valuable support and guidance on your
                        journey to well-being.
                      </p>
                      <p>
                        It's okay to ask for help. Our professional counselors
                        are here to assist you.{" "}
                        <Link to="/appointment">
                          Visit our appointment page
                        </Link>{" "}
                        to schedule a session and take the first step towards a
                        healthier and happier you.
                      </p>
                      <p>
                        For any inquiries or more information, feel free to{" "}
                        <Link to="/contactUs">contact us</Link>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
                }

export default CardiB;