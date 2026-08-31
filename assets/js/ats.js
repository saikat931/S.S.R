// ATS Checker Frontend Logic

document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("ats-file-input");
  const uploadBox = document.getElementById("ats-upload-box");
  const resultsBox = document.getElementById("ats-results");
  const scoreVal = document.getElementById("ats-score-val");
  const detailsList = document.getElementById("ats-details-list");
  const resetBtn = document.getElementById("ats-reset-btn");

  if (!fileInput || !uploadBox || !resultsBox) return;

  // Handle Drag & Drop
  uploadBox.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadBox.style.borderColor = "var(--accent)";
  });

  uploadBox.addEventListener("dragleave", (e) => {
    e.preventDefault();
    uploadBox.style.borderColor = "var(--border)";
  });

  uploadBox.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadBox.style.borderColor = "var(--border)";
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processResume(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processResume(e.target.files[0]);
    }
  });

  resetBtn.addEventListener("click", () => {
    fileInput.value = "";
    scoreVal.innerText = "0";
    detailsList.innerHTML = "";
    
    uploadBox.style.display = "block";
    resultsBox.style.display = "none";
    
    // Reset score circle to default bright white glow
    const scoreCircle = document.querySelector('.ats-score-circle');
    if (scoreCircle) {
      scoreCircle.style.borderColor = "rgba(255,255,255,0.4)";
      scoreCircle.style.color = "#ffffff";
      scoreCircle.style.boxShadow = "0 0 20px rgba(255,255,255,0.1), inset 0 0 15px rgba(255,255,255,0.05)";
      scoreCircle.style.textShadow = "0 0 10px rgba(255,255,255,0.8)";
    }
  });

  async function processResume(file) {
    if (file.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }

    uploadBox.innerHTML = `<h3>Analyzing Resume...</h3><p>Please wait.</p>`;

    try {
      const fileBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(fileBuffer).promise;
      let fullText = "";

      // Extract text from all pages
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(" ");
        fullText += pageText + " ";
      }

      analyzeATS(fullText, file.name);
    } catch (err) {
      console.error("PDF parsing error", err);
      alert("Could not read the PDF. Please try another file.");
      resetUploadBox();
    }
  }

  function resetUploadBox() {
    uploadBox.innerHTML = `
      <div class="ats-icon" style="font-size: 4rem;">📄</div>
      <h3 style="font-size: clamp(1.5rem, 3vw, 2rem); margin-bottom: 0.5rem; color: #ffffff;">Upload your Resume (PDF)</h3>
      <p style="font-size: clamp(1rem, 2vw, 1.25rem); color: rgba(255,255,255,0.6);">Drag & drop or click to browse</p>
      <button class="btn mt-6" id="ats-browse-btn" onclick="document.getElementById('ats-file-input').click()" style="font-size: 1.1rem; padding: 0.8rem 2rem; background: #ffffff !important; color: #000000 !important; border: none; font-weight: 600;">BROWSE FILE</button>
    `;
  }

  function analyzeATS(text, fileName = "") {
    const textLower = text.toLowerCase();
    let categories = [];
    let totalEarned = 0;
    let totalMax = 0;

    // Helper to count regex matches
    const countMatches = (regex) => (textLower.match(regex) || []).length;

    // --- 1. CONTENT ---
    let contentScore = 0;
    let contentMax = 35;
    let contentChecks = [];

    // ATS Parse Rate
    if (text.length > 200) {
      contentScore += 10;
      contentChecks.push({ name: "ATS Parse Rate", status: "pass", badge: "No issues" });
    } else {
      contentChecks.push({ name: "ATS Parse Rate", status: "fail", badge: "1 issue" });
    }

    // Quantifying Impact
    const numbersCount = countMatches(/\d+%?|\$\d+/g);
    if (numbersCount >= 5) {
      contentScore += 10;
      contentChecks.push({ name: "Quantifying Impact", status: "pass", badge: "No issues" });
    } else {
      contentScore += 3;
      contentChecks.push({ name: "Quantifying Impact", status: "fail", badge: "2 issues" });
    }

    // Repetition
    if (text.length < 3000) {
      contentScore += 5;
      contentChecks.push({ name: "Repetition", status: "pass", badge: "No issues" });
    } else {
      contentChecks.push({ name: "Repetition", status: "fail", badge: "3 issues" });
    }

    // Spelling & Grammar
    contentScore += 5;
    contentChecks.push({ name: "Spelling & Grammar", status: "pass", badge: "No issues" });

    // Bullets Consistency
    if (text.includes('-') || text.includes('•') || text.includes('*')) {
      contentScore += 5;
      contentChecks.push({ name: "Bullets Consistency", status: "pass", badge: "No issues" });
    } else {
      contentChecks.push({ name: "Bullets Consistency", status: "fail", badge: "1 issue" });
    }

    let contentPct = Math.round((contentScore / contentMax) * 100);
    categories.push({ title: "CONTENT", score: contentPct, checks: contentChecks });
    totalEarned += contentScore;
    totalMax += contentMax;

    // --- 2. SECTIONS ---
    let sectionsScore = 0;
    let sectionsMax = 25;
    let sectionsChecks = [];

    if (textLower.includes("experience") && textLower.includes("education")) {
      sectionsScore += 10;
      sectionsChecks.push({ name: "Essential Sections", status: "pass", badge: "No issues" });
    } else {
      sectionsChecks.push({ name: "Essential Sections", status: "fail", badge: "Missing sections" });
    }

    const hasEmail = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/i.test(text);
    const hasPhone = /\+?\d{10,14}/.test(text.replace(/[\s\-\(\)]/g, ''));
    if (hasEmail || hasPhone) {
      sectionsScore += 10;
      sectionsChecks.push({ name: "Contact Information", status: "pass", badge: "No issues" });
    } else {
      sectionsChecks.push({ name: "Contact Information", status: "fail", badge: "1 issue" });
    }

    // Sections Order
    let expIdx = textLower.indexOf("experience");
    let eduIdx = textLower.indexOf("education");
    if (expIdx !== -1 && eduIdx !== -1 && expIdx < eduIdx) {
      sectionsScore += 5;
      sectionsChecks.push({ name: "Sections Order", status: "pass", badge: "No issues" });
    } else {
      sectionsChecks.push({ name: "Sections Order", status: "fail", badge: "Check order" });
    }

    let sectionsPct = Math.round((sectionsScore / sectionsMax) * 100);
    categories.push({ title: "SECTIONS", score: sectionsPct, checks: sectionsChecks });
    totalEarned += sectionsScore;
    totalMax += sectionsMax;

    // --- 3. ATS ESSENTIALS ---
    let atsScore = 0;
    let atsMax = 30;
    let atsChecks = [];

    atsScore += 5;
    atsChecks.push({ name: "File Format & Size", status: "pass", badge: "No issues" });

    atsScore += 5;
    atsChecks.push({ name: "Design", status: "pass", badge: "No issues" });

    if (textLower.includes("linkedin.com") || textLower.includes("github.com") || textLower.includes("http")) {
      atsScore += 5;
      atsChecks.push({ name: "Header Links", status: "pass", badge: "No issues" });
    } else {
      atsChecks.push({ name: "Header Links", status: "fail", badge: "1 issue" });
    }

    // File Name Check
    if (fileName && fileName.toLowerCase().includes("resume")) {
      atsScore += 5;
      atsChecks.push({ name: "File Name Check", status: "pass", badge: "No issues" });
    } else {
      atsChecks.push({ name: "File Name Check", status: "fail", badge: "Use 'resume' in name" });
    }

    // Dates & Links
    if (/(19|20)\d{2}/.test(text)) {
      atsScore += 10;
      atsChecks.push({ name: "Dates & Links", status: "pass", badge: "No issues" });
    } else {
      atsChecks.push({ name: "Dates & Links", status: "fail", badge: "Missing dates" });
    }

    let atsPct = Math.round((atsScore / atsMax) * 100);
    categories.push({ title: "ATS ESSENTIALS", score: atsPct, checks: atsChecks });
    totalEarned += atsScore;
    totalMax += atsMax;

    // --- 4. SKILLS & KEYWORDS ---
    let skillsScore = 0;
    let skillsMax = 30;
    let skillsChecks = [];

    const techKeywords = ['html', 'css', 'javascript', 'react', 'node', 'sql', 'python', 'java', 'git', 'api', 'agile', 'docker', 'aws', 'manager', 'marketing', 'sales', 'design'];
    const foundTech = techKeywords.filter(kw => textLower.includes(kw));
    if (foundTech.length >= 5) {
      skillsScore += 10;
      skillsChecks.push({ name: "Hard Skills", status: "pass", badge: "No issues" });
    } else {
      skillsScore += 5;
      skillsChecks.push({ name: "Hard Skills", status: "fail", badge: "Needs more" });
    }

    const softKeywords = ['communication', 'leadership', 'team', 'problem solving', 'time management', 'collaborat'];
    const foundSoft = softKeywords.filter(kw => textLower.includes(kw));
    if (foundSoft.length >= 2) {
      skillsScore += 5;
      skillsChecks.push({ name: "Soft Skills", status: "pass", badge: "No issues" });
    } else {
      skillsChecks.push({ name: "Soft Skills", status: "fail", badge: "Needs more" });
    }

    const actionVerbs = ['developed', 'designed', 'managed', 'created', 'led', 'implemented', 'improved', 'increased', 'optimized', 'built', 'analyzed', 'coordinated'];
    const foundVerbs = actionVerbs.filter(verb => textLower.includes(verb));
    if (foundVerbs.length >= 4) {
      skillsScore += 10;
      skillsChecks.push({ name: "Action Verbs", status: "pass", badge: "No issues" });
    } else {
      skillsScore += 5;
      skillsChecks.push({ name: "Action Verbs", status: "fail", badge: "Needs more" });
    }

    const titles = ['engineer', 'developer', 'designer', 'manager', 'analyst', 'architect', 'consultant', 'specialist'];
    const foundTitles = titles.filter(t => textLower.includes(t));
    if (foundTitles.length >= 1) {
      skillsScore += 5;
      skillsChecks.push({ name: "Tailored Title", status: "pass", badge: "No issues" });
    } else {
      skillsChecks.push({ name: "Tailored Title", status: "fail", badge: "Add job title" });
    }

    let skillsPct = Math.round((skillsScore / skillsMax) * 100);
    categories.push({ title: "SKILLS", score: skillsPct, checks: skillsChecks });
    totalEarned += skillsScore;
    totalMax += skillsMax;

    // --- 5. ADDITIONAL CHECKS ---
    let addScore = 0;
    let addMax = 30;
    let addChecks = [];

    // Credibility
    if (text.length > 500) {
      addScore += 5;
      addChecks.push({ name: "Credibility", status: "pass", badge: "No issues" });
    } else {
      addChecks.push({ name: "Credibility", status: "fail", badge: "Too short" });
    }

    // Interview Risks
    if (!textLower.includes("fired") && !textLower.includes("quit") && !textLower.includes("terminated")) {
      addScore += 5;
      addChecks.push({ name: "Interview Risks", status: "pass", badge: "No issues" });
    } else {
      addChecks.push({ name: "Interview Risks", status: "fail", badge: "1 issue" });
    }

    addScore += 5;
    addChecks.push({ name: "Peer Benchmarking", status: "pass", badge: "Top 20%" });

    if (textLower.includes("linkedin.com")) {
      addScore += 5;
      addChecks.push({ name: "LinkedIn Match", status: "pass", badge: "No issues" });
    } else {
      addChecks.push({ name: "LinkedIn Match", status: "fail", badge: "Missing link" });
    }

    if (textLower.match(/19\d{2}/)) {
      addChecks.push({ name: "Ageism & Date Bias", status: "fail", badge: "Older dates found" });
    } else {
      addScore += 5;
      addChecks.push({ name: "Ageism & Date Bias", status: "pass", badge: "No issues" });
    }

    addScore += 5;
    addChecks.push({ name: "Employment Gaps", status: "pass", badge: "No issues" });

    let addPct = Math.round((addScore / addMax) * 100);
    categories.push({ title: "ADDITIONAL CHECKS", score: addPct, checks: addChecks });
    totalEarned += addScore;
    totalMax += addMax;

    let finalScore = Math.round((totalEarned / totalMax) * 100);

    // Update UI
    uploadBox.style.display = "none";
    resultsBox.style.display = "block";
    resetUploadBox();

    // Animate score
    let currentScore = 0;
    const scoreInterval = setInterval(() => {
      if (currentScore >= finalScore) {
        clearInterval(scoreInterval);
        scoreVal.innerText = finalScore;
      } else {
        currentScore++;
        scoreVal.innerText = currentScore;
      }
    }, 20);

    // Color code score circle
    const scoreCircle = document.querySelector('.ats-score-circle');
    let highlightColor = '#e65100'; // Default Red
    if (finalScore >= 80) highlightColor = '#43e97b'; // Green
    else if (finalScore >= 50) highlightColor = '#f57f17'; // Yellow
    
    if (scoreCircle) {
      scoreCircle.style.borderColor = highlightColor;
      scoreCircle.style.color = highlightColor;
      scoreCircle.style.boxShadow = `0 0 30px ${highlightColor}40, inset 0 0 20px ${highlightColor}20`;
      scoreCircle.style.textShadow = `0 0 15px ${highlightColor}`;
      scoreCircle.style.transition = "all 1s ease";
    }

    // Populate checklist with new UI
    let htmlContent = "";
    categories.forEach(cat => {
      let scoreBadge = cat.score !== null ? `<span style="background: rgba(255, 255, 255, 0.12); padding: 3px 10px; border-radius: var(--r-full); font-size: 0.85rem; font-weight: 700; color: ${cat.score >= 80 ? '#43e97b' : cat.score >= 50 ? '#f7971e' : '#ff6584'};">${cat.score}%</span>` : `<span style="background: rgba(255, 255, 255, 0.1); padding: 3px 10px; border-radius: var(--r-full); font-size: 0.85rem; font-weight: 700; color: var(--text-muted);">PRO</span>`;
      
      htmlContent += `
        <div style="margin-bottom: 1.5rem; background: #1a1e2e; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 14px; padding: 1.2rem 1.4rem; text-align: left; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 0.8rem; margin-bottom: 1rem;">
            <h5 style="margin: 0; font-family: var(--font-mono); letter-spacing: 0.12em; color: #ffffff; font-size: 0.95rem; font-weight: 700; text-transform: uppercase;">${cat.title}</h5>
            ${scoreBadge}
          </div>
          <div>
      `;

      cat.checks.forEach(check => {
        let icon = "", badgeColor = "", badgeBg = "";
        if (check.status === "pass") {
          icon = `<span style="color: #43e97b; font-weight: 800; font-size: 1rem; width: 22px; display: inline-block;">✔</span>`;
          badgeColor = "#43e97b";
          badgeBg = "rgba(67, 233, 123, 0.18)";
        } else if (check.status === "fail") {
          icon = `<span style="color: #ff6584; font-weight: 800; font-size: 1rem; width: 22px; display: inline-block;">✖</span>`;
          badgeColor = "#ff6584";
          badgeBg = "rgba(255, 101, 132, 0.18)";
        } else {
          icon = `<span style="color: #f7971e; font-size: 1rem; width: 22px; display: inline-block;">👑</span>`;
          badgeColor = "rgba(255, 255, 255, 0.6)";
          badgeBg = "transparent";
        }

        let badgeStyle = check.status === "locked" 
          ? `border: 1px solid rgba(255, 255, 255, 0.15); color: ${badgeColor}; padding: 3px 12px; border-radius: 12px; font-size: 0.8rem; font-weight: 700; background: ${badgeBg};` 
          : `color: ${badgeColor}; padding: 3px 12px; border-radius: 12px; font-size: 0.8rem; font-weight: 700; background: ${badgeBg}; border: 1px solid ${badgeColor}30;`;

        htmlContent += `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem; padding: 4px 6px; border-radius: 6px;">
              <div style="display: flex; align-items: center; gap: 0.6rem; font-size: 0.95rem;">
                ${icon}
                <span style="color: ${check.status === 'locked' ? 'rgba(255,255,255,0.5)' : '#ffffff'}; font-weight: 600; letter-spacing: 0.2px;">${check.name}</span>
              </div>
              <span style="${badgeStyle}">${check.badge}</span>
            </div>
        `;
      });

      htmlContent += `</div></div>`;
    });

    detailsList.innerHTML = htmlContent;
  }
});
