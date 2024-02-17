// const accessKey = 'Tv4pz2NLEpgwFQ0034shKC_Q_rh10nzVmIOMY-ULLhY';
const gameGrid = document.getElementById('game-grid');
const nextButton = document.getElementById('next-btn');
const timerDisplay = document.getElementById('timer');

let emptyTilePosition;
let originalEmptyTilePosition;

// Fetch a random square image from Unsplash
async function fetchRandomSquareImage() {
  try {
    const response = await fetch(`https://api.unsplash.com/photos/random?client_id=${UnplashAccessKey}&query=square`);
    const data = await response.json();
    return data.urls.regular; // Return the regular-sized image URL
  } catch (error) {
    console.error('Error fetching image:', error);
  }
}

// Slice the image into parts
async function sliceImage(imageUrl) {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  const image = await createImageBitmap(blob);
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);

  const imageParts = [];
  const partWidth = canvas.width / 4;
  const partHeight = canvas.height / 4;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const partCanvas = document.createElement('canvas');
      partCanvas.width = partWidth;
      partCanvas.height = partHeight;
      const partCtx = partCanvas.getContext('2d');
      partCtx.drawImage(canvas, -col * partWidth, -row * partHeight);
      const partUrl = partCanvas.toDataURL();
      imageParts.push({url: partUrl, id: row * 4 + col + 1}); // Assign a unique ID to each tile
    }
  }

  return imageParts;
}

// FUNCIONES PARA EL TIEMPO

// Start the timer
function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);
  updateTimer(); // Added this line to update the timer immediately after starting
}

// Update the timer display
function updateTimer() {
  const currentTime = Date.now();
  const elapsedTime = Math.floor((currentTime - startTime) / 1000);
  const remainingTime = 900 - elapsedTime; // 15 minutes = 15 * 60 = 900 seconds
  if (remainingTime <= 0) {
    timerDisplay.textContent = '00:00';
    stopTimer();
    // Optionally, you can add code here to handle when time runs out
  } else {
    timerDisplay.textContent = formatTime(remainingTime);
  }
}

// Format time in mm:ss
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// Stop the timer
function stopTimer() {
  clearInterval(timerInterval);
}

// FUNCIONES PARA LA GENERACIÓN DE LA CUADRÍCULA 4X4

// Create the Fifteen Puzzle game grid
function createGameGrid(imageParts) {
  gameGrid.innerHTML = ''; // Clear previous game grid

  // Shuffle image parts
  const shuffledParts = shuffle(imageParts);

  // Assign a unique ID to each tile and position the empty tile
  const emptyTileId = 16; // Largest ID
  let emptyTileIndex;

  shuffledParts.forEach((part, index) => {
    const puzzlePiece = document.createElement('div');
    puzzlePiece.classList.add('pieza');
    puzzlePiece.dataset.position = index;
    puzzlePiece.dataset.id = part.id;
    puzzlePiece.style.backgroundImage = `url('${part.url}')`;
    puzzlePiece.textContent = part.id; // Tile number

    if (part.id === emptyTileId) {
      // This tile is the empty tile
      emptyTileIndex = index;
    }
	
	
    puzzlePiece.addEventListener('click', tileClickHandler);
    

    gameGrid.appendChild(puzzlePiece);
  });

  // Set the position of the empty tile
  originalEmptyTilePosition = emptyTileIndex;
  emptyTilePosition = emptyTileIndex;

  // Hide the 16th tile background image
  const emptyTile = gameGrid.querySelector('.pieza[data-id="16"]');
  emptyTile.style.backgroundImage = 'none';
}

// Event listener for tile click
function tileClickHandler(event) {
  const clickedTile = event.target;
  const clickedPosition = parseInt(clickedTile.dataset.position);

  // Check if clicked tile is adjacent to the empty tile
  if (isAdjacent(clickedPosition, emptyTilePosition)) {
    // Swap the clicked tile with the empty tile
    swapTiles(clickedTile);
    emptyTilePosition = clickedPosition;
  }

  if (isPuzzleSolved()) {
      const nb = document.getElementById("next-btn");
      nb.disabled = false;
  }
}

// Swap two tiles
function swapTiles(clickedTile) {
  // Find the empty tile
  const emptyTile = gameGrid.querySelector('.pieza[data-position="' + emptyTilePosition + '"]');
  
  // Swap their positions - Breaks position integrity
  /*
  const tempPosition = clickedTile.dataset.position;
  clickedTile.dataset.position = emptyTile.dataset.position;
  emptyTile.dataset.position = tempPosition;
  */

  // Swap their background images
  const tempBackground = clickedTile.style.backgroundImage;
  clickedTile.style.backgroundImage = emptyTile.style.backgroundImage;
  emptyTile.style.backgroundImage = tempBackground;

  // Swap their IDs
  const tempId = clickedTile.dataset.id;
  clickedTile.dataset.id = emptyTile.dataset.id;
  emptyTile.dataset.id = tempId;

  // Swap their numbers
  const tempNumber = clickedTile.textContent;
  clickedTile.textContent = emptyTile.textContent;
  emptyTile.textContent = tempNumber;
}

// Fisher-Yates shuffle algorithm
function shuffle(array) {
  let currentIndex = array.length;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  
  return array;
}

// Check if two positions are adjacent
function isAdjacent(position1, position2) {
  const row1 = Math.floor(position1 / 4);
  const col1 = position1 % 4;
  const row2 = Math.floor(position2 / 4);
  const col2 = position2 % 4;
  const rowDiff = Math.abs(row1 - row2);
  const colDiff = Math.abs(col1 - col2);
  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

// Check if the puzzle is solved
function isPuzzleSolved() {
  const puzzlePieces = gameGrid.querySelectorAll('.pieza');
  for (let i = 0; i < puzzlePieces.length; i++) {
    const currentPosition = parseInt(puzzlePieces[i].dataset.position);
    const correctPosition = parseInt(puzzlePieces[i].dataset.id) - 1; // correct position is based on tile id
    if (currentPosition !== correctPosition) {
      return false;
    }
  }
  return true;
}

// Initialize the game
async function initializeGame() {
  const imageUrl = await fetchRandomSquareImage();
  const imageParts = await sliceImage(imageUrl);
  createGameGrid(imageParts);
}

// Start the game
initializeGame();