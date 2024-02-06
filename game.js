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

// Fetch questions from JSON file
fetch("Questions/quizQues.json")
  .then((res) => {
    return res.json();
  })
  .then((loadedQuestion) => {
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

// Function to get a new question
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

  question.innerText = currentQuestion.question;

  choices.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number];
  });

  availableQuestions.splice(questionIndex, 1);
  acceptingAnswers = true;
};

// Event listener for the "Save" button
let saveButtonClicked = false;
saveButton.addEventListener("click", () => {
  if (!saveButtonClicked) {
    const selectedChoices = document.querySelectorAll(
      ".choice-container.selected"
    );
 
    if (selectedChoices.length > 0) {
      selectedChoices.forEach((selectedChoice) => {
        selectedChoice.classList.remove("select_choice"); 
        const selectedAnswer = selectedChoice.querySelector(".choice-text");
        const selectedNumber = selectedAnswer.dataset.number;
        const isCorrect = selectedNumber == currentQuestion.answer;
       
        const classToApply = isCorrect ? "correct" : "incorrect";
        selectedChoice.classList.add(classToApply);
        choices.forEach((choice) => {
          const number = choice.dataset["number"];
          choice.innerText = currentQuestion["choice" + number];
          if (number == currentQuestion.answer) {
            choice.parentElement.classList.add("correct");
          }
        });
      });
      saveButtonClicked = true; 
    } else {
      alert("Please select an answer before proceeding to the save question.");
    }
  } else {
    alert("You have already saved your answer for this question.");
  }
});

// Event listener for the "Next" button
nextButton.addEventListener("click", () => {
  if (!saveButtonClicked) {
    alert("Please save your answer before proceeding to the next question.");
    return; // Exit the function without proceeding
  }
  // Save the user's answer
  const selectedChoices = document.querySelectorAll(
    ".choice-container.selected"
  );
 
  if (selectedChoices.length > 0) {
    selectedChoices.forEach((selectedChoice) => {
      userAnswers.push(selectedChoice.querySelector(".choice-text").innerText);
      selectedChoice.classList.remove("selected");
    });
   
    checkAndUpdateScore();
    saveButtonClicked = false;
    getNewQuestion();
  } else {
    alert("Please select an answer before proceeding to the next question.");
  }
});

// Function to check and update the score
function checkAndUpdateScore() {
  const selectedChoiceTexts = userAnswers; // Get the selected choice texts
  const correctChoiceText = currentQuestion["choice" + currentQuestion.answer]; // Get the correct choice text

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

// Event listeners for choice selection
choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
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

// Function to increment the score
incrementScore = (num) => {
  score += num;
  scoreText.innerText = `${score} / ${maxQuestions * 10}`;
};

// Function to update progress bar
function updateProgressBar() {
  const width = (questionCounter / maxQuestions) * 100;
  progressBarFull.style.width = width + "%";
  progressBarFull.innerHTML = width.toFixed(0) + "%";
  progressText.innerText = `Question ${questionCounter}/${maxQuestions}`;
}

