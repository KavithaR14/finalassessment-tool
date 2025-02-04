import React, { useState, useEffect } from "react";
import "./Section3.css";
import { useNavigate } from "react-router-dom";

const initialQuestions = [
  {
    question: "How encouraged do you feel to develop professionally?",
    options: ["Strongly Encouraged", "Encouraged", "Neutral", "Not Encouraged"],
  },
  {
    question: "How would you rate the level of collaboration among your colleagues?",
    options: ["Excellent", "Good", "Average", "Poor"],
  },
  {
    question: "How motivated do you feel to come to work each day?",
    options: ["Very motivated", "Motivated", "Neutral", "Not motivated"],
  },
  {
    question: "How often do you receive constructive feedback?",
    options: ["Frequently", "Occasionally", "Rarely", "Never"],
  },
  {
    question: "How satisfied are you with opportunities for career growth?",
    options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied"],
  },
  {
    question: "How comfortable are you expressing your opinions at work?",
    options: ["Very comfortable","Comfortable", "Neutral", "Uncomfortable"],
  },
  {
    question: "How motivated do you feel to improve or innovate in your teaching practices?",
    options: ["Highly Motivated", "Motivated", "Neutral", "Not Motivated"],
  },
  {
    question: "How often do you receive meaningful opportunities to discuss your career goals with your supervisor?",
    options: ["Regularly", "Occasionally", "Rarely", "Never"],
  },
  {
    question: "How frequently do you participate in team-building activities or staff social events?",
    options: ["Frequently", "Occasionally", "Rarely", "Never"],
  },
];

const optionScores = {
  "Strongly Encouraged":4, 
  "Encouraged":3, 
  "Neutral":2, 
  "Not Encouraged":1,
  "Excellent":4, 
  "Good":3, 
  "Average":2, 
  "Poor":1,
  "Very motivated":4,
  "Motivated":3,
  "Neutral":2, 
  "Not motivated":1,
  "Frequently":4, 
  "Occasionally":3, 
  "Rarely":2, 
  "Never":1,
  "Very Satisfied":4, 
  "Satisfied":3, 
  "Neutral":2, 
  "Dissatisfied":1,
  "Very comfortable":4,
  "Comfortable":3, 
  "Neutral":2, 
  "Uncomfortable":1,
  "Highly Motivated":4, 
  "Motivated":3, 
  "Neutral":2,
   "Not Motivated":1,
  "Regularly":4, 
  "Occasionally":3,
   "Rarely":2, 
   "Never":1,
  "Frequently":4,
   "Occasionally":3, 
  "Rarely":2,
   "Never":1,
  };
const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

const Section3 = () => {
  const navigate = useNavigate();
  const [responses, setResponses] = useState(Array(initialQuestions.length).fill(null));
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  // const [description, setDescription] = useState("");
  const [timeLeft, setTimeLeft] = useState(9 * 60); // 7 minutes in seconds

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
  
    console.log("Section 3 Total Score:", totalScore);
    let description = "";
  
    if (totalScore >= 29 && totalScore <=36) {
      description = ` Highly Encouraged
  
  Description:Opportunities for professionsl growth and abundant, and collaboration among peer is excellent.You feel enconguraged to innovate and improve :
  Tips for Development:
  • Continue promoting team work and cross department collaboration. 
  • Introduce advanced workshops or certifications for continued learning`;
  
    } else if (totalScore >= 21 && totalScore <= 28) {
      description = `Encouraged
  
  Description: Collaboration is good, but growth opportunities might be less frequent. Motivation
to innovate is generally high but could be improved.:
Tips for Development:
  •  Organize more structured career discussions with leadership.
  •  Offer targeted skill enhancement programs`;
 
    } else if (totalScore >= 13 && totalScore <= 20) {
      description = `Somewhat encouraged 
  
  Description: Growth and collaboration opportunities are limited, and you might feel less
motivated to innovate or participate in team activities.:
 
  
  Tips for Development:
  • Focus on creating mentorship programs to encourage collaboration.
  • Schedule periodic training sessions aligned with staff needs`;
  
    } else {
      description = ` Not Encouraged
  
  Description: Professional development is severely lacking. You might feel isolated and
undervalued, with minimal collaboration or growth.:
  
  Tips for Development:
  • Leadership should prioritize development programs and team-building activities.
  • Create clear pathways for career growth and innovation`;
    }
  

    // Save Section 3 score and description
    localStorage.setItem("section3Score", totalScore);
    localStorage.setItem("section3Description", description);

    // Navigate to Bar Graph with all scores
    navigate("/Section4");
  };

  const allAnswered = responses.every((response) => response !== null);

  return (
    <div className="screen3">
    <div className="assessments-containers">
      <h1>Professional Development & Collaboration</h1>
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

export default Section3;