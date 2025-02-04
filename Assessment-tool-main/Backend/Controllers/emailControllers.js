const fs = require("fs");
const path = require("path");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const nodemailer = require("nodemailer");

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Reduced spacing constants
const SECTION_TITLE_SIZE = 14;
const NORMAL_TEXT_SIZE = 11;
const SECTION_SPACING = 25;
const SUBSECTION_SPACING = 15;
const TEXT_SPACING = 15;
const LEFT_MARGIN = 70;
const TEXT_MARGIN = 90;
const LINE_HEIGHT = 15;
const PAGE_TOP_MARGIN = 450;
const THIRD_PAGE_TOP_MARGIN = 600; // Increased top margin for third page to start higher

const generatePDF = async (userName, chartImage, sectionScores, sectionDescriptions) => {
  // Load template
  const templatePath = path.join(__dirname, "Templates", "templatesss.pdf");
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template file not found at ${templatePath}`);
  }

  const filePath = path.join(__dirname, "Assessment_Report.pdf");
  const templateBytes = fs.readFileSync(templatePath);
  const pdfDoc = await PDFDocument.load(templateBytes);

  // Add fonts
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Get pages
  const secondPage = pdfDoc.getPages()[1];
  const thirdPage = pdfDoc.getPages()[2];
  const fourthPage = pdfDoc.getPages()[3];
  const { width, height } = secondPage.getSize();
  const CONTENT_WIDTH = width - 140;

  // Modified text drawing function with reduced spacing
  const drawText = (page, text, startX, startY, maxWidth, fontSize, font) => {
    let currentY = startY;
    const safeText = text || "";
    const paragraphs = safeText.split('\n').filter(p => p.trim());
    
    for (const paragraph of paragraphs) {
      let words = paragraph.trim().split(' ');
      let currentLine = '';
      
      for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const textWidth = font.widthOfTextAtSize(testLine, fontSize);
        
        if (textWidth > maxWidth && currentLine !== '') {
          page.drawText(currentLine.trim(), {
            x: startX,
            y: currentY,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0),
          });
          currentY -= LINE_HEIGHT;
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      
      if (currentLine) {
        page.drawText(currentLine.trim(), {
          x: startX,
          y: currentY,
          size: fontSize,
          font: font,
          color: rgb(0, 0, 0),
        });
        currentY -= LINE_HEIGHT;
      }
      
      currentY -= LINE_HEIGHT / 3;
    }
    
    return currentY;
  };

  // Modified tips processing
  const processTipsText = (text) => {
    if (!text) return "";
    return text.split('\n')
      .map(point => point.trim())
      .filter(point => point.length > 0)
      .map(point => point.startsWith('•') ? point : `• ${point}`)
      .join('\n');
  };

  // Modified section drawing with reduced spacing
  const drawSection = (page, title, description, tips, startY) => {
    let currentY = startY;
    
    // Section Title
    page.drawText(title || "", {
      x: LEFT_MARGIN,
      y: currentY,
      size: SECTION_TITLE_SIZE,
      font: helveticaBold,
      color: rgb(0, 0, 0),
    });
    currentY -= SECTION_SPACING;

    // Description (without "Description:" label)
    if (description) {
      currentY = drawText(
        page,
        description,
        TEXT_MARGIN,
        currentY,
        CONTENT_WIDTH,
        NORMAL_TEXT_SIZE,
        helveticaFont
      );
      currentY -= SUBSECTION_SPACING / 2;
    }

    // Tips
    if (tips && tips.trim()) {
      page.drawText("Tips for Development:", {
        x: TEXT_MARGIN,
        y: currentY,
        size: NORMAL_TEXT_SIZE,
        font: helveticaBold,
        color: rgb(0, 0, 0),
      });
      currentY -= TEXT_SPACING;

      currentY = drawText(
        page,
        processTipsText(tips),
        TEXT_MARGIN,
        currentY,
        CONTENT_WIDTH,
        NORMAL_TEXT_SIZE,
        helveticaFont
      );
    }
    
    return currentY - SECTION_SPACING / 2;
  };

  // Draw sections on the second page
  let currentY = PAGE_TOP_MARGIN - 50;

  currentY = drawSection(
    secondPage,
    "Section 1: Job Satisfaction & Support",
    sectionDescriptions?.section1Description,
    sectionDescriptions?.section1Tips,
    currentY
  );

  currentY = drawSection(
    secondPage,
    "Section 2: Stress Management & Workload",
    sectionDescriptions?.section2Description,
    sectionDescriptions?.section2Tips,
    currentY
  );

  // Reset Y position for the third page - Now using THIRD_PAGE_TOP_MARGIN
  currentY = THIRD_PAGE_TOP_MARGIN;

  currentY = drawSection(
    thirdPage,
    "Section 3: Professional Development & Collaboration",
    sectionDescriptions?.section3Description,
    sectionDescriptions?.section3Tips,
    currentY
  );

  currentY = drawSection(
    thirdPage,
    "Section 4: Workplace Environment & Emotional Well-being",
    sectionDescriptions?.section4Description,
    sectionDescriptions?.section4Tips,
    currentY
  );

  // Chart positioning on the fourth page
  if (chartImage) {
    const base64Image = chartImage.replace(/^data:image\/png;base64,/, "");
    const chartBuffer = Buffer.from(base64Image, "base64");
    const chartImageEmbed = await pdfDoc.embedPng(chartBuffer);

    const chartDimensions = {
      width: 400,
      height: 250,
      x: 2, // Adjusted to move the chart to the left side
      y: (height - 250) / 2 // Centered vertically
    };

    fourthPage.drawImage(chartImageEmbed, chartDimensions);
  }

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(filePath, pdfBytes);
  return filePath;
};

const sendReport = async (req, res) => {
  try {
    const { userEmail, userName, chartImage, sectionScores, sectionDescriptions } = req.body;

    if (!userEmail || !userName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const pdfPath = await generatePDF(userName, chartImage, sectionScores, sectionDescriptions);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Your Assessment Report",
      text: `Dear ${userName},\n\nPlease find your assessment report attached.\n\nBest regards,\nAssessment Team`,
      attachments: [
        {
          filename: "Assessment_Report.pdf",
          path: pdfPath,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    fs.unlinkSync(pdfPath);
    res.status(200).json({ message: "Report sent successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error sending report", error: error.message });
  }
};

module.exports = { sendReport };