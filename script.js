/*
SPDX-FileCopyrightText: 2024 Pablo Portas López <81629707+TeenBiscuits@users.noreply.github.com>

SPDX-License-Identifier: Apache-2.0
*/

// Se establecen las constantes iniciales, ambas keys de API para la generación de imágenes (ambas comentadas), la cuadrícula de juego, el botón de aleatorio (declarado como next),
// la pantalla del temporizador, el botón de imagen y el botón de la activación de ésta.
// Han sido eliminadas por seguridad
// const UnplashAccessKey = '***'
// const StabilityAIKey = '***'
const gameGrid = document.getElementById('game-grid');
const nextButton = document.getElementById('random-button');
const timerDisplay = document.getElementById('timer');
const imageButon = document.getElementById('show-image');
const imageTogle = document.getElementById('imagenDeLaEsquina');

let emptyTilePosition; // Declaramos la posición de la ranura vacía.
let originalEmptyTilePosition; // Establecemos la posición INICIAL de la ranura vacía tras la generación del mapa.
let score = 0; // Inicializamos el puntaje a cero.
let gameruning = true; // El juego está funcionando desde el inicio por defecto.
let moves = 0; // Inicializamos el número de movimientos hechos por el jugador a cero.
/*
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
  
  
  try {
    const response = await fetch("https://stablediffusionapi.com/api/v3/text2img", requestOptions);
    const data = await response.json();
    return data.output; // Return the regular-sized image URL
  } catch (error) {
    console.error('Error fetching image:', error);
  }
  return imageUrl = 'https://imgs.search.brave.com/93PO8gJfSMm-l66S819Mb2jYBOi51tF6MXvBCZ_GjGY/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMubmlnaHRjYWZl/LnN0dWRpby8vYXNz/ZXRzL2FzdHJvbmF1/dC0xLmpwZWc_dHI9/dy0xNjAwLGMtYXRf/bWF4';
}
*/

// Hacemos fetch de una imagen cuadrada aleatoria utilizando el API de Unsplash
async function fetchRandomSquareImage() {

  // Random
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  var selectImagen = getRandomInt(10);

  imageUrl = "https://raw.githubusercontent.com/TeenBiscuits/CronoSquare/main/pics/" + selectImagen + ".jpg"

  return imageUrl;
}

// Función slice, la cual divide a la imagen cuadrada aleatoria en dieciséis fragmentos cuadrados iguales.
async function sliceImage(imageUrl) {
  // Esperar respuesta de la API
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  const image = await createImageBitmap(blob);

  // Corte de la imagen 
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
      imageParts.push({ url: partUrl, id: row * 4 + col + 1 }); // Assign a unique ID to each tile
    }
  }

  return imageParts; // Devolvemos las partes, cada una siendo un único elemento con una ID numérica asignada (1-16) y su propia URL nativa.
}

// FUNCIONES PARA EL TIEMPO

