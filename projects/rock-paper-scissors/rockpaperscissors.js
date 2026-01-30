const choices = ["rock", "paper", "scissors"];
const emojis = { rock: "✊", paper: "✋", scissors: "✌️" };
const funnyWins = [
  "You win! The computer is sad 😭",
  "VICTORY! Even the CPU is impressed! 🤯",
  "You are awesome! Good job 🎉",
  "The computer is mad and broke its keyboard! 😂",
  "You're too powerful... Watch out! ⚡",
  "The computer wants to play again… it’s upset 😤",
];
const funnyLoses = [
  "HAHAHA YOU LOST TO A BOT 🤖💀",
  "Computer wins! Try again 😎",
  "Ouch! That hurts 😂",
  "The computer is celebrating in the server room 🏎️",
  "Better luck next time! ⏳",
  "Skill problem! Try turning it off and on again 🔄",
];
const funnyTies = [
  "Tie? Are you secretly the computer? 🤔",
  "Great minds think alike... 😜",
  "It's like a mirror! ✨",
  "Our brains are the same! 💕",
  "The universe just glitched. Nice! 🌌",
];

let playerScore = 0;
let computerScore = 0;
let tieScore = 0;

function play(playerChoice) {
  const computerChoice = choices[Math.floor(Math.random() * 3)]; //Picks 0, 1 or 2 → rock, paper or scissors

  document.getElementById("js__playerChoice").textContent =
    emojis[playerChoice];
  document.getElementById("js__computerChoice").textContent =
    emojis[computerChoice];
  document.getElementById("js__vs").textContent = "💥 BATTLE 💥";

  let result = "";
  let funny = "";

  if (playerChoice === computerChoice) {
    // It's a tie
    result = "IT'S A TIE! 🤝";
    funny = funnyTies[Math.floor(Math.random() * funnyTies.length)]; //one random funny tie message
    tieScore = tieScore + 1;
    document.getElementById("js__tieScore").textContent = tieScore;
  } else if (
    (playerChoice === "rock" && computerChoice === "scissors") ||
    (playerChoice === "paper" && computerChoice === "rock") ||
    (playerChoice === "scissors" && computerChoice === "paper")
  ) {
    //You win!
    result = "🎊 YOU WIN! 🎊";
    funny = funnyWins[Math.floor(Math.random() * funnyWins.length)]; // one funny win message
    playerScore = playerScore + 1;
    document.getElementById("js__playerScore").textContent = playerScore;
  } else {
    // Computer wins
    result = "💻 COMPUTER WINS! 🎉";
    funny = funnyLoses[Math.floor(Math.random() * funnyLoses.length)]; // one funny lose message
    computerScore = computerScore + 1;
    document.getElementById("js__computerScore").textContent = computerScore;
  }

  document.getElementById("js__result").innerHTML = result;
  document.getElementById("js__funnyMessage").textContent = funny;

  // Add dramatic shake
  document.body.style.animation = "none";
  setTimeout(() => {
    document.body.style.animation = "shake 0.3s";
  }, 4); // wait 4 milliseconds then shake 0.3s
}

function reset() {
  document.getElementById("js__playerChoice").textContent = "🤜";
  document.getElementById("js__computerChoice").textContent = "🤛";
  document.getElementById("js__vs").textContent = "VS";
  document.getElementById("js__result").textContent = "Ready to lose? 😏";
  document.getElementById("js__funnyMessage").textContent = "";

  ((playerScore = 0), (computerScore = 0), (tieScore = 0));
  document.getElementById("js__playerScore").textContent = playerScore;
  document.getElementById("js__computerScore").textContent = computerScore;
  document.getElementById("js__tieScore").textContent = tieScore;
}

// Add shake animation
const style = document.createElement("style");
style.innerHTML = `
  @keyframes shake {
    0% { transform: translate(0, 0) rotate(0deg); }
    10% { transform: translate(-10px, 0) rotate(-5deg); }
    20% { transform: translate(10px, 0) rotate(5deg); }
    30% { transform: translate(-10px, 0) rotate(-5deg); }
    40% { transform: translate(10px, 0) rotate(5deg); }
    50% { transform: translate(-10px, 0) rotate(-5deg); }
    60% { transform: translate(10px, 0) rotate(5deg); }
    70% { transform: translate(-10px, 0) rotate(-5deg); }
    80% { transform: translate(10px, 0) rotate(5deg); }
    90% { transform: translate(-10px, 0) rotate(-5deg); }
    100% { transform: translate(0, 0) rotate(0deg); }
  }
`;
document.head.appendChild(style);
