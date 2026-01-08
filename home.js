document.addEventListener("DOMContentLoaded", () => {
  const sticky = document.getElementById("sticky-title");
  const welcome = document.getElementById("welcome");
  const dashboard = document.getElementById("dashboard");
  const hamburger = document.getElementById("hamburger");
  const dropdown = document.getElementById("dropdown-menu");
  const chatbotContainer = document.getElementById("chatbot-container");
  const chatbotBox = document.getElementById("chatbot-box");
  const chatbotToggle = document.getElementById("chatbot-toggle");
  const chatInput = document.getElementById("chat-input");
  const chatMessages = document.getElementById("chatbot-messages");

  const welcomeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        sticky.classList.remove("hide");
        sticky.style.transform = "translateY(0)";
      } else {
        sticky.classList.add("hide");
        sticky.style.transform = "translateY(-100%)";
      }
    });
  }, { threshold: 0.1 });
  
  if (welcome) welcomeObserver.observe(welcome);
  
  // When dashboard comes into view, hide the sticky
  const dashboardObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        sticky.classList.add("hide");
        sticky.style.transform = "translateY(-100%)";
      }
    });
  }, {
    threshold: 0.5
  });
  
  if (dashboard) dashboardObserver.observe(dashboard);
  


  // === Scroll hide welcome ===
  // === Scroll-based UI logic ===
window.addEventListener("scroll", () => {
  const welcomeGone = window.scrollY > 50;
  const dashboardTop = dashboard.getBoundingClientRect().top;

  // Handle welcome overlay
  if (welcomeGone) {
    welcome.style.opacity = "0";
    welcome.style.pointerEvents = "none";
    chatbotContainer?.classList.add("hidden");
  } else {
    welcome.style.opacity = "1";
    welcome.style.pointerEvents = "auto";
    chatbotContainer?.classList.remove("hidden");
    dropdown.style.display = "none";
  }

  // Handle sticky header appearance/disappearance
  if (welcomeGone) {
    if (dashboardTop <= -500) {
      // When dashboard reaches top
      sticky.classList.add("hide");
      sticky.style.transform = "translateY(-100%)";
    } else {
      sticky.classList.remove("hide");
      sticky.style.transform = "translateY(0)";
    }
  } else {
    sticky.classList.add("hide");
    sticky.style.transform = "translateY(-100%)";
  }
});


  // === Hamburger Menu Toggle ===
  hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
  });

  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target) && !hamburger.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });

  // === Chatbot Logic ===
  if (chatbotToggle && chatbotBox && chatInput && chatMessages) {
    chatbotToggle.addEventListener("click", () => {
      chatbotBox.style.display = chatbotBox.style.display === "flex" ? "none" : "flex";
    });

    chatInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter" && chatInput.value.trim() !== "") {
        const userMsg = chatInput.value.trim();
        appendMessage(userMsg, "user");
        respondToMessage(userMsg);
        chatInput.value = "";
      }
    });

    function appendMessage(msg, type) {
      const div = document.createElement("div");
      div.classList.add(`${type}-message`);
      div.textContent = msg;
      chatMessages.appendChild(div);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function respondToMessage(input) {
      const response = getBotResponse(input);
      setTimeout(() => {
        appendMessage(response, "bot");
      }, 500);
    }

    function getBotResponse(input) {
      const txt = input.toLowerCase();
      if (txt.includes("donate")) return "You can donate every 3 months if you’re eligible!";
      if (txt.includes("blood")) return "We help connect donors and recipients in real-time.";
      if (txt.includes("hi") || txt.includes("hello")) return "Hi! How can I assist you today?";
      return "Sorry, I’m still learning. Please ask about blood donation.";
    }
  }

  // === Blood Compatibility Section ===
  const bloodCompatibility = {
    'A+': { receive: 'A+, A-, O+, O-', donate: 'A+, AB+' },
    'O+': { receive: 'O+, O-', donate: 'O+, A+, B+, AB+' },
    'B+': { receive: 'B+, B-, O+, O-', donate: 'B+, AB+' },
    'AB+': { receive: 'Everyone', donate: 'AB+' },
    'A-': { receive: 'A-, O-', donate: 'A+, A-, AB+, AB-' },
    'O-': { receive: 'O-', donate: 'Everyone' },
    'B-': { receive: 'B-, O-', donate: 'B+, B-, AB+, AB-' },
    'AB-': { receive: 'A-, B-, O-, AB-', donate: 'AB+, AB-' },
  };

  window.updateBloodInfo = function (type) {
    const receiveEl = document.getElementById("receive-types");
    const donateEl = document.getElementById("donate-types");
    const receiveBox = document.querySelector(".receive-box");
    const donateBox = document.querySelector(".donate-box");
    const buttons = document.querySelectorAll(".blood-btn");

    buttons.forEach(btn => btn.classList.remove("active"));
    const activeBtn = [...buttons].find(btn => btn.textContent === type);
    if (activeBtn) activeBtn.classList.add("active");

    receiveEl.innerHTML = `
      <svg class="heartbeat-svg" viewBox="0 0 500 100" preserveAspectRatio="none">
        <path d="M0,50 L100,50 L120,20 L140,80 L160,50 
                 L250,50 L270,40 L290,60 L310,50 
                 L400,50 L420,30 L440,70 L460,50 
                 L500,50" />
      </svg>
      <span class="blood-text">${bloodCompatibility[type].receive}</span>
    `;

    donateEl.innerHTML = `
      <svg class="heartbeat-svg" viewBox="0 0 500 100" preserveAspectRatio="none">
        <path d="M0,50 L100,50 L120,20 L140,80 L160,50 
                 L250,50 L270,40 L290,60 L310,50 
                 L400,50 L420,30 L440,70 L460,50 
                 L500,50" />
      </svg>
      <span class="blood-text">${bloodCompatibility[type].donate}</span>
    `;

    receiveBox.classList.remove("animate");
    donateBox.classList.remove("animate");
    void receiveBox.offsetWidth;
    void donateBox.offsetWidth;
    receiveBox.classList.add("animate");
    donateBox.classList.add("animate");
  };

  // === Eligibility Quiz Logic ===
  const questions = [
    {
      question: "Are you above 18 years of age?",
      options: ["Yes", "No", "I'm 17", "Not Sure"],
      correctIndex: 0,
      advice: "You must be at least 18 years old to donate blood."
    },
    {
      question: "Do you weigh more than 50 kg?",
      options: ["Yes", "No", "Not Sure", "Prefer not to say"],
      correctIndex: 0,
      advice: "You must weigh at least 50 kg to safely donate blood."
    },
    {
      question: "Have you donated blood in the last 3 months?",
      options: ["No", "Yes", "Can't remember", "I donated yesterday"],
      correctIndex: 0,
      advice: "There must be a 3-month gap between blood donations."
    },
    {
      question: "Are you currently feeling healthy and well?",
      options: ["Yes", "No", "I have a cold", "Feverish"],
      correctIndex: 0,
      advice: "You should be in good health before donating blood."
    }
  ];

});


