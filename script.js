// Define the categories and their words
const wordGroups = [
  { category: "Outstanding", words: ["sterling", "excellent", "amazing", "splendid"] },
  { category: "Famous Athletes", words: ["oj", "lebron", "shaq", "kobe"] },
  { category: "Virtues", words: ["justice", "grace", "honour", "mercy"] },
  { category: "Girls names", words: ["emma", "jenna", "olivia", "evelynn"] },
];

// Flatten and shuffle the words
let words = wordGroups.flatMap(group => group.words).sort(() => Math.random() - 0.5);

// Track progress
let correctGroups = [];
let selectedWords = [];
let remainingMistakes = 4;

// Function to create the grid dynamically
function createGrid() {
  const gridContainer = document.getElementById("grid");
  gridContainer.innerHTML = ""; // Clear the grid

  words.forEach(word => {
    const wordElement = document.createElement("div");
    wordElement.className = "word";
    wordElement.textContent = word;

    if (word.length > 7) {
      wordElement.classList.add("long-word");
    }

    wordElement.addEventListener("click", () => toggleSelection(word, wordElement));
    gridContainer.appendChild(wordElement);
  });
}

// Toggle word selection
function toggleSelection(word, element) {
  if (selectedWords.includes(word)) {
    selectedWords = selectedWords.filter(w => w !== word);
    element.classList.remove("selected");
  } else if (selectedWords.length < 4) {
    selectedWords.push(word);
    element.classList.add("selected");
  }
}

// Handle submission of selected words
function submitGroup() {
  
  const match = wordGroups.find(group =>
    group.words.every(word => selectedWords.includes(word)) && !correctGroups.includes(group.category)
  );
  
  if (match) {
    correctGroups.push(match.category);
    words = words.filter(word => !selectedWords.includes(word));
    displayCorrectGroup(match, false); // Add new correct grouping below previous ones
    selectedWords = [];
    createGrid(); // Update grid with remaining words

    // Check if the game is won
    if (correctGroups.length === wordGroups.length) {
      endGame(true); // Call endGame with success flag
    }
  } else {
    const closeGroup = wordGroups.find(group =>
      group.words.filter(word => selectedWords.includes(word)).length === 3 &&
      !correctGroups.includes(group.category)
    );

    if (closeGroup) {
      handleMistake();
      showOneAwayPrompt();
    } else {
      handleMistake();
    }

    selectedWords = [];
    document.querySelectorAll(".selected").forEach(el => el.classList.remove("selected"));
  }
}

// Handle mistakes
function handleMistake() {
  remainingMistakes--;

  const bubbles = document.querySelectorAll(".mistake-bubble");
  if (bubbles[remainingMistakes]) {
    bubbles[remainingMistakes].classList.add("hidden");
  }

  if (remainingMistakes === 0) {
    endGame(false); // Call endGame with success flag as false
  }
}

// Display "Only 1 Away" prompt
function showOneAwayPrompt() {
  const prompt = document.getElementById("one-away-prompt");
  prompt.classList.add("visible");
  
  setTimeout(() => {
    prompt.classList.remove("visible");
  }, 1000);
}

// End the game
function endGame(success) {
  const gridContainer = document.getElementById("grid");
  const correctGroupContainer = document.getElementById("correct-groups");
  const messageContainer = document.getElementById("end-game-message");

  // Clear the grid and hide it
  gridContainer.innerHTML = "";
  gridContainer.style.display = "none";

  // Display end game message
  messageContainer.textContent = success ? "Amazing job my love!❤️" : "Next time my love!❤️";
  messageContainer.style.display = "block";

  // Display the remaining unguessed groups below any guessed ones
  wordGroups.forEach(group => {
    if (!correctGroups.includes(group.category)) {
      displayCorrectGroup(group, false); // Add unguessed groups at the bottom
    }
  });
}

// Display correct group in the correct-groups section
function displayCorrectGroup(match, prepend) {
  const correctGroupContainer = document.getElementById("correct-groups");

  // Ensure the correct color corresponds to its position
  const groupIndex = wordGroups.findIndex(group => group.category === match.category);
  const color = getColorForGroup(groupIndex + 1);

  const groupElement = document.createElement("div");
  groupElement.className = "correct-group";
  groupElement.style.backgroundColor = color;

  const groupName = document.createElement("div");
  groupName.textContent = match.category;
  groupName.style.fontWeight = "bold";
  groupName.style.marginBottom = "5px";
  groupElement.appendChild(groupName);

  const groupMembers = document.createElement("div");
  groupMembers.textContent = match.words.join(", ");
  groupElement.appendChild(groupMembers);

  if (prepend) {
    correctGroupContainer.prepend(groupElement); // For remaining groups at the top
  } else {
    correctGroupContainer.appendChild(groupElement); // Add new guesses below
  }
}

// Reset the game
function resetGame() {
  correctGroups = [];
  selectedWords = [];
  remainingMistakes = 4;

  document.querySelectorAll(".mistake-bubble").forEach(bubble => {
    bubble.classList.remove("hidden");
  });

  words = wordGroups.flatMap(group => group.words).sort(() => Math.random() - 0.5);
  document.getElementById("correct-groups").innerHTML = "";
  document.getElementById("end-game-message").style.display = "none";
  const gridContainer = document.getElementById("grid");
  gridContainer.style.display = "grid";
  createGrid();
}

// Shuffle grid
function shuffleGrid() {
  words = words.sort(() => Math.random() - 0.5);
  createGrid();
}

// Get a unique color for each correct group
function getColorForGroup(index) {
  const colors = ["#85e3ff", "#bffcc6", "#ffabab", "#ffc3a0"]; // Unique colors for groups
  return colors[(index - 1) % colors.length];
}

// Initialize the game
document.getElementById("submit").addEventListener("click", submitGroup);
document.getElementById("reset").addEventListener("click", resetGame);
document.getElementById("shuffle").addEventListener("click", shuffleGrid);
createGrid();
