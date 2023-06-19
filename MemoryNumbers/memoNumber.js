//BOTONES
const botonCrearTablero = document.getElementById('pintar');
const botonGenerar = document.getElementById('generar');
const botonComenzar = document.getElementById('comenzar');
const botonComprobar = document.getElementById('comprobar');
const botonReiniciar = document.getElementById('reiniciar');

// Desactivamos los botones para controlar el orden en el que deben ser clickados.
// De este modo, hasta que no tengamos tablero, no se generaran colores, hasta que no se generen colores, no se puede jugar, etc..
botonGenerar.disabled = true;
botonComenzar.disabled = true;
botonComprobar.disabled = true;

// Añadimos los eventos a los botones
botonCrearTablero.addEventListener("click", mostrarTablero);
botonGenerar.addEventListener("click", generar);
botonComenzar.addEventListener("click", comenzar);
botonComprobar.addEventListener("click", comprobar); // Vamos a permitir jugar y comprobar cuantas veces queramos.
botonReiniciar.addEventListener("click", reiniciar);

const memoNumber = {
    numFilas: 0,
    numColumnas: 0,
    tableroColores: [],
    tableroJugador: []
}

function establecerVariables() {
    //var errorVariables = "";
    memoNumber.numFilas = document.getElementById("ancho").value;
    memoNumber.numColumnas = document.getElementById("alto").value;
    console.log(memoNumber.numFilas);
    console.log(memoNumber.numColumnas);
}

function mostrarTablero() {
    establecerVariables();
    if (memoNumber.numColumnas >= 2 && memoNumber.numFilas >= 2) {
        pintarTablero();
        //document.getElementById("pintar").disabled = true;
        botonGenerar.disabled = false; // En caso de Volver a pintar el tablero una vez generado, volvemos a habilitar el boton de generar.
    } else {
        alert("Introduzca un numero de columnas y filas mayor que 2 \n pulse Generar de nuevo")
    }
}

function generar() {
    generarTableroMaquina();
    repartirNumeros();
    botonComenzar.disabled = false;

}

function comenzar() {
    generarTableroJugador();
    for (let f = 0; f < memoNumber.numFilas; f++) {
        for (let c = 0; c < memoNumber.numColumnas; c++) {
            let casilla = document.querySelector("#f" + f + "_c" + c);
            casilla.disabled = false;
            casilla.value = "";
            casilla.addEventListener("keypress", jugada, false);
        }

        botonComenzar.disabled = true;
        botonComprobar.disabled = false;

    }
}

function comprobar() {
    let aciertos = 0;
    let fallos = 0;
    let dimension_tablero = memoNumber.numColumnas * memoNumber.numFilas;

    for (let f = 0; f < memoNumber.numFilas; f++) {
        for (let c = 0; c < memoNumber.numColumnas; c++) {
            if (memoNumber.tableroColores[f][c] === memoNumber.tableroJugador[f][c]) {
                aciertos++;
                console.log("Fila" + f + "Columna " + c + "Aciertos" + aciertos)
            }

        }
    }
    fallos = dimension_tablero - aciertos;
    porcentaje = (aciertos / dimension_tablero) * 100
    porcentaje = porcentaje.toFixed(2);

    //let resultado = "APROBADO!!!<br>Aciertos: " + aciertos + "<br>Fallos: " + fallos + "<br>Porcentaje: " + porcentaje + "%"

    if (porcentaje >= 50) {
        let resultado = "APROBADO!!!<br>Aciertos: " + aciertos + "<br>Fallos: " + fallos + "<br>Porcentaje: " + porcentaje + "%"
        document.getElementById("mensaje").innerHTML = resultado;
    } else {
        let resultado = "LAMENTABLE!!!<br>Aciertos: " + aciertos + "<br>Fallos: " + fallos + "<br>Porcentaje: " + porcentaje + "%"
        document.getElementById("mensaje").innerHTML = resultado;
    }


}

function reiniciar() {
    if (confirm("¿Seguro que quiere comenzar de nuevo?")) {
        location.reload(true); // Recargamos la página completa
    }

    /*
    document.getElementById("pintar").disabled = false;
    document.getElementById("generar").disabled = false;
    document.getElementById("comenzar").disabled = false;

    for (let f = 0; f < memoNumber.numFilas; f++) {
        for (let c = 0; c < memoNumber.numColumnas; c++) {
            let casilla = document.querySelector("#f" + f + "_c" + c);
            casilla.classList.remove("azul");
            casilla.classList.remove("rojo");
            casilla.classList.remove("verde");
            casilla.classList.remove("negro");
        }
    }
*/

}

