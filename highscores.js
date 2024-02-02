const highScoresList = document.getElementById("highScoresList");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

highScoresList.innerHTML = highScores
  .map((score, index) => {
    // Add 1 to index to start rank from 1 instead of 0
    const rank = index + 1;
    return `<li class="high-score"> ${rank}. ${score.name} - ${score.score}</li>`;
  })
  .join("");
