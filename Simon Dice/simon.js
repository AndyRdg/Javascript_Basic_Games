let order = [];
let playerOrder = [];
let flash; // Integer para el numero de flashes
let turn; // Turno en el que nos encontramos
let good; // Boolean, si acertamos o no
let compTurn; //Boolean, para ver si es turno del ordenador o del jugador.
let intervalId;
let strict = false; //Boolean para el checkbox Strict.
let noise = true;
let on = false; // Boolean para el checkbox Power
let win;

const turnCounter = document.querySelector("#turn");
const topLeft = document.querySelector("#topleft");
const topRight = document.querySelector("#topright");
const bottomLeft = document.querySelector("#bottomleft");
const bottomRight = document.querySelector("#bottomright");
const strictButton = document.querySelector("#strict");
const onButton = document.querySelector("#on");
const startButton = document.querySelector("#start");

// Evento para el checkbox de STRICT
strictButton.addEventListener('change', (event) => {
    if (strictButton.checked == true) {
        strict = true;
        console.log("Strict Mode: On")
    } else {
        strict = false;
        console.log("Strict Mode: Off")
    }
})

// Evento para el checkbox de POWER
onButton.addEventListener('click', (event) => {
    if (onButton.checked == true) {
        on = true;
        console.log("Juego Encendido");
        turnCounter.innerHTML = "-"
    } else {
        on = false;
        console.log("Juego Apagado");
        turnCounter.innerHTML = "";
        clearColor();
        clearInterval(intervalId);
    }
})

startButton.addEventListener('click', (event) => {
    if (on || win) {
        play()
    }
})

play = () => {
    //Reiniciamos las variables iniciales
    win = false;
    order = []
    playerOrder = [];
    flash = 0;
    intervalId = 0;
    turn = 1;
    turnCounter.innerHTML = 1;
    good = true;
    for (var i = 0; i < 20; i++) {
        order.push(Math.floor(Math.random() * 4) + 1) // Generador de numeros aleatorios del 1 al 4.
    }
    compTurn = true; // Comienza jugando el ordenador.

    //Intervalo entre gameTurns
    intervalId = setInterval(gameTurn, 800);
}

gameTurn = () => {
    on = false; // Mientras que esto sea así, el jugador no puede tocar botones

    if (flash == turn) {
        clearInterval(intervalId);
        compTurn = false;
        clearColor();
        on = true;
    }

    if (compTurn) {
        clearColor();
        setTimeout(() => {
            if (order[flash] == 1) one();
            if (order[flash] == 2) two();
            if (order[flash] == 3) three();
            if (order[flash] == 4) four();
            flash++;
        }, 200)
    }
}

// Comprobamos la jugada del Player
check = () => {
    console.log("JUGADOR" + playerOrder);
    console.log("MAQUINA" + order);
    if (playerOrder[playerOrder.length - 1] !== order[playerOrder.length - 1]) good = false;

    if (playerOrder.length == 20 && good) {
        winGame();
    }
    if (good == false) {
        flashColor();
        turnCounter.innerHTML = "NO!";
        setTimeout(() => {
            turnCounter.innerHTML = turn;
            clearColor();

            if (strict) {
                play();
            } else {
                compTurn = true;
                flash = 0;
                playerOrder = [];
                good = true;
                intervalId = setInterval(gameTurn, 800);
            }
        }, 800)

        noise = false;
    }

    if (turn == playerOrder.length && good && !win) {
        turn++;
        playerOrder = [];
        compTurn = true;
        flash = 0;
        turnCounter.innerHTML = turn;
        intervalId = setInterval(gameTurn, 800);
    }
}

winGame = () => {
    flashColor();
    turnCounter.innerHTML = "WIN!"
    on = false;
    win = true;
}

//Limpiamos efectos de los pulsadores de Color
clearColor = () => {
    topLeft.style.backgroundColor = "darkgreen";
    topRight.style.backgroundColor = "darkred";
    bottomLeft.style.backgroundColor = "goldenrod";
    bottomRight.style.backgroundColor = "darkblue";
}

flashColor = () => {
    topLeft.style.backgroundColor = "lightgreen";
    topRight.style.backgroundColor = "tomato";
    bottomLeft.style.backgroundColor = "yellow";
    bottomRight.style.backgroundColor = "lightskyblue";
}


//----ACCIONES DE CADA COLOR: rEPRODUCIR SONIDO Y CAMBIAR FONDO
one = () => {
    if (noise) {
        let audio = document.getElementById("clip1");
        audio.play()
    }
    noise = true;
    topLeft.style.backgroundColor = "Lightgreen";
}

two = () => {
    if (noise) {
        let audio = document.getElementById("clip2");
        audio.play()
    }
    noise = true;
    topRight.style.backgroundColor = "tomato";
}

three = () => {
    if (noise) {
        let audio = document.getElementById("clip3");
        audio.play()
    }
    noise = true;
    bottomLeft.style.backgroundColor = "yellow";
}

four = () => {
    if (noise) {
        let audio = document.getElementById("clip4");
        audio.play()
    }
    noise = true;
    bottomRight.style.backgroundColor = "lightskyblue";
}

topLeft.addEventListener('click', (event) => {
    if (on) {
        playerOrder.push(1);
        check();
        one();
        if (!win) {
            setTimeout(() => {
                clearColor();
            }, 300);
        }
    }
})

topRight.addEventListener('click', (event) => {
    if (on) {
        playerOrder.push(2);
        check();
        two();
        if (!win) {
            setTimeout(() => {
                clearColor();
            }, 300);
        }
    }
})

bottomLeft.addEventListener('click', (event) => {
    if (on) {
        playerOrder.push(3);
        check();
        three();
        if (!win) {
            setTimeout(() => {
                clearColor();
            }, 300);
        }
    }
})

bottomRight.addEventListener('click', (event) => {
        if (on) {
            playerOrder.push(4);
            check();
            four();
            if (!win) {
                setTimeout(() => {
                    clearColor();
                }, 300);
            }
        }
    })
    //------  FIN ACCIONES COLORES ------