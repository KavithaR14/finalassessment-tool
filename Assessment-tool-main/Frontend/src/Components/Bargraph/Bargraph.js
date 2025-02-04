import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import html2pdf from "html2pdf.js";
import './Bargraph.css';

// Register chart components
ChartJS.register(ArcElement, Tooltip, Legend);

const Bargraph = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const sectionScores = [
    parseInt(localStorage.getItem("section1Score")) || 0,
    parseInt(localStorage.getItem("section2Score")) || 0,
    parseInt(localStorage.getItem("section3Score")) || 0,
    parseInt(localStorage.getItem("section4Score")) || 0,
  ];

  const sectionDescriptions = [
    localStorage.getItem("section1Description"),
    localStorage.getItem("section2Description"),
    localStorage.getItem("section3Description"),
    localStorage.getItem("section4Description"),
  ];

  const labels = [
    "Job Satisfaction & Support",
    "Stress Management & Workload",
    "Professional Development & Collaboration",
    "Workplace Environment & Emotional Well-being",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Total Score",
        data: sectionScores,
        backgroundColor: [
          "rgba(0, 123, 255, 0.8)",
          "rgba(255, 99, 132, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: { display: true, text: "Scores by Section", font: { size: 20 } },
      legend: { position: 'bottom', labels: { font: { size: 14 } } },
    },
  };

  const generatePDF = () => {
    const element = document.getElementById("report-content");
    html2pdf().from(element).set({ filename: `${username}_Report.pdf` }).save();
  };

  return (
    <div className="bargraph-container" id="report-content">
      <header className="report-header">
        <p>Generated for: <strong>{username}</strong></p>
      </header>

      {/* Separate Container for Pie Chart */}
      <div className="pie-chart-container">
        <Pie data={data} options={options} width={80} height={80} />
      </div>

      <div className="cards-container">
        {labels.map((label, index) => (
          <div className="card" key={index}>
            <h3>{label}</h3>
            <p className="score">Score: {sectionScores[index]}</p>
            <div className="description">
              {sectionDescriptions[index]?.split('\n').map((point, idx) => (
                <p key={idx} className="description-point">{point}</p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="download-section">
        <button onClick={generatePDF} className="download-btn">Download Report 📄</button>
      </div>
    </div>
  );
};

export default Bargraph;
