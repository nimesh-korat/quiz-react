// Selecting all required elements
const startBtn = document.querySelector(".start_btn button");
const userForm = document.querySelector(".user_form");
const cancelFormBtn = document.querySelector(".cancel_form");
const submitFormBtn = document.querySelector(".submit_form");

const infoBox = document.querySelector(".info_box");
const exitBtn = infoBox.querySelector(".buttons .quit");
const continueBtn = infoBox.querySelector(".buttons .restart");
const quizBox = document.querySelector(".quiz_box");
const resultBox = document.querySelector(".result_box");
const optionList = document.querySelector(".option_list");
const timeLine = document.querySelector("header .time_line");
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");
const nextBtn = document.querySelector("footer .next_btn");
const bottomQuesCounter = document.querySelector("footer .total_que");
const restartQuizBtn = resultBox.querySelector(".buttons .restart");
const quitQuizBtn = resultBox.querySelector(".buttons .quit");

let userAnswers = [];
let timeValue = 30;
let queCount = 0;
let queNumb = 1;
let counter;
let counterLine;
let widthValue = 0;

// User Details
let userName = "",
  userEmail = "",
  userPhone = "";

// --- Helper: get or create an error element for an input ---
function getErrorElement(inputEl, idSuffix) {
  // try to find existing error
  const id = idSuffix + "_error";
  let err = document.getElementById(id);
  if (err) return err;

  // create if not present
  err = document.createElement("small");
  err.className = "error";
  err.id = id;
  // insert right after the input element
  inputEl.insertAdjacentElement("afterend", err);
  return err;
}

function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Basic validators
function validateName(name) {
  if (!name) return "Name is required";
  if (name.length < 3) return "Name must be at least 3 characters";
  return "";
}
function validateEmail(email) {
  if (!email) return "Email is required";
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) return "Enter a valid email address";
  return "";
}
function validatePhone(phone) {
  if (!phone) return "Phone number is required";
  // allow only digits, 10 digits typical; adjust if you want country codes
  const phonePattern = /^[0-9]{10}$/;
  if (!phonePattern.test(phone)) return "Enter a valid 10-digit phone number";
  return "";
}

// Utility to show error and apply error class
function showError(inputEl, msg) {
  const err = getErrorElement(inputEl, inputEl.id || "field");
  err.textContent = msg;
  inputEl.classList.add("input-error");
}

// Utility to clear error
function clearError(inputEl) {
  const id = (inputEl.id || "field") + "_error";
  const err = document.getElementById(id);
  if (err) err.textContent = "";
  inputEl.classList.remove("input-error");
}

// Add live listeners to inputs to clear errors while typing
const nameInput = document.getElementById("user_name");
const emailInput = document.getElementById("user_email");
const phoneInput = document.getElementById("user_phone");

if (nameInput) nameInput.addEventListener("input", () => clearError(nameInput));
if (emailInput)
  emailInput.addEventListener("input", () => clearError(emailInput));
if (phoneInput)
  phoneInput.addEventListener("input", () => clearError(phoneInput));

// Start Button → open form
startBtn.onclick = () => {
  userForm.classList.add("activeForm");
};

// Cancel form
cancelFormBtn.onclick = () => {
  userForm.classList.remove("activeForm");
  // clear inputs & errors when cancelled
  if (nameInput) nameInput.value = "";
  if (emailInput) emailInput.value = "";
  if (phoneInput) phoneInput.value = "";
  if (nameInput) clearError(nameInput);
  if (emailInput) clearError(emailInput);
  if (phoneInput) clearError(phoneInput);
};

// Submit form → validate, save details → show rules
submitFormBtn.onclick = (e) => {
  e.preventDefault();

  // grab values (trim)
  userName = nameInput ? nameInput.value.trim() : "";
  userEmail = emailInput ? emailInput.value.trim() : "";
  userPhone = phoneInput ? phoneInput.value.trim() : "";

  // clear previous errors
  if (nameInput) clearError(nameInput);
  if (emailInput) clearError(emailInput);
  if (phoneInput) clearError(phoneInput);

  // validate
  let hasError = false;

  const nameErr = validateName(userName);
  if (nameErr) {
    if (nameInput) showError(nameInput, nameErr);
    hasError = true;
  }

  const emailErr = validateEmail(userEmail);
  if (emailErr) {
    if (emailInput) showError(emailInput, emailErr);
    hasError = true;
  }

  const phoneErr = validatePhone(userPhone);
  if (phoneErr) {
    if (phoneInput) showError(phoneInput, phoneErr);
    hasError = true;
  }

  if (hasError) {
    // focus the first invalid field
    if (nameErr && nameInput) nameInput.focus();
    else if (emailErr && emailInput) emailInput.focus();
    else if (phoneErr && phoneInput) phoneInput.focus();
    return; // don't proceed
  }

  // if valid, close form and show rules
  userForm.classList.remove("activeForm");
  infoBox.classList.add("activeInfo");
};

// Exit quiz
exitBtn.onclick = () => {
  infoBox.classList.remove("activeInfo");
};

// Continue to quiz
continueBtn.onclick = () => {
  infoBox.classList.remove("activeInfo");
  quizBox.classList.add("activeQuiz");

  // ✅ Shuffle questions safely before quiz starts
  questions = shuffleArray(questions);

  // ✅ Renumber shuffled questions
  questions.forEach((q, i) => (q.numb = i + 1));

  // ✅ Reset everything before starting
  resetQuiz();

  // ✅ Initialize quiz (this displays first question and starts timer)
  initializeQuiz();
};

