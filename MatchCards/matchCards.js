// BOTONES
const botonEmpezar = document.getElementById("comenzar");
const botonReiniciar = document.getElementById("reiniciar");
const botonFinalizar = document.getElementById("fin");
const botonInstruciones = document.getElementById("instrucciones")



// EVENTOS
botonInstruciones.addEventListener('click', function() {
    document.getElementById("instruccionesBox").innerHTML = "<br>Encuentra todas las parejas escondidas y ganaras"
})

botonInstruciones.addEventListener('dblclick', function() {
    document.getElementById("instruccionesBox").innerHTML = ""
})
botonEmpezar.addEventListener("click", inicioPartida);
botonReiniciar.addEventListener("click", reiniciar)
botonFinalizar.addEventListener("click", rendirse)

// Variables del juego
const matchCards = {
    numFilas: 0,
    numColumnas: 0,
    tablero: [],
    _nTotalItem: 0,
    totalClick: 1
}

function inicioPartida() {
    if (establecerVariables()) {
        pintarTablero()
        generarTableroMaquina()
        repartirNumeros2()
    } else {
        return;
    }
    //generarCartas();
    //iniciarEventos();
}

function establecerVariables() {
    let cociente = (document.getElementById("alto").value * document.getElementById("ancho").value) % 2
    if (cociente == 0) {
        matchCards.numFilas = document.getElementById("ancho").value;
        matchCards.numColumnas = document.getElementById("alto").value;
        console.log(matchCards.numFilas);
        console.log(matchCards.numColumnas);
        matchCards._nTotalItem = matchCards.numFilas * matchCards.numColumnas;
        matchCards.totalClick = 0;
        return true;
    } else {
        alert("El numero de casillas deben ser pares")
        return false;
    }
}

function pintarTablero() {
    let tablero = document.querySelector("#tablero");

    var inicio = `BIENVENIDO!! <br> El juego va a comenzar: <br> El tablero contiene <b>${matchCards.numMinasTotales}</b> minas !! Encuentralas y ganaras !<br> Suerte Jugador`
        // document.getElementById("mensaje").innerHTML = inicio;

    //En caso de existir un tablero ya pintado, lo borramos y pintamos el nuevo.
    while (tablero.firstChild) {
        tablero.firstChild.removeEventListener("click", destapar);
        tablero.removeChild(tablero.firstChild);
    }

    //Establecemos el número de filas y columnas en el estilo del Html
    document.querySelector("html").style.setProperty("--num-filas", matchCards.numFilas);
    document.querySelector("html").style.setProperty("--num-columnas", matchCards.numColumnas);

    //Dibujamos mediante Divs el tablero que se muestra al jugador
    for (let f = 0; f < matchCards.numFilas; f++) {
        for (let c = 0; c < matchCards.numColumnas; c++) {
            let newDiv = document.createElement("div");
            newDiv.setAttribute("id", "f" + f + "_c" + c);
            newDiv.dataset.fila = f;
            newDiv.dataset.columna = c;

            newDiv.addEventListener("click", destapar); //evento para cada casilla con el botón izquierdo del raton

            tablero.appendChild(newDiv);


        }
    }

}

function destapar(miEvento) {
    if (miEvento.type === "click") {
        let casilla = miEvento.currentTarget;
        let fila = parseInt(casilla.dataset.fila, 10);
        let columna = parseInt(casilla.dataset.columna, 10)

        destaparCasilla(fila, columna);
        matchCards.totalClick++
    }
}

function destaparCasilla(fila, columna) {
    let casilla = document.querySelector("#f" + fila + "_c" + columna);
    let contadorDisplay = document.getElementsByClassName("display").length;
    //console.log(contadorDisplay);

    if (contadorDisplay == 0) {
        casilla.classList.remove("hide");
        casilla.classList.add("display");
        casilla.innerHTML = casilla.value;
    } else if (contadorDisplay == 1) {
        casilla.classList.remove("hide");
        casilla.classList.add("display");
        casilla.innerHTML = casilla.value;
        let casillaAnterior = document.getElementsByClassName("display")[0].value;
        let casillaAnteriorId = document.getElementsByClassName("display")[0].id
        console.log("CASILLA 1=" + casillaAnterior + casillaAnteriorId);
        let casillaActual = document.getElementsByClassName("display")[1].value;
        let casillaActualId = document.getElementsByClassName("display")[1].id;
        console.log("CASILLA 2=" + casillaActual + casillaActualId);

        //Comprobamos
        if (casillaAnterior === casillaActual) {
            document.getElementById(casillaAnteriorId).classList.add("matched");
            document.getElementById(casillaActualId).classList.add("matched");
            document.getElementById(casillaAnteriorId).classList.remove("display");
            document.getElementById(casillaActualId).classList.remove("display");

        }
    } else if (contadorDisplay == 2) {
        casillasDisplay = document.querySelectorAll(".display")
        console.log(casillasDisplay);
        for (let index = 0; index < casillasDisplay.length; index++) {
            casillasDisplay[index].classList.remove("display");
            casillasDisplay[index].classList.add("hide");
            //casillasDisplay[index].innerHTML = ""
        }
        console.log(casillasDisplay);
    }

    let contadorMatches = document.getElementsByClassName("matched").length;
    if (matchCards._nTotalItem == contadorMatches) {
        alert("Has ganado!\nTe ha costado: " + matchCards.totalClick / 2 + " jugadas")
    }

}

function generarTableroMaquina() {
    matchCards.tablero = new Array(matchCards.numFilas);
    for (let fila = 0; fila < matchCards.numFilas; fila++) {
        matchCards.tablero[fila] = new Array(matchCards.numColumnas);
    }
}

function repartirNumeros() {
    for (let f = 0; f < matchCards.numFilas; f++) {
        for (let c = 0; c < matchCards.numColumnas; c++) {
            matchCards.tablero[f][c] = Math.floor(Math.random() * 5) + 1 // Numeros del 1 al 5
            let casilla = document.querySelector("#f" + f + "_c" + c);
            casilla.value = matchCards.tablero[f][c];


        }
    }
}

// REPARTO DE PAREJAS PARA QUE SE REPITAN
function repartirNumeros2() {
    var charArray = [];
    let totalItem = matchCards._nTotalItem;
    //Rellenamos el array con una pareja cada vuelta
    for (let i = 0; i < (matchCards._nTotalItem / 2); i++) {
        charArray.push(i);
        charArray.push(i);
    }

    while (totalItem > 0) {
        //console.log(charArray);

        for (let f = 0; f < matchCards.numFilas; f++) {
            for (let c = 0; c < matchCards.numColumnas; c++) {
                var index = Math.floor(Math.random() * charArray.length)
                var item = charArray[index]
                matchCards.tablero[f][c] = item;
                //console.log("CASILLA: " + matchCards.tablero[f][c]);
                let casilla = document.querySelector("#f" + f + "_c" + c);
                casilla.value = item;
                charArray.splice(index, 1);
                totalItem--;
            }
        }
    }


}



function reiniciar() {
    location.reload(true); // Recargamos la página completa para "reiniciar" todo de forma rapida
}

function rendirse() {
    for (let f = 0; f < matchCards.numFilas; f++) {
        for (let c = 0; c < matchCards.numColumnas; c++) {
            let casilla = document.querySelector("#f" + f + "_c" + c);
            casilla.innerHTML = casilla.value
            casilla.classList.add("matched");
        }
    }


}