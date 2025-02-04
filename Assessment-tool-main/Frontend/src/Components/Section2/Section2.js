import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Section2.css";

const initialQuestions = [
  {
    question: "How balanced do you feel recognized for your contributions?",
    options: ["Very balanced", "Somewhat balanced", "Not very balanced", "Not balanced at all"],
  },
  {
    question: "How often do you experience stress at work?",
    options: ["Rarely", "Occasionally", "Frequently", "Always"],
  },
  {
    question: "How much autonomy do you feel you have in your teaching methods?",
    options: ["A great deal", "Some", "Minimal", "None"],
  },
  {
    question: "How often do you feel mentally exhausted by your work?",
    options: ["Rarely", "Occasionally", "Frequently", "Always"],
  },
  {
    question: "How often do you experience feelings of burnout?",
    options: ["Rarely", "Occasionally", "Frequently", "Very often"],
  },
  {
    question: "How supported do you feel in balancing your emotional and mental health needs?",
    options: ["Very supported", "Supported", "Neutral", "Not supported"],
  },
  {
    question: "How satisfied are you with the balance between administrative tasks and actual teaching?",
    options: ["Very Satisified", "Satisfied", "Neutral", "Dissatisfied"],
  },
];

const optionScores = {
  "Very balanced": 4,
  "Somewhat balanced": 3,
  "Not very balanced": 2,
  "Not balanced at all": 1,
  "Rarely": 4,
  "Occasionally": 3,
  "Frequently": 2,
  "Always": 1,
  "A great deal": 4,
  "Some": 3,
  "Minimal": 2,
  "None": 1,
  "Very supported": 4,
  "Supported": 3,
  "Neutral": 2,
  "Not supported": 1,
  "Very Satisified": 4,
  "Satisfied": 3,
  "Neutral": 2,
  "Dissatisfied": 1,
};

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

const Section2 = () => {
  const navigate = useNavigate();
  const [responses, setResponses] = useState(Array(initialQuestions.length).fill(null));
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(7 * 60); // 7 minutes in seconds

  useEffect(() => {
    setShuffledQuestions(shuffleArray([...initialQuestions]));

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 1) {
          clearInterval(timer);
          handleNext(); // Automatically navigate to next section when time runs out
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  const handleOptionChange = (e, questionIndex) => {
    const newResponses = [...responses];
    newResponses[questionIndex] = e.target.value;
    setResponses(newResponses);
  };

  const handleNext = () => {
    const totalScore = responses.reduce((score, response) => {
      return score + (response ? optionScores[response] : 0);
    }, 0);

    let description = "";

    if (totalScore >= 23 && totalScore <= 28) {
      description = `Excellent Management
  
  Description: You manage stress well, feel balanced in workload, and have sufficient autonomy in your role. Work rarely leads to burnout.
  
  Tips for Development:
  • Continue practicing mindfulness or stress management techniques.
  • Encourage leadership to provide more autonomy where appropriate.`;
    } else if (totalScore >= 17 && totalScore <= 22) {
      description = `Good Management
  
  Description: Stress is manageable, but occasional imbalances in workload or autonomy cause tension. Burnout may occur infrequently.
  
  Tips for Development:
  • Adjust workloads to ensure balance.
  • Offer wellness programs and resilience-building workshops.`;
    } else if (totalScore >= 11 && totalScore <= 16) {
      description = `Moderate Management
  
  Description: Stress levels are inconsistent, workload balance is an issue, and burnout may occur frequently.
  
  Tips for Development:
  • Conduct regular reviews of workload distribution.
  • Provide training on managing work-related anxiety and encourage breaks.`;
    } else {
      description = `Poor Management
  
  Description: Stress and burnout are high. You feel overwhelmed and lack balance or autonomy in your role.
  
  Tips for Development:
  • Leadership should take immediate steps to reduce workload.
  • Provide emotional and mental health support resources.`;
    }

    localStorage.setItem("section2Score", totalScore);
    localStorage.setItem("section2Description", description);
    navigate("/Section3");
  };

  const allAnswered = responses.every((response) => response !== null);

  return (
    <div className="screen1">
      <div className="assessments-container">
        <h1>Stress Management & Workload</h1>
        <div className="timer">
          <p>Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}</p>
        </div>
        <form>
          {shuffledQuestions.map((item, index) => (
            <div key={index} className="question-container">
              <p className="question">
                {index + 1}. {item.question}
              </p>
              <div className="options">
                {item.options.map((option, i) => (
                  <label key={i}>
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      checked={responses[index] === option}
                      onChange={(e) => handleOptionChange(e, index)}
                      required
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <div className="nav">
            <button type="button" className="nav" onClick={handleNext} disabled={!allAnswered}>
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Section2;