function pintarTablero() {
    let tablero = document.querySelector("#tablero");
    let dimension = memoNumber.numColumnas * memoNumber.numFilas

    var inicio = `BIENVENIDO!! <br> El juego va a comenzar: <br> El tablero contiene <b>${dimension}</b> casillas !! MEmoriza los numeros ganaras !<br> Suerte Jugador`
    document.getElementById("mensaje").innerHTML = inicio;

    //En caso de existir un tablero ya pintado, lo borramos y pintamos el nuevo.
    while (tablero.firstChild) {
        tablero.removeChild(tablero.firstChild);
    }
    //Establecemos el número de filas y columnas en el estilo del Html
    document.querySelector("html").style.setProperty("--num-filas", memoNumber.numFilas);
    document.querySelector("html").style.setProperty("--num-columnas", memoNumber.numColumnas);
    //Dibujamos mediante Divs el tablero que se muestra al jugador
    for (let f = 0; f < memoNumber.numFilas; f++) {
        for (let c = 0; c < memoNumber.numColumnas; c++) {
            let newDiv = document.createElement("div");
            newDiv = document.createElement("input");
            newDiv.setAttribute("id", "f" + f + "_c" + c);
            newDiv.dataset.fila = f;
            newDiv.dataset.columna = c;
            newDiv.disabled = true;

            //newDiv.addEventListener("click", destapar); //evento para cada casilla con el botón izquierdo del raton

            tablero.appendChild(newDiv);

        }
    }
}

function generarTableroMaquina() {
    memoNumber.tableroColores = new Array(memoNumber.numFilas);
    for (let fila = 0; fila < memoNumber.numFilas; fila++) {
        memoNumber.tableroColores[fila] = new Array(memoNumber.numColumnas);
    }
}

function generarTableroJugador() {
    memoNumber.tableroJugador = new Array(memoNumber.numFilas);
    for (let fila = 0; fila < memoNumber.numFilas; fila++) {
        memoNumber.tableroJugador[fila] = new Array(memoNumber.numColumnas);
    }
}

function repartirNumeros() {
    for (let f = 0; f < memoNumber.numFilas; f++) {
        for (let c = 0; c < memoNumber.numColumnas; c++) {
            memoNumber.tableroColores[f][c] = Math.floor(Math.random() * 5) + 1 // Numeros del 1 al 5
            let casilla = document.querySelector("#f" + f + "_c" + c);
            casilla.value = memoNumber.tableroColores[f][c];


        }
    }
    document.getElementById("generar").disabled = true;
}

function jugada(e) {
    let casilla = e.currentTarget;
    let fila = parseInt(casilla.dataset.fila, 10);
    let columna = parseInt(casilla.dataset.columna, 10)

    if (this.classList.value == "") {
        switch (String.fromCharCode(e.charCode)) {
            case "":
                casilla.value = "X"
                memoNumber.tableroJugador[fila][columna] = "X";
                console.log(memoNumber.tableroJugador[fila][columna])
            case "0":
                casilla.value = "0"
                memoNumber.tableroJugador[fila][columna] = 0;
                console.log(memoNumber.tableroJugador[fila][columna]);
                casilla.disabled = true;
                break;
            case "1":
                casilla.value = "1"
                memoNumber.tableroJugador[fila][columna] = 1;
                console.log(memoNumber.tableroJugador[fila][columna])
                casilla.disabled = true;
                break;
            case "2":
                casilla.value = "2"
                memoNumber.tableroJugador[fila][columna] = 2;
                console.log(memoNumber.tableroJugador[fila][columna])
                casilla.disabled = true;
                break;
            case "3":
                casilla.value = "3"
                memoNumber.tableroJugador[fila][columna] = 3;
                console.log(memoNumber.tableroJugador[fila][columna])
                casilla.disabled = true;
                break;
            case "4":
                casilla.value = "4"
                memoNumber.tableroJugador[fila][columna] = 4;
                console.log(memoNumber.tableroJugador[fila][columna])
                casilla.disabled = true;
                break;
            case "5":
                casilla.value = "5"
                memoNumber.tableroJugador[fila][columna] = 5;
                console.log(memoNumber.tableroJugador[fila][columna])
                casilla.disabled = true;
                break;
            default:
                alert("Por favor, introduzca un valor válido!!");
        }
    } else {
        alert("Lo siento!! Ya has marcado un numero en esa casilla y no se puede cambiar!!");
    }
    // Para que no nos salgan los valores que introducimos por teclado lo que se me ocurre es cancelar el evento    
    e.preventDefault();
}