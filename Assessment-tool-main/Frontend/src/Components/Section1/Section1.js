import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Section1.css";

// Mapping of answers to their respective scores (4, 3, 2, 1)
const optionScores = {
  "Very satisfied": 4,
  "Satisfied": 3,
  "Neutral": 2,
  "Dissatisfied": 1,
  "Very Supported": 4,
  "Somewhat Supported": 3,
  "Neutral": 2,
  "Not Supported at all": 1,
  "Very clear": 4,
  "Somewhat clear": 3,
  "Vague": 2,
  "Unclear": 1,
  "Highly valued": 4,
  "Valued": 3,
  "Neutral": 2,
  "Not valued": 1,
  "Very fair": 4,
  "Fair": 3,
  "Neutral": 2,
  "Unfair": 1,
  "Very well": 4,
  "Well": 3,
  "Poorly": 2,
  "Very poorly": 1,
  "Complete trust": 4,
  "Significant trust": 3,
  "Minimal trust": 2,
  "No trust": 1,
  "Very valued": 4,
  "Valued": 3,
  "Neutral": 2,
  "Not valued": 1,
  "Very meaningful": 4,
  "Meaningful": 3,
  "Somewhat meaningful": 2,
  "Not meaningful": 1,
  "Always": 4,
  "Often": 3,
  "Occasionally": 2,
  "Rarely/Never": 1,
};

const initialQuestions = [
  {
    question: "How satisfied are you with the resources provided for teaching?",
    options: ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied"],
  },
  {
    question: "How supported do you feel by your administration?",
    options: ["Very Supported", "Somewhat Supported", "Neutral", "Not Supported at all"],
  },
  {
    question: "How satisfied are you with your teaching workload?",
    options: ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied"],
  },
  {
    question: "How clear are the goals and expectations set by your institution?",
    options: ["Very clear", "Somewhat clear", "Vague", "Unclear"],
  },
  {
    question: "How valued do you feel in your workplace?",
    options: ["Highly valued", "Valued", "Neutral", "Not valued"],
  },
  {
    question: "How fair do you find the performance evaluation process?",
    options: ["Very fair", "Fair", "Neutral", "Unfair"],
  },
  {
    question: "How well does your institution handle conflicts among staff?",
    options: ["Very well", "Well", "Poorly", "Very poorly"],
  },
  {
    question: "How much trust do you have in the leadership of your institution?",
    options: ["Complete trust", "Significant trust", "Minimal trust", "No trust"],
  },
  {
    question: "How valued do you feel for your unique teaching style and ideas?",
    options: ["Very valued", "Valued", "Neutral", "Not valued"],
  },
  {
    question: "How meaningful do you find your work?",
    options: ["Very meaningful", "Meaningful", "Somewhat meaningful", "Not meaningful"],
  },
  {
    question: "How often do you feel recognized for your contributions?",
    options: ["Always", "Often", "Occasionally", "Rarely/Never"],
  },
];

// Shuffle questions
const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

const getDescription = (totalScore) => {
  if (totalScore >= 36) {
    return {
      score: `${totalScore}/40`,
      level: "Highly Satisfied",
      description: "• You feel supported, valued, and recognized in your workplace. Expectations are clear, and your work is meaningful. Performance evaluation is fair, and you have a strong trust in leadership.",
      tips: [
        "• Continue fostering strong relationships with leadership and peers",
        "• Explore ways to recognize efforts more frequently to maintain morale",
        "• Keep refining performance evaluation processes for transparency"
      ]
    };
  } else if (totalScore >= 28) {
    return {
      level: "Satisfied",
      description: "• Overall satisfaction is good, but occasional gaps in recognition or support exist. Trust in leadership and satisfaction with workload are present but could improve.",
      tips: [
        "• Provide additional resources or mentorship to address support gaps",
        "• Conduct feedback sessions to address concerns regarding recognition or performance evaluation"
      ]
    };
  } else if (totalScore >= 18) {
    return {
      level: "Moderately Satisfied",
      description: "• Satisfaction levels are mixed. You may feel undervalued, lack trust in leadership, or face occasional dissatisfaction with workload or recognition.",
      tips: [
        "• Work with leadership to create clearer goals and feedback loops",
        "• Implement regular appreciation events to boost morale"
      ]
    };
  } else {
    return {
      level: "Dissatisfied",
      description: "• Dissatisfaction with support, trust in leadership, or fairness in evaluations is high. Your work might not feel meaningful or valued.",
      tips: [
        "• Schedule one-on-one meetings with leadership to identify pain points",
        "• Create a more inclusive and transparent environment for setting goals"
      ]
    };
  }
};

const Section1 = () => {
  const navigate = useNavigate();
  const [responses, setResponses] = useState(Array(initialQuestions.length).fill(null));
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(660); // 11 minutes = 660 seconds

  useEffect(() => {
    setShuffledQuestions(shuffleArray([...initialQuestions]));

    // Timer countdown
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

    const result = getDescription(totalScore);
    const formattedDescription = `${result.level}\n\nDescription: \n${result.description}\n\nTips for Development:\n${result.tips.join('\n')}`;

    localStorage.setItem("section1Score", totalScore);
    localStorage.setItem("section1Description", formattedDescription);

    navigate("/Section2");
  };

  const allAnswered = responses.every((response) => response !== null);

  return (
    <div className="screen">
      <div className="assessment-containers">
        <h1>JOB SATISFACTION</h1>
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
            <button
              type="button"
              className="nav"
              onClick={handleNext}
              disabled={!allAnswered}
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Section1;
