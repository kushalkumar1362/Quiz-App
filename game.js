const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");

// Intially
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

fetch("Questions/ArrayQuiz.json")
  .then((res) => {
    return res.json();
  })
  .then((loadedQuestion) => {
    console.log(loadedQuestion);
    questions = loadedQuestion;
    startGame();
  })
  .catch((err) => {
    console.error(err);
  });

let correctBonus = 10;
let maxQuestions = 10;

startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  getNewQuestion();
  updateProgressBar();
};

getNewQuestion = () => {
  if (availableQuestions === 0 || questionCounter >= maxQuestions) {
    // all questions are visited go to the end of the page
    localStorage.setItem("mostRecentScore", score);
    return window.location.assign("/end.html");
  }
  questionCounter++;
  updateProgressBar();

  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerText = currentQuestion.question;

  choices.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number];
  });

  availableQuestions.splice(questionIndex, 1);
  acceptingAnswers = true;
};

choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];

    const classToApply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";
    if (classToApply === "correct") {
      incrementScore(correctBonus);
    }

    selectedChoice.parentElement.classList.add(classToApply);

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 1000);
  });
});

incrementScore = (num) => {
  score += num;
  scoreText.innerText = `${score} / ${maxQuestions * 10}`;
};

function updateProgressBar() {
  const width = (questionCounter / maxQuestions) * 100;
  progressBarFull.style.width = width + "%";
  progressBarFull.innerHTML = width.toFixed(0) + "%";
  progressText.innerText = `Question ${questionCounter}/${maxQuestions}`;
}

startGame();
