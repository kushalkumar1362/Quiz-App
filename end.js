const username = document.getElementById("username");
const saveScoreBtn = document.getElementById("saveScoreBtn");
const finalScore = document.getElementById("finalScore");
const mostRecentScore = localStorage.getItem("mostRecentScore");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
const MAX_HIGH_SCORES = 5;

finalScore.innerText = ` ${"Your Score : "} ${mostRecentScore}`;

username.addEventListener('input', () => {
  if (username.value.trim() !== "") {
    username.style.border = "1px solid green";
    name_error.style.display = "none";
  }
});

saveHighScore = (e) => {
  e.preventDefault();
  if (username.value.trim() === "") {
    username.style.border = "1px solid red";
    name_error.style.display = "block";
    username.focus();
  } 
  else {
    username.style.border = "1px solid green";
    name_error.style.display = "none";
    const score = {
      score: mostRecentScore,
      name: username.value,
    };
    highScores.push(score);
    highScores.sort((a, b) => b.score - a.score);
    highScores.splice(5);

    localStorage.setItem("highScores", JSON.stringify(highScores));
    window.location.assign("/");
    return true;
  }
};