// Restart quiz
restartQuizBtn.onclick = () => {
  resultBox.classList.remove("activeResult");
  quizBox.classList.add("activeQuiz");

  questions = shuffleArray(questions);
  questions.forEach((q, i) => (q.numb = i + 1));

  resetQuiz();
  initializeQuiz();
};

// Quit quiz
quitQuizBtn.onclick = () => window.location.reload();

// Next Question
nextBtn.onclick = () => {
  // stop existing timers
  clearInterval(counter);
  clearInterval(counterLine);

  if (queCount < questions.length - 1) {
    queCount++;
    queNumb++;
    updateQuiz();
  } else {
    // quiz end
    showResult();
  }
};

function initializeQuiz() {
  showQuestions(queCount);
  queCounter(queNumb);
  startTimer(timeValue);
  startTimerLine(widthValue);
}

function resetQuiz() {
  timeValue = 30;
  queCount = 0;
  queNumb = 1;
  widthValue = 0;
  userAnswers = [];
}

function updateQuiz() {
  // Ensure valid question exists
  if (!questions[queCount]) {
    showResult();
    return;
  }

  showQuestions(queCount);
  queCounter(queNumb);
  clearInterval(counter);
  clearInterval(counterLine);

  timeValue = 30; // ⏱ Reset timer to 30 for each question
  widthValue = 0; // Reset timeline width

  startTimer(timeValue);
  startTimerLine(widthValue);

  timeText.textContent = "Time Left";
  nextBtn.classList.remove("show");
}

// Display questions
function showQuestions(index) {
  const queText = document.querySelector(".que_text");
  const currentQuestion = questions[index];

  if (!currentQuestion) return; // prevent crashes

  // ✅ Shuffle options for this question
  const shuffledOptions = shuffleArray(currentQuestion.options);

  // ✅ Build question and options
  const queTag = `<span>${currentQuestion.numb}. ${currentQuestion.question}</span>`;
  const optionTag = shuffledOptions
    .map((opt) => `<div class="option"><span>${opt}</span></div>`)
    .join("");

  queText.innerHTML = queTag;
  optionList.innerHTML = optionTag;

  // ✅ Add click listeners for options
  optionList.querySelectorAll(".option").forEach((option) => {
    option.onclick = () => optionSelected(option);
  });
}

// Option selection
function optionSelected(answer) {
  const userAns = answer.textContent.trim();
  const currentQuestion = questions[queCount].question;
  const correctAns = questions[queCount].answer;

  optionList
    .querySelectorAll(".option")
    .forEach((opt) => opt.classList.remove("correct"));
  answer.classList.add("correct");

  const existingIndex = userAnswers.findIndex(
    (item) => item.question === currentQuestion
  );
  if (existingIndex !== -1) {
    userAnswers[existingIndex].selected = userAns;
  } else {
    userAnswers.push({
      question: currentQuestion,
      selected: userAns,
      correct: correctAns,
    });
  }

  nextBtn.classList.add("show");
}

function disableOptions() {
  for (let i = 0; i < optionList.children.length; i++) {
    optionList.children[i].classList.add("disabled");
  }
}

// Show result
function showResult() {
  quizBox.classList.remove("activeQuiz");
  resultBox.classList.add("activeResult");
  sendResultsToEmail();
  resultBox.querySelector(
    ".score_text"
  ).innerHTML = `<span>Keep it Up 🎯</span>`;
  console.table(userAnswers);
}

function startTimer(time) {
  counter = setInterval(() => {
    timeCount.textContent = time > 9 ? time : `0${time}`;
    time--;
    if (time < 0) {
      clearInterval(counter);
      clearInterval(counterLine);
      nextBtn.classList.add("show");

      // Optional: auto-move to next question after 1 seconds
      setTimeout(() => {
        if (queCount < questions.length - 1) {
          queCount++;
          queNumb++;
          updateQuiz();
        } else {
          showResult();
        }
      }, 1000);
    }
  }, 1000);
}

function startTimerLine(time) {
  counterLine = setInterval(() => {
    time += 0.5;
    timeLine.style.width = `${time}px`;
    if (time > 550) clearInterval(counterLine);
  }, 30);
}

function queCounter(index) {
  bottomQuesCounter.innerHTML = `<span><p>${index}</p> of <p>${questions.length}</p> Questions</span>`;
}

function sendResultsToEmail() {
  // Count correct answers
  let correctCount = 0;

  const answersText = userAnswers
    .map((item, i) => {
      const selected =
        item.selected && item.selected.trim() !== ""
          ? item.selected
          : "Skipped";

      // Count correct answers only if selected matches correct
      if (selected === item.correct) correctCount++;

      return `Q${i + 1}: ${item.question}\nSelected: ${selected}\nCorrect: ${
        item.correct
      }\n`;
    })
    .join("\n-----------------------------\n");

  // Prepare email parameters
  const params = {
    user_name: userName,
    user_email: userEmail,
    user_phone: userPhone,
    user_answers: `${answersText}\n\n✅ Total Correct Answers: ${correctCount} / ${userAnswers.length}`,
  };

  // Send using EmailJS
  emailjs
    .send("service_ns5jgsc", "template_1ima2tk", params)
    .then(() => {
      alert(`✅ Quiz results saved successfully!`);
    })
    .catch((error) => {
      console.error("❌ Email sending failed:", error);
    });
}
