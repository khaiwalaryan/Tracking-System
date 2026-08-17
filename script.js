const chatWindow = document.getElementById("chatWindow");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const restartBtn = document.getElementById("restartBtn");

const questions = [
  {
    key: "fullName",
    prompt: "Welcome to Voolage College Registration Bot. 👋\nWhat is your full name?",
    placeholder: "e.g., Ananya Sharma",
    validate: (value) => {
      if (value.trim().length < 3) {
        return "Please enter a valid full name (at least 3 characters).";
      }
      return null;
    },
  },
  {
    key: "email",
    prompt: "Great. Please enter your email address:",
    placeholder: "e.g., student@example.com",
    validate: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value.trim())) {
        return "Please enter a valid email address.";
      }
      return null;
    },
  },
  {
    key: "phone",
    prompt: "Enter your phone number (10 digits):",
    placeholder: "e.g., 9876543210",
    validate: (value) => {
      const digitsOnly = value.replace(/\D/g, "");
      if (digitsOnly.length !== 10) {
        return "Phone number must have exactly 10 digits.";
      }
      return null;
    },
    normalize: (value) => value.replace(/\D/g, ""),
  },
  {
    key: "dob",
    prompt: "Enter your date of birth (YYYY-MM-DD):",
    placeholder: "e.g., 2005-07-14",
    validate: (value) => {
      const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dobRegex.test(value.trim())) {
        return "Use format YYYY-MM-DD.";
      }
      const date = new Date(value.trim());
      if (Number.isNaN(date.getTime())) {
        return "Please enter a valid date.";
      }
      const now = new Date();
      if (date >= now) {
        return "Date of birth must be in the past.";
      }
      return null;
    },
  },
  {
    key: "course",
    prompt: "Choose your course (BCA, BBA, BSc, BA, BCom):",
    placeholder: "e.g., BCA",
    validate: (value) => {
      const allowed = ["BCA", "BBA", "BSC", "BA", "BCOM"];
      if (!allowed.includes(value.trim().toUpperCase())) {
        return "Please choose one: BCA, BBA, BSc, BA, BCom.";
      }
      return null;
    },
    normalize: (value) => {
      const map = {
        BSC: "BSc",
        BCOM: "BCom",
      };
      const upper = value.trim().toUpperCase();
      return map[upper] || upper;
    },
  },
  {
    key: "year",
    prompt: "Enter your admission year (e.g., 2026):",
    placeholder: "e.g., 2026",
    validate: (value) => {
      const year = Number(value.trim());
      if (!Number.isInteger(year) || year < 2020 || year > 2035) {
        return "Admission year must be between 2020 and 2035.";
      }
      return null;
    },
  },
  {
    key: "address",
    prompt: "Finally, enter your current address:",
    placeholder: "e.g., Voolage City, District, State",
    validate: (value) => {
      if (value.trim().length < 8) {
        return "Please provide a complete address.";
      }
      return null;
    },
  },
];

let currentQuestionIndex = 0;
let registrationData = {};
let registrationComplete = false;

function addMessage(text, sender = "bot") {
  const message = document.createElement("div");
  message.className = `message ${sender}`;
  message.textContent = text;
  chatWindow.appendChild(message);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function askCurrentQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
    completeRegistration();
    return;
  }
  addMessage(currentQuestion.prompt, "bot");
  userInput.placeholder = currentQuestion.placeholder;
}

function completeRegistration() {
  registrationComplete = true;
  userInput.disabled = true;

  const summary = [
    "✅ Registration Completed Successfully!",
    "",
    `Name: ${registrationData.fullName}`,
    `Email: ${registrationData.email}`,
    `Phone: ${registrationData.phone}`,
    `DOB: ${registrationData.dob}`,
    `Course: ${registrationData.course}`,
    `Admission Year: ${registrationData.year}`,
    `Address: ${registrationData.address}`,
    "",
    "Your student registration request has been recorded for Voolage College.",
  ].join("\n");

  addMessage(summary, "bot");
}

function processAnswer(answer) {
  const currentQuestion = questions[currentQuestionIndex];
  const rawValue = answer.trim();

  const error = currentQuestion.validate(rawValue);
  if (error) {
    addMessage(error, "bot");
    return;
  }

  const finalValue = currentQuestion.normalize
    ? currentQuestion.normalize(rawValue)
    : rawValue;

  registrationData[currentQuestion.key] = finalValue;
  currentQuestionIndex += 1;
  askCurrentQuestion();
}

function resetBot() {
  chatWindow.innerHTML = "";
  currentQuestionIndex = 0;
  registrationData = {};
  registrationComplete = false;
  userInput.disabled = false;
  userInput.value = "";
  addMessage("Hello! I will help you register as a student at Voolage College.", "bot");
  askCurrentQuestion();
  userInput.focus();
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const answer = userInput.value.trim();
  if (!answer || registrationComplete) {
    return;
  }

  addMessage(answer, "user");
  userInput.value = "";
  processAnswer(answer);
});

restartBtn.addEventListener("click", resetBot);

resetBot();