const quizData = [
  {
    question: "Are you above 18 years of age?",
    options: ["Yes", "No", "I'm 17", "Not Sure"],
    correctIndex: 0,
    reason: "You must be at least 18 years old to donate blood."
  },
  {
    question: "Do you weigh more than 50 kg?",
    options: ["Yes", "No", "Not Sure", "Prefer not to say"],
    correctIndex: 0,
    reason: "You must weigh at least 50 kg to safely donate blood."
  },
  {
    question: "Have you donated blood in the last 3 months?",
    options: ["No", "Yes", "Can't remember", "I donated yesterday"],
    correctIndex: 0,
    reason: "There must be a 3-month gap between donations."
  },
  {
    question: "Are you currently healthy and feeling well?",
    options: ["Yes", "No", "I have a cold", "Feverish"],
    correctIndex: 0,
    reason: "You should be in good health before donating."
  }
];

let currentQuestion = 0;
let passed = true;
let failedReasons = [];

const container = document.getElementById("question-container");
const resultBox = document.getElementById("quiz-result");

function showQuestion(index) {
  const q = quizData[index];
  container.innerHTML = `
    <div class="question animate">
      <p>${q.question}</p>
      ${q.options.map((opt, i) => `
        <div class="option" onclick="selectOption(${i})">${opt}</div>
      `).join('')}
    </div>
  `;
}

window.selectOption = function (selectedIndex) {
  const q = quizData[currentQuestion];
  if (selectedIndex !== q.correctIndex) {
    passed = false;
    failedReasons.push(q.reason);
  }
  currentQuestion++;
  if (currentQuestion < quizData.length) {
    showQuestion(currentQuestion);
  } else {
    showResult();
  }
}

function showResult() {
  container.innerHTML = '';
  if (passed) {
    resultBox.innerHTML = "✅ You are eligible to donate blood.";
    resultBox.style.color = '#00ff99';
  } else {
    resultBox.innerHTML = `❌ You are not eligible.<br><br><strong>Reasons:</strong><br>${failedReasons.map(r => `• ${r}`).join('<br>')}`;
    resultBox.style.color = '#ff4d4d';
  }
}

// Start quiz
showQuestion(0);
