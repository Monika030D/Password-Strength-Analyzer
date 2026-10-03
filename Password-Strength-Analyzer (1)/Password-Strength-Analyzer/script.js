const passwordInput = document.getElementById("password");
const toggleBtn = document.getElementById("toggleBtn");
const meterFill = document.getElementById("meterFill");
const strengthText = document.getElementById("strengthText");
const score = document.getElementById("score");
const scoreCircle = document.getElementById("scoreCircle");
const statusTitle = document.getElementById("statusTitle");
const statusText = document.getElementById("statusText");
const suggestions = document.getElementById("suggestions");
const generateBtn = document.getElementById("generateBtn");

const checks = {
  length: document.getElementById("lengthCheck"),
  upper: document.getElementById("upperCheck"),
  lower: document.getElementById("lowerCheck"),
  number: document.getElementById("numberCheck"),
  special: document.getElementById("specialCheck"),
  common: document.getElementById("commonCheck")
};

const commonPasswords = [
  "password", "password123", "123456", "12345678", "123456789",
  "qwerty", "qwerty123", "admin", "welcome", "letmein",
  "iloveyou", "abc123", "monika", "admin123"
];

function hasCommonPattern(password) {
  const p = password.toLowerCase();

  if (commonPasswords.some(x => p === x)) return true;
  if (/^(.)\1+$/.test(password) && password.length > 2) return true;
  if (/12345|23456|34567|45678|56789/.test(p)) return true;
  if (/qwerty|asdfgh|zxcvbn/.test(p)) return true;

  return false;
}

function updateCheck(element, passed) {
  element.classList.toggle("good", passed);
  element.querySelector("span").textContent = passed ? "✓" : "○";
}

function analyzePassword(password) {
  const lengthOK = password.length >= 12;
  const upperOK = /[A-Z]/.test(password);
  const lowerOK = /[a-z]/.test(password);
  const numberOK = /\d/.test(password);
  const specialOK = /[^A-Za-z0-9]/.test(password);
  const commonOK = password.length > 0 && !hasCommonPattern(password);

  updateCheck(checks.length, lengthOK);
  updateCheck(checks.upper, upperOK);
  updateCheck(checks.lower, lowerOK);
  updateCheck(checks.number, numberOK);
  updateCheck(checks.special, specialOK);
  updateCheck(checks.common, commonOK);

  if (!password) {
    setResult(0, "No password", "Start typing to analyze your password.");
    setSuggestions([
      "Use a long, unique passphrase.",
      "Avoid names, birthdays, and predictable patterns.",
      "Never reuse an important password across sites."
    ]);
    return;
  }

  let points = 0;

  // Length score
  if (password.length >= 8) points += 10;
  if (password.length >= 12) points += 15;
  if (password.length >= 16) points += 10;
  if (password.length >= 20) points += 5;

  // Character variety
  if (lowerOK) points += 10;
  if (upperOK) points += 10;
  if (numberOK) points += 10;
  if (specialOK) points += 15;

  // Uniqueness / pattern checks
  if (commonOK) points += 10;
  else points -= 20;

  // Penalize excessive repetition
  const uniqueRatio = new Set(password).size / password.length;
  if (password.length >= 8 && uniqueRatio > 0.55) points += 5;

  // Penalize obvious sequences
  if (/(.)\1{2,}/.test(password)) points -= 10;

  points = Math.max(0, Math.min(100, points));

  let label;
  let title;
  let message;

  if (points < 35) {
    label = "Weak";
    title = "Needs improvement";
    message = "This password has several weaknesses. Make it longer and more varied.";
  } else if (points < 70) {
    label = "Medium";
    title = "Getting better";
    message = "Good start, but adding length and uniqueness can improve security.";
  } else if (points < 90) {
    label = "Strong";
    title = "Strong password";
    message = "This password meets most of the recommended checks.";
  } else {
    label = "Very Strong";
    title = "Excellent";
    message = "This password scores highly against the checks used by this demo.";
  }

  setResult(points, label, message, title);

  const tips = [];
  if (!lengthOK) tips.push("Increase the password to at least 12 characters.");
  if (!upperOK) tips.push("Add at least one uppercase letter.");
  if (!lowerOK) tips.push("Add lowercase letters.");
  if (!numberOK) tips.push("Add at least one number.");
  if (!specialOK) tips.push("Add a special character such as !, @, #, or %.");
  if (!commonOK) tips.push("Avoid common passwords and predictable patterns.");
  if (tips.length === 0) tips.push("Keep it unique and do not reuse it on other websites.");

  setSuggestions(tips);
}

function setResult(points, label, message, title = null) {
  score.textContent = points;
  strengthText.textContent = label;
  meterFill.style.width = points + "%";

  statusTitle.textContent = title || (points === 0 ? "Start typing" : label);
  statusText.textContent = message;

  // The meter uses only class/state through width; no password data leaves this page.
  scoreCircle.setAttribute("aria-label", `Password score ${points} out of 100`);
}

function setSuggestions(items) {
  suggestions.innerHTML = "";
  items.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    suggestions.appendChild(li);
  });
}

toggleBtn.addEventListener("click", () => {
  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";
  toggleBtn.textContent = isPassword ? "🙈" : "👁️";
  toggleBtn.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
});

passwordInput.addEventListener("input", () => {
  analyzePassword(passwordInput.value);
});

function secureRandomIndex(max) {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
}

function generatePassword(length = 18) {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnopqrstuvwxyz";
  const numbers = "23456789";
  const symbols = "!@#$%^&*_-+=?";
  const all = upper + lower + numbers + symbols;

  // Guarantee variety.
  let result = [
    upper[secureRandomIndex(upper.length)],
    lower[secureRandomIndex(lower.length)],
    numbers[secureRandomIndex(numbers.length)],
    symbols[secureRandomIndex(symbols.length)]
  ];

  while (result.length < length) {
    result.push(all[secureRandomIndex(all.length)]);
  }

  // Fisher-Yates shuffle using Web Crypto randomness.
  for (let i = result.length - 1; i > 0; i--) {
    const j = secureRandomIndex(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result.join("");
}

generateBtn.addEventListener("click", () => {
  const generated = generatePassword();
  passwordInput.value = generated;
  passwordInput.type = "text";
  toggleBtn.textContent = "🙈";
  analyzePassword(generated);
});

analyzePassword("");
