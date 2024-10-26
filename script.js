let currentPlayer = "X"; 
let isGameActive = true; 
const cells = document.querySelectorAll(".cell"); 
let startTime; 
let timeElapsed; 

// Para manejar el movimiento del jugador
function handlePlayerMove(cell) {
    if (isGameActive && cell.textContent === "") {
        cell.textContent = currentPlayer;

        if (checkWinner()) {
            timeElapsed = new Date().getTime() - startTime; 
            alert(`${currentPlayer} gana en ${timeElapsed} ms!`);
            isGameActive = false; 
            const playerName = prompt("Ingresa tu nombre para el registro de mejores tiempos:");
            saveBestTime(playerName, timeElapsed);
            return;
        }

        currentPlayer = "O"; 
        handleComputerMove(); 
    }
}

// Para manejar el movimiento de la computadora
function handleComputerMove() {
    const emptyCells = Array.from(cells).filter(cell => cell.textContent === "");
    
    if (emptyCells.length > 0 && isGameActive) {
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        randomCell.textContent = currentPlayer; 
        
        if (checkWinner()) {
            timeElapsed = new Date().getTime() - startTime; 
            alert(`${currentPlayer} gana en ${timeElapsed} ms!`);
            isGameActive = false; 
            return;
        }
        currentPlayer = "X"; 
    }
}

// Comprobar si hay un ganador
function checkWinner() {
    const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    return winConditions.some(condition => {
        const [a, b, c] = condition;
        return cells[a].textContent === currentPlayer && 
               cells[b].textContent === currentPlayer && 
               cells[c].textContent === currentPlayer;
    });
}

// Guardalos mejores tiempos
function saveBestTime(playerName, time) {
    const bestTimes = JSON.parse(localStorage.getItem("bestTimes")) || [];
    
    bestTimes.push({ player: playerName, time: time });
    bestTimes.sort((a, b) => a.time - b.time);
    
    if (bestTimes.length > 10) bestTimes.pop(); // Limitar a los primeros 10
    
    localStorage.setItem("bestTimes", JSON.stringify(bestTimes));
    renderBestTimes();
}

// Renderizar mejores tiempos
function renderBestTimes() {
    const bestTimesList = document.getElementById("best-times-list");
    const bestTimes = JSON.parse(localStorage.getItem("bestTimes")) || [];
    
    bestTimesList.innerHTML = ""; 
    bestTimes.forEach((entry, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${index + 1}. ${entry.player} - ${entry.time} ms`; // Solo el tiempo
        bestTimesList.appendChild(listItem);
    });
}

// Iniciar el cronometro al comenzar el juego
function startNewGame() {
    cells.forEach(cell => cell.textContent = ""); 
    isGameActive = true; 
    currentPlayer = "X"; 
    startTime = new Date().getTime(); 
}

// Borrar mejores tiempos
function clearBestTimes() {
    localStorage.removeItem("bestTimes");
    renderBestTimes();
}

// Renderizar al cargar la pagina
window.onload = () => {
    renderBestTimes();
    startNewGame();
};
