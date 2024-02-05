const highScoresList = document.getElementById("highScoresList");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

// Populate the high scores list with the top 5 players
highScoresList.innerHTML = highScores
  .map((score, index) => {
    // Add 1 to index to start rank from 1 instead of 0
    const rank = index + 1;
    // Create list item for each high score
    return `<li class="high-score"> ${rank}. ${score.name} - ${score.score}</li>`;
  })
  .join(""); // Convert the array to a string and set as innerHTML
