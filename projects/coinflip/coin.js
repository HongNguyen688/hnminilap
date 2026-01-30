function flipCoin() {
  const coin = document.getElementById("coin");
  const resultText = document.getElementById("result");

  // Random heads or tails
  const heads = Math.random() < 0.5;

  // Start spinning
  coin.classList.add("spinning");

  // After spinning, show the correct side
  setTimeout(() => {
    coin.classList.remove("spinning");

    // Show background image
    if (heads) {
      coin.style.backgroundImage = "url('/static/images/coin-head.png')";
      resultText.textContent = "It's Heads!";
    } else {
      coin.style.backgroundImage = "url('/static/images/coin-tail.png')";
      resultText.textContent = "It's Tails!";
    }
  }, 1500);
}
