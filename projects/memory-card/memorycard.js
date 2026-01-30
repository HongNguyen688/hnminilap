(function () {
  const board = document.getElementById("js__board");
  const movesText = document.getElementById("js__moves");
  const matchesText = document.getElementById("js__matches");
  const resetBtn = document.getElementById("js__resetBtn");
  const winMessage = document.getElementById("js__winMessage");

  const emojis = ["🐱", "🐶", "🐭", "🦊", "🦆", "🐼", "🦋", "🐯"];
  let cards = [];
  let flippedCards = [];
  let moves = 0;
  let matches = 0;
  let gameActive = true;

  function startGame() {
    // Create pairs of emojis
    cards = [...emojis, ...emojis];
    shuffle(cards);

    //Reset game state
    board.innerHTML = "";
    flippedCards = [];
    moves = 0;
    matches = 0;
    gameActive = true;

    winMessage.classList.add("hidden");
    updateScore();
    createCards();
  }

  // Shuffle Cards
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
  }

  // create card elements
  function createCards() {
    cards.forEach((emoji, index) => {
      const card = document.createElement("div");
      card.className = "card";

      //Store emoji in data
      card.dataset.emoji = emoji;

      //Emoji is hidden by CSS
      card.textContent = emoji;

      // Click to flip
      card.addEventListener("click", () => flipCards(index));
      board.appendChild(card);
    });
  }

  // Flip a card
  function flipCards(index) {
    const card = board.children[index];

    // Stop invalid clicks
    if (
      !gameActive || // game paused
      flippedCards.length === 2 || // already 2 cards open
      card.classList.contains("flipped") ||
      card.classList.contains("matched")
    ) {
      return;
    }

    // Flip the card
    card.classList.add("flipped");
    flippedCards.push(index);

    // If two cards are flipped
    if (flippedCards.length === 2) {
      moves++;
      updateScore();
      gameActive = false;
      setTimeout(checkMatch, 1000);
    }
  }

  // Check match
  function checkMatch() {
    const firstIndex = flippedCards[0];
    const secondIndex = flippedCards[1];

    const firstCard = board.children[firstIndex];
    const secondCard = board.children[secondIndex];

    // If emojis are the same
    if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
      firstCard.classList.add("matched");
      secondCard.classList.add("matched");
      matches++;

      // Win condition
      if (matches === emojis.length) {
        winMessage.classList.remove("hidden");
      }
    } else {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
    }

    //Reset turn
    flippedCards = [];
    gameActive = true;
    updateScore();
  }

  function updateScore() {
    movesText.textContent = moves;
    matchesText.textContent = matches;
  }

  resetBtn.addEventListener("click", startGame);

  // Start game
  startGame();
})();
