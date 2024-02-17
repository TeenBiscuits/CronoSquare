//const UnplashAccessKey = 'Tv4pz2NLEpgwFQ0034shKC_Q_rh10nzVmIOMY-ULLhY'
// const StabilityAIKey = 'Bq7nC8nNKyTMLFwMY0eJfNKPgOPa2RHgJjVIPs3QxPmOgBHMFTfgBAwUbAne'
const gameGrid = document.getElementById('game-grid');
const nextButton = document.getElementById('random-button');
const timerDisplay = document.getElementById('timer');

let emptyTilePosition;
let originalEmptyTilePosition;
let score = 0;
let gameruning = true;

// Fetch a random square image from Unsplash
async function fetchRandomSquareImage() {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({

    //"key": StabilityAIKey,
    "key": "key",
    "prompt": "grupo de informáticos compitiendo en su universidad",
    "negative_prompt": null,
    "width": "512",
    "height": "512",
    "samples": "1",
    "num_inference_steps": "20",
    "seed": null,
    "guidance_scale": 7.5,
    "safety_checker": "yes",
    "multi_lingual": "no",
    "panorama": "no",
    "self_attention": "no",
    "upscale": "no",
    "embeddings_model": null,
    "webhook": null,
    "track_id": null
  });
  
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
    /*
    try {
      const response = await fetch("https://stablediffusionapi.com/api/v3/text2img", requestOptions);
      const data = await response.json();
      return data.output; // Return the regular-sized image URL
    } catch (error) {
      console.error('Error fetching image:', error);
    }
    */
    // IMPORTANTE QUITAR CUANTO YA VOLVAMOS A TENER ACCESO A LA API
    return imageUrl = 'https://imgs.search.brave.com/93PO8gJfSMm-l66S819Mb2jYBOi51tF6MXvBCZ_GjGY/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMubmlnaHRjYWZl/LnN0dWRpby8vYXNz/ZXRzL2FzdHJvbmF1/dC0xLmpwZWc_dHI9/dy0xNjAwLGMtYXRf/bWF4';
}

// Slice the image into parts
async function sliceImage(imageUrl) {
  // Esperar respuesta de la api
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  const image = await createImageBitmap(blob);
  
  // Cortar la imagen 
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
document.addEventListener("DOMContentLoaded", function () {
  var duracion = 10 * 60 * 1000; // 5 minutos en milisegundos
  var inicio = Date.now();
  var fin = inicio + duracion;
  var display = document.getElementById("cuentaAtras");

  var temporizador = setInterval(function () {
    var ahora = Date.now();
    var diferencia = fin - ahora;

    if (diferencia <= 0) {
      clearInterval(temporizador);
      display.textContent = "00:00:00";
      alert("¡Tiempo finalizado!");
      return;
    }

    var minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    var segundos = Math.floor((diferencia % (1000 * 60)) / 1000);
    var milisegundos = Math.floor((diferencia % 1000) / 10);

    minutos = minutos < 10 ? "0" + minutos : minutos;
    segundos = segundos < 10 ? "0" + segundos : segundos;
    milisegundos = milisegundos < 10 ? "00" + milisegundos : milisegundos < 100 ? "0" + milisegundos : milisegundos;

    display.textContent = minutos + ":" + segundos + ":" + milisegundos;
  }, 10);
});

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
    document.getElementById('random-button').addEventListener('click', initializeGame);
    

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
  if (gameruning) {
    // Check if clicked tile is adjacent to the empty tile
    if (isAdjacent(clickedPosition, emptyTilePosition)) {
      // Swap the clicked tile with the empty tile
      swapTiles(clickedTile);
      emptyTilePosition = clickedPosition;
    }

    if (isPuzzleSolved()) {
        score += 100; // Increase score by 100 when puzzle is solved
        updateScoreDisplay(); // Update the score display
        gameruning = false;
    }
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

// Update the score display
function updateScoreDisplay() {
  const scoreDisplay = document.getElementById('score-display');
  scoreDisplay.textContent = `Score: ${score}`;
}

// Initialize the game
async function initializeGame() {
  const imageUrl = await fetchRandomSquareImage();
  const imageParts = await sliceImage(imageUrl);
  createGameGrid(imageParts);
}

// Start the game
initializeGame();
