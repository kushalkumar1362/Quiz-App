const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const nextButton = document.getElementById("nextbtn");

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
  choices.forEach((choice) => {
    choice.parentElement.classList.remove("correct", "incorrect");
  });
  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  console.log(currentQuestion);

  question.innerText = currentQuestion.question;

  choices.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number];
  });

  availableQuestions.splice(questionIndex, 1);
  acceptingAnswers = true;
};

// Add a variable to store user answers
let userAnswers = [];

// Update the event listener for the "Save & Next" button
nextButton.addEventListener("click", () => {
  // Save the user's answer
  const selectedChoices = document.querySelectorAll(".choice-container.selected");
  console.log("Selected choices:", selectedChoices); // Log selected choices for debugging
  if (selectedChoices.length > 0) {
    selectedChoices.forEach((selectedChoice) => {
      userAnswers.push(selectedChoice.querySelector(".choice-text").innerText);
      selectedChoice.classList.remove("selected");
    });
    console.log("User answers:", userAnswers); // Log user answers for debugging
    checkAndUpdateScore();
    getNewQuestion();
  } else {
    alert("Please select an answer before proceeding to the next question.");
  }
});

function checkAndUpdateScore() {
  const selectedChoiceTexts = userAnswers; // Get the selected choice texts
  const correctChoiceText = currentQuestion["choice" + currentQuestion.answer]; // Get the correct choice text

  console.log("Selected choice texts:", selectedChoiceTexts); // Log selected choice texts for debugging
  console.log("Correct choice text:", correctChoiceText); // Log correct choice text for debugging

  let allCorrect = true;

  // Check if all selected choices match the correct choice
  selectedChoiceTexts.forEach(selectedChoiceText => {
    if (selectedChoiceText !== correctChoiceText) {
      allCorrect = false;
    }
  });

  if (allCorrect) {
    incrementScore(correctBonus); // Increment score if all selected choices are correct
  }

  // Clear user choices array for the next question
  userAnswers = [];
}

choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    console.log("Choice clicked!");
    if (!acceptingAnswers) return;

    const selectedChoice = e.target.parentElement; // Parent element contains the choice container
    const selectedAnswer = selectedChoice.querySelector(".choice-text");
    const selectedNumber = selectedAnswer.dataset.number;

    const isSelected = selectedChoice.classList.contains("selected");
    if (isSelected) {
      // If already selected, deselect it
      selectedChoice.classList.remove("selected");
      // Remove the color class
      if (selectedChoice.classList.contains("correct")) {
        selectedChoice.classList.remove("correct");
      } else {
        selectedChoice.classList.remove("incorrect");
      }
      acceptingAnswers = true; // Allow selecting again
      return;
    }

    // Select the clicked choice
    selectedChoice.classList.add("selected");

    const isCorrect = selectedNumber == currentQuestion.answer;
    const classToApply = isCorrect ? "correct" : "incorrect";
    selectedChoice.classList.add(classToApply);

    // Check if all selected choices are correct before incrementing the score
    const allSelectedChoices = document.querySelectorAll(".choice-container.selected");
    acceptingAnswers = true;
  });
});


incrementScore = (num) => {
  console.log("Current score:", score); // Add this line for debugging
  score += num;
  console.log("New score:", score); //
};

function updateProgressBar() {
  const width = (questionCounter / maxQuestions) * 100;
  progressBarFull.style.width = width + "%";
  progressBarFull.innerHTML = width.toFixed(0) + "%";
  progressText.innerText = `Question ${questionCounter}/${maxQuestions}`;
}

startGame();
