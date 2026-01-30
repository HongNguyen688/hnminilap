const quotes = [
  "The only way to do great work is to love what you do. — Steve Jobs",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. — Winston Churchill",
  "Believe you can and you're halfway there. — Theodore Roosevelt",
  "Don't watch the clock; do what it does. Keep going. — Sam Levenson",
  "Everything you've ever wanted is on the other side of fear. — George Addair",
  "The future belongs to those who believe in the beauty of their dreams. — Eleanor Roosevelt",
  "You are never too old to set another goal or to dream a new dream. — C.S. Lewis",
  "It does not matter how slowly you go as long as you do not stop. — Confucius",
  "The only limit to our realization of tomorrow will be our doubts of today. — Franklin D. Roosevelt",
  "Start where you are. Use what you have. Do what you can. — Arthur Ashe",
  "Your time is limited, don't waste it living someone else's life. — Steve Jobs",
  "Act as if what you do makes a difference. It does. — William James",
  "The best time to plant a tree was 20 years ago. The second best time is now. — Chinese Proverb",
  "What you get by achieving your goals is not as important as what you become by achieving your goals. — Zig Ziglar",
  "I never dreamed about success. I worked for it. — Estée Lauder",
  "Do what you can, with what you have, where you are. — Theodore Roosevelt",
  "Keep your face always toward the sunshine—and shadows will fall behind you. — Walt Whitman",
  "The secret of getting ahead is getting started. — Mark Twain",
  "You miss 100% of the shots you don’t take. — Wayne Gretzky",
  "Whether you think you can or you think you can’t, you’re right. — Henry Ford",
  "God’s timing is always perfect, even when we don’t understand the delay.",
  "Even the smallest light can break the deepest darkness.",
  "Love is the language everyone understands.",
  "The only way to do great work is to love what you do. — Steve Jobs",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. — Winston Churchill",
  "Dream big. Start small. Act now. — Robin Sharma",
  "What we think, we become. — Buddha",
  "I have not failed. I’ve just found 10,000 ways that won’t work. — Thomas Edison",
  "He who has a why to live can bear almost any how. — Friedrich Nietzsche",
  "The man who moves a mountain begins by carrying away small stones. — Confucius",
  "In the middle of difficulty lies opportunity. — Albert Einstein",
  "Go confidently in the direction of your dreams. — Henry David Thoreau",
  "Well done is better than well said. — Benjamin Franklin",
  "Action is the foundational key to all success. — Pablo Picasso",
  "If opportunity doesn’t knock, build a door. — Milton Berle",
  "Knowing is not enough; we must apply. Willing is not enough; we must do. — Johann Wolfgang von Goethe",
  "Do one thing every day that scares you. — Eleanor Roosevelt",
  "If you want to lift yourself up, lift up someone else. — Booker T. Washington",
  "The journey of a thousand miles begins with one step. — Lao Tzu",
  "Success usually comes to those who are too busy to be looking for it.” — Henry David Thoreau",
  "The harder I work, the luckier I get. — Samuel Goldwyn",
];

// Get HTML elements
const quoteEl = document.getElementById("js__quote");
const authorEl = document.getElementById("js__author");

const newBtn = document.getElementById("js__newQuote");
const copyBtn = document.getElementById("js__copyQuote");
const shareBtn = document.getElementById("js__shareQuote");

// Show a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);

  // Split quote text and author
  const parts = quotes[randomIndex].split(" — ");
  const text = parts[0];
  const author = parts[1];

  quoteEl.textContent = `“${text}”`;
  authorEl.textContent = `—  ${author || "Unknown"}`;
}

// New quote button
newBtn.onclick = showRandomQuote;

// Copy button
copyBtn.onclick = () => {
  // Copy quote + author to clipboard
  navigator.clipboard.writeText(
    `${quoteEl.textContent} ${authorEl.textContent}`,
  );

  copyBtn.textContent = "Copied!";
  setTimeout(() => {
    copyBtn.textContent = "Copy";
  }, 2000);
};

// Share to X (Twitter)
shareBtn.onclick = () => {
  const text = encodeURIComponent(
    `${quoteEl.textContent} ${authorEl.textContent}`,
  );

  window.open(`https://x.com/intent/tweet?text=${text}`, "_blank");
};

// Show first quote when page loads
showRandomQuote();
