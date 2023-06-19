// HTML ELEMENTS
const statusDiv = document.querySelector(".status");
const resetDiv = document.querySelector(".reset");
const cellDivs = document.querySelectorAll(".game-cell");


//Game Variables
let gameIsLive = true;
let xIsNext = true;
let winner = null;

// functions

const HandleWinner = (letter) => {
    gameIsLive = false;
    winner = letter;
    if (winner === 'x') {
        statusDiv.innerHTML = `${winner} has won!`;

        for (const cellDiv of cellDivs) {
            cellDiv.removeEventListener('click', handleCellClick) // desactivamos casilas para que no se pueda seguir jugando

        }
    } else {
        statusDiv.innerHTML = `<span>${winner} has won!</span>`;
        for (const cellDiv of cellDivs) {
            cellDiv.removeEventListener('click', handleCellClick) // desactivamos casilas para que no se pueda seguir jugando

        }
    }
}

const checkGameStatus = () => {
    const topLeft = cellDivs[0].classList[2];
    const topMiddle = cellDivs[1].classList[2];
    const topRight = cellDivs[2].classList[2];
    const middleLeft = cellDivs[3].classList[2];
    const middleMiddle = cellDivs[4].classList[2];
    const middleRight = cellDivs[5].classList[2];
    const bottomLeft = cellDivs[6].classList[2];
    const bottomMiddle = cellDivs[7].classList[2];
    const bottomRight = cellDivs[8].classList[2];

    //is there a winner? // SEGURAMENTE MEJOR COMPROBARLO CON UN ARRAY BIDIMENSIONAL ASIGNAMOS A LAS CASILLAS CLASES 
    //HORIZONTALES
    if (topLeft && topLeft === topMiddle && topLeft === topRight) {
        HandleWinner(topLeft);
        cellDivs[0].classList.add('won');
        cellDivs[1].classList.add('won');
        cellDivs[2].classList.add('won');
    } else if (middleLeft && middleLeft === middleMiddle && middleLeft === middleRight) {
        HandleWinner(middleLeft);
        cellDivs[3].classList.add('won');
        cellDivs[4].classList.add('won');
        cellDivs[5].classList.add('won');
    } else if (bottomLeft && bottomLeft === bottomMiddle && bottomLeft === bottomRight) {
        HandleWinner(bottomLeft);
        cellDivs[6].classList.add('won');
        cellDivs[7].classList.add('won');
        cellDivs[8].classList.add('won');
    }
    //VERTICALES
    else if (topLeft && topLeft === bottomLeft && topLeft === middleLeft) {
        HandleWinner(topLeft);
        cellDivs[0].classList.add('won');
        cellDivs[3].classList.add('won');
        cellDivs[6].classList.add('won');
    } else if (topMiddle && topMiddle === middleMiddle && topMiddle === bottomMiddle) {
        HandleWinner(topMiddle);
        cellDivs[1].classList.add('won');
        cellDivs[4].classList.add('won');
        cellDivs[7].classList.add('won');
    } else if (topRight && topRight === middleMiddle && middleRight === bottomRight) {
        HandleWinner(topRight);
        cellDivs[2].classList.add('won');
        cellDivs[5].classList.add('won');
        cellDivs[8].classList.add('won');
    }

    //DIAGONALES
    //VERTICALES
    else if (topLeft && topLeft === middleMiddle && topLeft === bottomRight) {
        HandleWinner(topLeft);
        cellDivs[0].classList.add('won');
        cellDivs[4].classList.add('won');
        cellDivs[8].classList.add('won');
    } else if (topRight && topRight === middleMiddle && topRight === bottomLeft) {
        HandleWinner(topRight);
        cellDivs[2].classList.add('won');
        cellDivs[4].classList.add('won');
        cellDivs[6].classList.add('won');
    }

    //EMPATE??
    else if (topLeft && topMiddle && topRight && middleLeft && middleMiddle && middleRight && bottomLeft && bottomMiddle && bottomRight) {
        gameIsLive = false;
        statusDiv.innerHTML = "EMPATE!!!!"
    } else {
        if (xIsNext === 'x') {
            statusDiv.innerHTML = "X is next";
        } else {
            statusDiv.innerHTML = "<span>O is next</span>";
        }
    }


}


// Event Handlers
const handleReset = (e) => {
    // Modo rapido de reset
    if (confirm("¿Seguro que quiere comenzar de nuevo?")) {
        location.reload(true); // Recargamos la página completa
    }

    // Modo fino de reset
    /*xIsNext = true;
    statusDiv.innerHTML = "X is next"
    winner = null;
    for (const cellDi of cellDivs){
        cellDiv.classList.remove('x');
        cellDiv.classList.remove('o');*/
}

// JUGADA Y CAMBIO DE TURNO
const handleCellClick = (e) => {
    const classList = e.target.classList; //Obtenemos todas las clases del target
    const location = e.target.classList[1]; //Obtenemos la localizacion del target

    if (classList[2] == 'x' || classList[2] == 'o') {
        return;
    }

    if (xIsNext) {
        classList.add('x')
        xIsNext = !xIsNext;
        checkGameStatus();
    } else {
        classList.add('o')
        xIsNext = !xIsNext;
        checkGameStatus();
    }

}


// event Listeners
resetDiv.addEventListener('click', handleReset);

for (const cellDiv of cellDivs) {
    cellDiv.addEventListener('click', handleCellClick)
}