// Comenzamos el temporizador. Pasamos a "DOMContentLoaded" como argumento del listener para cargar completamente el código HTML.
document.addEventListener("DOMContentLoaded", function () {
  var duracion = 10 * 60 * 1000; // 10 minutos en milisegundos
  var inicio = Date.now();
  var fin = inicio + duracion;
  var display = document.getElementById("cuentaAtras");

  var temporizador = setInterval(function () {
    var ahora = Date.now();
    var diferencia = fin - ahora;

    // Condición que verifica la finalización y pérdida del juego por tiempo.
    if (diferencia <= 0) {
      clearInterval(temporizador);
      display.textContent = "00:00:00";
      alert("¡Tiempo finalizado!");
      gameruning = false;
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

// Se actualiza la pantalla del tiempo.
function updateTimer() {
  const currentTime = Date.now();
  const elapsedTime = Math.floor((currentTime - startTime) / 1000);
  const remainingTime = 900 - elapsedTime; // 15 minutes = 15 * 60 = 900 seconds
  if (remainingTime <= 0) {
    timerDisplay.textContent = '00:00';
    stopTimer();
    // Optionally, you can add code here to handle when time runs out
    gameruning = false;
  } else {
    timerDisplay.textContent = formatTime(remainingTime);
  }
}

// Se formatea el tiempo en minutos, segundos y milisegundos.
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// Se para el temporizador.
function stopTimer() {
  clearInterval(timerInterval);
}

// FUNCIONES PARA LA GENERACIÓN DE LA CUADRÍCULA 4X4

// Se crea la cuarícula 4x4 para el juego del quince (taken) y se toma "DOMContentLoaded" como argumento de la función para poder utilizar IDs del index.html como constantes.
function createGameGrid(imageParts, DOMContentLoaded) {
  gameGrid.innerHTML = ''; // Despejamos la cuadrícula anterior (si existió).

  // Se barajan las partes de la imagen.
  const shuffledParts = shuffle(imageParts);

  // Se asigna la ID única y la posición de la ranura vacía.
  const emptyTileId = 16; // Última ID (la ranura vacía).
  let emptyTileIndex; // Declaramos el índice de la ranura vacía.

  const showNumbers = document.getElementById('show-numbers'); // Se declara la constante "showNumbers", inicializándola como un elemento a partir de la ID "show-numbers", utilizada como etiqueta en el index.html para el switch (checkbox).

  // Se otorga a CADA UNA de las piezas sus respectivos atributos.
  shuffledParts.forEach((part, index) => {
    const puzzlePiece = document.createElement('div');
    puzzlePiece.classList.add('pieza');
    puzzlePiece.dataset.position = index;
    puzzlePiece.dataset.id = part.id;
    puzzlePiece.style.backgroundImage = `url('${part.url}')`;

    // Se muestran los números de las IDs asignadas para las piezas únicamente si el switch de mostrar números está activado. Para ello, se modifica el atributo "textContent" de cada una de las piezas, es decir, dentro del bucle "for".
    showNumbers.addEventListener('change', function () {
      const puzzlePieces = gameGrid.querySelectorAll('.pieza');
      const switchElement = document.getElementById('show-numbers');

      if (switchElement && switchElement.checked !== undefined) {
        if (switchElement.checked) {
          puzzlePieces.forEach(piece => {
            piece.textContent = piece.dataset.id; // Set tile number to its ID
          });
        } else {
          puzzlePieces.forEach(piece => {
            piece.textContent = ''; // Clear tile numbers
          });
        }
      }
    });

    // Condición que verifica que la pieza seleccionada es la ranura vacía.
    if (part.id === emptyTileId) {
      // This tile is the empty tile
      emptyTileIndex = index;
    }

    
    puzzlePiece.addEventListener('click', tileClickHandler); // El listener analiza, con la función "tileClickHandler", si una de las cuatro casillas adyacentes a la seleccionada con el "clickEvent".
    document.getElementById('random-button').addEventListener('click', initializeGame); // El botón "random" inicia un nuevo juego, manteniendo la puntuación.


    gameGrid.appendChild(puzzlePiece); // Se le asigna cada una de las piezas (como "hijas") a la cuadrícula de juego.
  });

  // Se establece la posición de la ranura vacía.
  originalEmptyTilePosition = emptyTileIndex;
  emptyTilePosition = emptyTileIndex;

  // Se oculta la imagen de fondo de la decimosexta pieza (es decir, la ranura vacía)...
  const emptyTile = gameGrid.querySelector('.pieza[data-id="16"]');
  emptyTile.style.backgroundImage = 'none'; // ... como "none".
}

// Función listener para el evento del click de una pieza.
function tileClickHandler(event) {
  const clickedTile = event.target;
  const clickedPosition = parseInt(clickedTile.dataset.position);
  // En caso de que el juego esté funcionando, comprueba si alguna de las cuatro casillas adyacentes a la pieza seleccionada está vacía, lo cual implicaría la posibilidad de poder moverla.
  if (gameruning) {
    // Check if clicked tile is adjacent to the empty tile
    if (isAdjacent(clickedPosition, emptyTilePosition)) {
      // Reproduce el sonido
      document.getElementById('musifondo').play();
      ++moves; // Incrementa el número de movimientos en 1.
      updateMoveDisplay(); // Actualiza el contador de movimientos.
      console.log(moves);
      document.getElementById('sonidoClick').play();
      // Swap the clicked tile with the empty tile
      swapTiles(clickedTile);
      emptyTilePosition = clickedPosition;
    }

    // Si el puzle se resuelve, otorga 100 puntos al jugador, actualiza el contador del puntaje y detiene el juego (temporizador no incluido).
    if (isPuzzleSolved()) {
      score += 100; // Increase score by 100 when puzzle is solved
      updateScoreDisplay(); // Update the score display
      gameruning = false;
    }
  }
}

// Función que intercambia dos piezas.
function swapTiles(clickedTile) {
  // Find the empty tile
  const emptyTile = gameGrid.querySelector('.pieza[data-position="' + emptyTilePosition + '"]');

  // Intercambia sus posiciones - Rompe la integridad de posición, puesto que desplaza a las propia posiciones (comentado).
  /*
  const tempPosition = clickedTile.dataset.position;
  clickedTile.dataset.position = emptyTile.dataset.position;
  emptyTile.dataset.position = tempPosition;
  */

  // Intercambia sus imágenes de fondo.
  const tempBackground = clickedTile.style.backgroundImage;
  clickedTile.style.backgroundImage = emptyTile.style.backgroundImage;
  emptyTile.style.backgroundImage = tempBackground;

  // Intercambia sus IDs.
  const tempId = clickedTile.dataset.id;
  clickedTile.dataset.id = emptyTile.dataset.id;
  emptyTile.dataset.id = tempId;

  // Intercambia sus valores numéricos.
  const tempNumber = clickedTile.textContent;
  clickedTile.textContent = emptyTile.textContent;
  emptyTile.textContent = tempNumber;
}

// Algoritmo de desordenación de Fisher-Yates.
function shuffle(array) {
  let currentIndex = array.length;
  let randomIndex;

  // Bucle "while" que desordena el mapa. Si es comentado, el mapa aparecerá resuelto, y el botón de regeneración cambiará la imagen únicamente.
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

// Función que comprueba si dos posiciones son adyacentes entre sí.
function isAdjacent(position1, position2) {
  const row1 = Math.floor(position1 / 4);
  const col1 = position1 % 4;
  const row2 = Math.floor(position2 / 4);
  const col2 = position2 % 4;
  const rowDiff = Math.abs(row1 - row2);
  const colDiff = Math.abs(col1 - col2);
  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

// Se comprueba si el puzle ha sido resuelto.
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

// Actualización de la muestra del puntaje actual.
function updateScoreDisplay() {
  const scoreDisplay = document.getElementById('score-display');
  scoreDisplay.textContent = `Puntuación: ${score}`;
}

// Actualización de la muestra del contador de movimientos.
function updateMoveDisplay() {
  const moveDisplay = document.getElementById('move-display');
  moveDisplay.textContent = `Movimientos: ${moves}`;
}

// Función asíncrona para inicializar el juego.
async function initializeGame() {
  gameruning = true;
  const imageUrl = await fetchRandomSquareImage();
  const imageParts = await sliceImage(imageUrl);
  createGameGrid(imageParts);
  const miImagenDeLaEsquina = document.getElementById("imagenDeLaEsquina");
  miImagenDeLaEsquina.src = imageUrl;
}

// Inicialización del juego.
initializeGame();
