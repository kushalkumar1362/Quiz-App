const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));

// Intially
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [
  {
    question: "Which of the following correctly declares an array of size 10?",
    choice1: "int array[10]",
    choice2: "int array",
    choice3: "array[10]",
    choice4: "array array[10]",
    answer: 1,
  },
  {
    question: `What will be the output of the following code?
        int arr[100];
        cout << arr[0];`,
    choice1: "0",
    choice2: "0 or Garbage Value",
    choice3: "Error",
    choice4: "Null",
    answer: 2,
  },
  {
    question:
      "What is the index number of the last element of an array with 5 elements?",
    choice1: "5",
    choice2: "4",
    choice3: "3",
    choice4: "None",
    answer: 2,
  },
  {
    question:
      "What is the formula to calculate the address of an ith element of an array?",
    choice1: "base_address + (data_type_size * index)",
    choice2: "base_address + (data_type_size * n)",
    choice3: "(data_type_size * n)",
    choice4: "base_address + (data_type_size * (index+1))",
    answer: 1,
  },
  {
    question: `If integer requires two bytes space, then what will be the size of the following 'C++' array?
      int arr[3][4];`,
    choice1: "12 bytes",
    choice2: "7 bytes",
    choice3: "14 bytes",
    choice4: "24 bytes",
    answer: 4,
  },
  {
    question: `The worst case time complexity of linear search is:`,
    choice1: "O(n)",
    choice2: "O(n logn)",
    choice3: "O(n*n)",
    choice4: "O(n log log N)",
    answer: 1,
  },
  {
    question:
      "What is the length of an array when its first index is denoted by i and last index is denoted by j?",
    choice1: "i + j",
    choice2: "j - i + 1",
    choice3: "j - i",
    choice4: "j - i - 1",
    answer: 2,
  },
  {
    question: `The worst case occur in linear search algorithm when -`,
    choice1: "Item is somewhere in the middle of the array",
    choice2: "Item is not at all in the array",
    choice3: "Item is present at first index of the array",
    choice4: "None",
    answer: 2,
  },
  {
    question: `Which of the following is the limitation of the array?`,
    choice1: "elements can be accesses from anywhere",
    choice2: "The size of the array is fixed",
    choice3: "Indexing is started from zero",
    choice4: "Memory waste if an array's elements are smaller than the size alloted to them",
    answer: 4,
  },
  {
    question: `The correct syntax for initialization of 1-D array is ___________ .`,
    choice1: "num[4] = {1,2,3,4}",
    choice2: "num[4] = 0",
    choice3: "num[4] = {1 2 3 4}",
    choice4: "num[4] = {1;2;3;4}",
    answer: 1,
  },
];

let correctBonus = 10;
let maxQuestions = 10;

startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  getNewQuestion();
};

getNewQuestion = () => {
  if (availableQuestions === 0 || questionCounter >= maxQuestions) {
    // all questions are visited go to the end of the page
    return window.location.assign("/end.html");
  }
  questionCounter++;
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
    
    const classToApply = selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";
    selectedChoice.parentElement.classList.add(classToApply);

    setTimeout(() =>{
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 1000);
  });
});

startGame();
