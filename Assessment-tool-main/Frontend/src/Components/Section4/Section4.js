import React, { useState, useEffect } from "react";
import "./Section4.css";
import { useNavigate } from "react-router-dom";
import Chart from "chart.js/auto"; // Import Chart.js for generating the chart
import ChartDataLabels from "chartjs-plugin-datalabels";


const initialQuestions = [
  {
    question: "How effective are the communication channels within your institution?",
    options: ["Very effective", "Effective", "Somewhat effective", "Ineffective"],
  },
  {
    question: "How well does your institution support work-life balance initiatives?",
    options: ["Very well", "Well", "Neutral", "Poorly"],
  },
  {
    question: "How often do you feel a sense of accomplishment in your role?",
    options: ["Always", "Often", "Occasionally", "Rarely"],
  },
  {
    question: "How resilient do you feel when facing challenges at work?",
    options: ["Very resilient", "Resilient", "Somewhat Resilient", "Not resilient"],
  },
  {
    question: "How safe do you feel in expressing your concerns or dissatisfaction without fear of repercussions?",
    options: ["Very Safe", "Safe", "Somewhat Safe", "Not Safe"],
  },
  {
    question: "How supported do you feel when managing challenging student behaviour or issues?",
    options: ["Very supported", "Supported", "Neutral", "Not supported"],
  },
  {
    question: "How connected do you feel to your colleagues and peers?",
    options: ["Very Connected", "Connected", "Neutral", "Disconnected"],
  },
  {
    question: "How frequently do you engage in self-reflection or mindfulness practices to manage work stress?",
    options: ["Regularly", "Sometimes", "Rarely", "Never"],
  },

  {
    question: "How fulfilled do you feel with your teaching's impact on students?",
    options: ["Very Fulfilled", "Fulfilled", "Somewhat Fulfilled", "Not Fulfilled"],
  },
  {
    question: "How open is your institution to feedback and suggestions from staff?",
    options: ["Very open", "Open", "Neutral", "Closed"],
  },

  {
    question: "How much do you feel your work aligns with your personal values?",
    options: ["Completely Aligned", "Aligned", "Somewhat Aligned", "Not Aligned"],
  },
  {
    question: "How often do you feel confident in your abilities and skills as an educator?",
    options: ["Always", "Often", "Sometimes", "Rarely"],
  },
];

const optionScores = {
  "Very effective":4, 
  "Effective":3,
  "Somewhat effective":2, 
  "Ineffective":1,
  "Very well":4, 
  "Well":3,
  "Neutral":2, 
  "Poorly":1,
  "Always":4, "Often":3, "Occasionally":2, "Rarely":1,
  "Very resilient":4, "Resilient":3, "Somewhat Resilient":2, "Not resilient":1,
  "Very Safe":4, "Safe":3, "Somewhat Safe":2, "Not Safe":1,
  "Very supported":4, "Supported":3, "Neutral":2, "Not supported":1,
  "Very Connected":4, "Connected":3, "Neutral":2, "Disconnected":1,
  "Regularly":4, "Sometimes":3, "Rarely":2, "Never":1,
  "Very Fulfilled":4, "Fulfilled":3, "Somewhat Fulfilled":2, "Not Fulfilled":1,
  "Very open":4, 
  
  "Open":3,
  "Neutral":2, 
  "Closed":1,
  "Completely Aligned":4, 
  "Aligned":3, 
  "Somewhat Aligned":2, 
  "Not Aligned":1,
  "Always":4, 
  "Often":3,
  "Sometimes":2, 
  "Rarely":1,
  
};

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

