import { useState } from "react";

export default function App() {
  const [showAnswer, setShowAnswer] = useState(false);

    const subjects = [
        "Medicine",
            "Surgery",
                "Toxicology",
                    "Forensic",
                        "Pharmacology",
                            "Pathology"
                              ];

                                return (
                                    <div style={{ padding: "20px", fontFamily: "Arial" }}>
                                          <h1>🧠 NEET PG Rapid Cards</h1>

                                                <div
                                                        style={{
                                                                  border: "1px solid gray",
                                                                            padding: "20px",
                                                                                      borderRadius: "10px",
                                                                                                marginBottom: "20px"
                                                                                                        }}
                                                                                                              >
                                                                                                                      <h2>Today's Revision</h2>

                                                                                                                              <h3>Best antidote for lead poisoning?</h3>

                                                                                                                                      {!showAnswer ? (
                                                                                                                                                <button onClick={() => setShowAnswer(true)}>
                                                                                                                                                            Show Answer
                                                                                                                                                                      </button>
                                                                                                                                                                              ) : (
                                                                                                                                                                                        <>
                                                                                                                                                                                                    <h3>Calcium disodium EDTA</h3>

                                                                                                                                                                                                                <button>😄 Easy</button>

                                                                                                                                                                                                                            <button style={{ marginLeft: "10px" }}>
                                                                                                                                                                                                                                          😐 Medium
                                                                                                                                                                                                                                                      </button>

                                                                                                                                                                                                                                                                  <button style={{ marginLeft: "10px" }}>
                                                                                                                                                                                                                                                                                😵 Hard
                                                                                                                                                                                                                                                                                            </button>
                                                                                                                                                                                                                                                                                                      </>
                                                                                                                                                                                                                                                                                                              )}
                                                                                                                                                                                                                                                                                                                    </div>

                                                                                                                                                                                                                                                                                                                          <h2>Subjects</h2>

                                                                                                                                                                                                                                                                                                                                {subjects.map((subject) => (
                                                                                                                                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                                                                                                                  key={subject}
                                                                                                                                                                                                                                                                                                                                                            style={{
                                                                                                                                                                                                                                                                                                                                                                        border: "1px solid #ccc",
                                                                                                                                                                                                                                                                                                                                                                                    margin: "10px 0",
                                                                                                                                                                                                                                                                                                                                                                                                padding: "15px",
                                                                                                                                                                                                                                                                                                                                                                                                            borderRadius: "10px"
                                                                                                                                                                                                                                                                                                                                                                                                                      }}
                                                                                                                                                                                                                                                                                                                                                                                                                              >
                                                                                                                                                                                                                                                                                                                                                                                                                                        📚 {subject}
                                                                                                                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                      ))}

                                                                                                                                                                                                                                                                                                                                                                                                                                                            <button>Create Deck</button>

                                                                                                                                                                                                                                                                                                                                                                                                                                                                  <button style={{ marginLeft: "10px" }}>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                          Import Notes
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </button>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      );
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      }