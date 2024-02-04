const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const nextButton = document.getElementById("nextbtn");
const saveButton = document.getElementById("savebtn");

// Intially
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let correctBonus = 10;
let maxQuestions = 10;
let questions = [];
// Add a variable to store user answers
let userAnswers = [];

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
    console.error("Question is not fetched", err);
  });

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
    choice.parentElement.classList.remove(
      "correct",
      "incorrect",
      "select_choice"
    );
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

// Update the event listener for the "Save" button
let saveButtonClicked = false; // Variable to track if the save button is clicked

saveButton.addEventListener("click", () => {
  if (!saveButtonClicked) {
    const selectedChoices = document.querySelectorAll(
      ".choice-container.selected"
    );
    console.log(selectedChoices);
    if (selectedChoices.length > 0) {
      selectedChoices.forEach((selectedChoice) => {
        selectedChoice.classList.remove("select_choice"); // Remove the select_choice class
        const selectedAnswer = selectedChoice.querySelector(".choice-text");
        const selectedNumber = selectedAnswer.dataset.number;
        const isCorrect = selectedNumber == currentQuestion.answer;
        console.log(selectedNumber, currentQuestion.answer);
        const classToApply = isCorrect ? "correct" : "incorrect";
        selectedChoice.classList.add(classToApply); // Add either correct or incorrect class based on user's choice
        choices.forEach((choice) => {
          const number = choice.dataset["number"];
          choice.innerText = currentQuestion["choice" + number];
          if (number == currentQuestion.answer) {
            choice.parentElement.classList.add("correct");
          }
        });
      });
      saveButtonClicked = true; // Mark the save button as clicked for the current question
    } else {
      alert("Please select an answer before proceeding to the save question.");
    }
  } else {
    alert("You have already saved your answer for this question.");
  }
});

// Update the event listener for the "Next" button
nextButton.addEventListener("click", () => {
  if (!saveButtonClicked) {
    alert("Please save your answer before proceeding to the next question.");
    return; // Exit the function without proceeding
  }
  // Save the user's answer
  const selectedChoices = document.querySelectorAll(
    ".choice-container.selected"
  );
  console.log("Selected choices:", selectedChoices); // Log selected choices for debugging
  if (selectedChoices.length > 0) {
    selectedChoices.forEach((selectedChoice) => {
      userAnswers.push(selectedChoice.querySelector(".choice-text").innerText);
      selectedChoice.classList.remove("selected");
    });
    console.log("User answers:", userAnswers); // Log user answers for debugging
    checkAndUpdateScore();
    saveButtonClicked = false;
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
  selectedChoiceTexts.forEach((selectedChoiceText) => {
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
      selectedChoice.classList.remove("select_choice");
      return;
    }

    // Select the clicked choice
    selectedChoice.classList.add("selected");
    selectedChoice.classList.add("select_choice");

    const allSelectedChoices = document.querySelectorAll(
      ".choice-container.selected"
    );
    acceptingAnswers = true;
  });
});

incrementScore = (num) => {
  console.log("Current score:", score); // Add this line for debugging
  score += num;
  scoreText.innerText = `${score} / ${maxQuestions * 10}`;
  console.log("New score:", score); //
};

function updateProgressBar() {
  const width = (questionCounter / maxQuestions) * 100;
  progressBarFull.style.width = width + "%";
  progressBarFull.innerHTML = width.toFixed(0) + "%";
  progressText.innerText = `Question ${questionCounter}/${maxQuestions}`;
}

startGame();
