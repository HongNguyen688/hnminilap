// Wait until the page is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Get the dice, buttons
  const dice = document.querySelector(".dice");
  const rollButton = document.getElementById("js__rollBtn");
  const resetButton = document.getElementById("js__resetBtn");

  // This function makes the dice roll to a random face
  function rollDice() {
    // Random number from 1 to 6
    const randomNumber = Math.floor(Math.random() * 6) + 1;

    // Stop any animation and reset to 0 rotation
    dice.style.transition = "none";
    dice.style.transform = "rotateX(0deg) rotateY(0deg)";

    // Force browser to apply the change immediately
    dice.offsetHeight;

    // Re-add smooth animation
    dice.style.transition = "transform 1s ease";

    // Rotate to show the correct face on top (standard dice layout)
    let rotateX = 0;
    let rotateY = 0;

    if (randomNumber === 1) {
      rotateX = 0;
      rotateY = 0;
    } else if (randomNumber === 2) {
      rotateX = -90; // top face
      rotateY = 0;
    } else if (randomNumber === 3) {
      rotateX = 0;
      rotateY = -90; // left face
    } else if (randomNumber === 4) {
      rotateX = 0;
      rotateY = 90; // right face
    } else if (randomNumber === 5) {
      rotateX = 90; // bottom face → we flip upside down
      rotateY = 0;
    } else if (randomNumber === 6) {
      rotateX = -180; // back face
      rotateY = 0;
    }

    // Add lots of spins for cool effect!
    const extraSpinsX = Math.floor(Math.random() * 4 + 2) * 360; // 2–5 full spins
    const extraSpinsY = Math.floor(Math.random() * 4 + 2) * 360;

    dice.style.transform = `rotateX(${rotateX + extraSpinsX}deg) rotateY(${rotateY + extraSpinsY}deg)`;
  }

  // Reset dice to starting position
  function resetDice() {
    dice.style.transition = "transform 1s";
    dice.style.transform = "rotateX(55deg) rotateY(45deg)"; // your original view
  }

  // Click on the dice → roll!
  dice.addEventListener("click", rollDice);

  // Click "Roll Dice" button → roll!
  rollButton.addEventListener("click", rollDice);

  // Click "Reset" button → go back
  resetButton.addEventListener("click", resetDice);

  // Optional: Press spacebar or Enter to roll (very cool!)
  document.addEventListener("keydown", function (e) {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      rollDice();
    }
    if (e.key === "r" || e.key === "R") {
      resetDice();
    }
  });
});