const Section4 = () => {
  const navigate = useNavigate();
  const [responses, setResponses] = useState(Array(initialQuestions.length).fill(null));
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [description, setDescription] = useState("");
  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [timeLeft, setTimeLeft] = useState(12 * 60); // 7 minutes in seconds
  
  // State to store section scores and descriptions
  const [sectionScores, setSectionScores] = useState([]);
  const [sectionDescriptions, setSectionDescriptions] = useState([]);

  useEffect(() => {
    setShuffledQuestions(shuffleArray([...initialQuestions]));
    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");
    if (storedUsername) setUsername(storedUsername);
    if (storedEmail) setUserEmail(storedEmail);
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
  const section1Score = parseInt(localStorage.getItem("section1Score")) || 0;
  const section2Score = parseInt(localStorage.getItem("section2Score")) || 0;
  const section3Score = parseInt(localStorage.getItem("section3Score")) || 0;
  const section4Score = parseInt(localStorage.getItem("section4Score")) || 0;

  const section1Description = localStorage.getItem("section1Description");
  const section2Description = localStorage.getItem("section2Description");
  const section3Description = localStorage.getItem("section3Description");
  const section4Description = localStorage.getItem("section4Description");

  

const generateBarGraph = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 600;  // Set specific width
  canvas.height = 320; // Set specific height
  const ctx = canvas.getContext("2d");

  const data = {
    labels: ["Job Satisfaction & Support", "Stress Management & Workload", "Professional Development & Collaboration", "Workplace Environment & Emotional Well-being"],
    datasets: [
      {
        label: "Assessment Scores",
        data: [
          parseInt(localStorage.getItem("section1Score")) || 0,
          parseInt(localStorage.getItem("section2Score")) || 0,
          parseInt(localStorage.getItem("section3Score")) || 0,
          parseInt(localStorage.getItem("section4Score")) || 0,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"], // Colors for each section
        borderColor: "white", // Dark black outline for pie slices
        borderWidth: 2, // Border width for pie slices
      },
    ],
  };

  // Create and render the chart
  new Chart(ctx, {
    type: "pie", // Change chart type to "pie"
    data: data,
    plugins: [ChartDataLabels], // Add the datalabels plugin
    options: {
      responsive: false, // Disable responsiveness
      animation: false, // Disable animations
      plugins: {
        legend: {
          labels: {
            color: "white", // Set legend text to white
          },
        },
        datalabels: {
          color: "white", // Set label text color to black
          font: {
            weight: "bold", // Make the text bold
          },
          formatter: (value) => {
            return value; // Display the score on the pie chart
          },
        },
      },
    },
  });

  return canvas.toDataURL("image/png");
};

const sendReportEmail = async (currentDescription, totalScore) => {
  try {
    // Generate chart image before sending
    const chartImage = generateBarGraph();

    // Ensure email and username are available
    if (!userEmail || !username) {
      console.error("No email or username found in localStorage");
      return;
    }

    const response = await fetch("http://localhost:5006/api/send-report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userEmail,
        userName: username,
        sectionScores: {
          section1Score,
          section2Score,
          section3Score,
          section4Score,
        },
        sectionDescriptions: {
          section1Description,
          section2Description,
          section3Description,
          section4Description: currentDescription, // Use the current description for Section 4
        },
        chartImage,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to send report");

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending report email:", error);
  }
};
const handleNext = async (e) => {
  e.preventDefault();
  try {
    const totalScore = responses.reduce((score, response) => {
      return score + (response ? optionScores[response] : 0);
    }, 0);

    console.log("Section 4 Total Score:", totalScore);
    let description = "";

    if (totalScore >= 29 && totalScore <= 36) {
      description = `Highly Encouraged\n\nDescription: The workplace is emotionally supportive, inclusive, and fosters a sense of accomplishment. You feel resilient, connected, and aligned with your values.\nTips for Development:\n• Maintain emotional support programs and peer connection opportunities.\n• Strengthen initiatives promoting open feedback and inclusion`;
    } else if (totalScore >= 21 && totalScore <= 28) {
      description = `Encouraged\n\nDescription: Emotional well-being is generally good, but occasional gaps in support or inclusion exist. Feelings of connection may vary.\nTips for Development:\n• Enhance team-building activities to foster stronger relationships.\n• Provide workshops on resilience and mindfulness to address emotional challenges`;
    } else if (totalScore >= 13 && totalScore <= 20) {
      description = `Somewhat encouraged\n\nDescription: You may face inconsistent emotional support or feel disconnected from colleagues. Workplace alignment with values may be lacking.\nTips for Development:\n• Introduce structured mental health programs and stress management sessions.\n• Provide platforms for staff to express concerns or dissatisfaction safely.`;
    } else {
      description = `Not Encouraged\n\nDescription: Emotional well-being is significantly impacted. The workplace feels isolating, and support systems are inadequate.\nTips for Development:\n• Leadership must urgently address issues with a focus on inclusivity and trust-building.\n• Foster connections among peers through regular social events`;
    }

    // Store Section 4 score and description in localStorage
    localStorage.setItem("section4Score", totalScore.toString());
    localStorage.setItem("section4Description", description);

    // Update sectionDescriptions state
    setSectionDescriptions((prevDescriptions) => ({
      ...prevDescriptions,
      section4Description: description,
    }));

    // Ensure that we pass the updated values of sectionScores and sectionDescriptions to sendReportEmail
    if (userEmail && username && description) {
      await sendReportEmail(description, totalScore);
    }

    navigate("/Bargraph", { state: { totalScore } });
  } catch (error) {
    console.error("Error in handleNext:", error);
  }
};
  
  return (
    <div className="screen4">
    <div className="assessment1-container">
      <h1>Workplace Environment & Emotional Well-being</h1>
      <div className="timer">
          <p>Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}</p>
        </div>
      <form onSubmit={handleNext}>
        {shuffledQuestions.map((item, index) => (
          <div key={index} className="question-container">
            <p className="question">{index + 1}. {item.question}</p>
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
            type="submit"
            className="nav"
            disabled={!responses.every((r) => r !== null)}
          >
            Submit
          </button>
        </div>
      </form>
      {/* <div className="description">
        {description && <p>{description}</p>}
      </div> */}
    </div>
    </div>
  );
};

export default Section4;