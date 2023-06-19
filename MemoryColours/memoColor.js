//BOTONES
const botonCrearTablero = document.getElementById('crearTablero');
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
botonComprobar.addEventListener("click", comprobar);
botonReiniciar.addEventListener("click", reiniciar);

const memoColor = {
    numFilas: 0,
    numColumnas: 0,
    tableroColores: [],
    tableroJugador: []
}

function establecerVariables() {
    //var errorVariables = "";
    memoColor.numFilas = document.getElementById("ancho").value;
    memoColor.numColumnas = document.getElementById("alto").value;



    //console.log(memoColor.numFilas);
    //console.log(memoColor.numColumnas);
}


// DEFINICION EVENTOS DE LOS BOTONES

function mostrarTablero() {
    establecerVariables();
    if (memoColor.numColumnas >= 2 && memoColor.numFilas >= 2) {
        pintarTablero();
        botonGenerar.disabled = false;

    } else {
        alert("Introduzca un numero de columnas y filas mayor que 2 \n pulse Generar de nuevo")

    }
}

function generar() {
    generarTableroMaquina();
    repartirColores();
    botonComenzar.disabled = false;

}

function comenzar() {
    generarTableroJugador();
    for (let f = 0; f < memoColor.numFilas; f++) {
        for (let c = 0; c < memoColor.numColumnas; c++) {
            let casilla = document.querySelector("#f" + f + "_c" + c);
            casilla.disabled = false; // Habilitamos la casilla para poder introducir
            casilla.classList.remove("azul");
            casilla.classList.remove("rojo");
            casilla.classList.remove("verde");
            casilla.classList.remove("negro");
            casilla.value = "";
            casilla.addEventListener("keypress", jugada, false);
        }

        //Gestionamos botones
        botonComenzar.disabled = true;
        botonComprobar.disabled = false;
    }


}

// Realizamos las comprobaciones casilla a casilla
function comprobar() {
    let aciertos = 0;
    let fallos = 0;
    let dimension_tablero = memoColor.numColumnas * memoColor.numFilas;

    for (let f = 0; f < memoColor.numFilas; f++) {
        for (let c = 0; c < memoColor.numColumnas; c++) {
            if (memoColor.tableroColores[f][c] == memoColor.tableroJugador[f][c]) {
                aciertos++;
            }

        }
    }
    fallos = dimension_tablero - aciertos;
    porcentaje = (aciertos / dimension_tablero) * 100
    porcentaje = porcentaje.toFixed(2);
    if (porcentaje >= 50) {
        alert("APROBADO!!!\nAciertos: " + aciertos + "\nFallos: " + fallos + "\nPorcentaje: " + porcentaje + "%");
    } else {
        alert("SUSPENSO!!!\nAciertos: " + aciertos + "\nFallos: " + fallos + "\nPorcentaje: " + porcentaje + "%");
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

    for (let f = 0; f < memoColor.numFilas; f++) {
        for (let c = 0; c < memoColor.numColumnas; c++) {
            let casilla = document.querySelector("#f" + f + "_c" + c);
            casilla.classList.remove("azul");
            casilla.classList.remove("rojo");
            casilla.classList.remove("verde");
            casilla.classList.remove("negro");
        }
    }
*/

}


// FUNCIONES 

// Dibujamos el tablero de juego en la pagina con los elementos que necesitamos
function pintarTablero() {
    let tablero = document.querySelector("#tablero");

    //En caso de existir un tablero ya pintado, lo borramos y pintamos el nuevo.
    while (tablero.firstChild) {
        tablero.removeChild(tablero.firstChild);
    }
    //Establecemos el número de filas y columnas en el estilo del Html
    document.querySelector("html").style.setProperty("--num-filas", memoColor.numFilas);
    document.querySelector("html").style.setProperty("--num-columnas", memoColor.numColumnas);
    //Dibujamos mediante Divs el tablero que se muestra al jugador
    for (let f = 0; f < memoColor.numFilas; f++) {
        for (let c = 0; c < memoColor.numColumnas; c++) {
            let newDiv = document.createElement("div");
            newDiv = document.createElement("input");
            newDiv.setAttribute("id", "f" + f + "_c" + c);
            newDiv.dataset.fila = f;
            newDiv.dataset.columna = c;
            newDiv.disabled = true; //No permitimos la introduccion de datos

            //newDiv.addEventListener("click", destapar); //evento para cada casilla con el botón izquierdo del raton

            tablero.appendChild(newDiv);

        }
    }
}

// Generamos tableros de la maquina y del jugador vacios
function generarTableroMaquina() {
    memoColor.tableroColores = new Array(memoColor.numFilas);
    for (let fila = 0; fila < memoColor.numFilas; fila++) {
        memoColor.tableroColores[fila] = new Array(memoColor.numColumnas);
    }
}

function generarTableroJugador() {
    memoColor.tableroJugador = new Array(memoColor.numFilas);
    for (let fila = 0; fila < memoColor.numFilas; fila++) {
        memoColor.tableroJugador[fila] = new Array(memoColor.numColumnas);
    }
}

// Funcion para repartir e introducir los colores en el tablero de la maquina
function repartirColores() {
    for (let f = 0; f < memoColor.numFilas; f++) {
        for (let c = 0; c < memoColor.numColumnas; c++) {
            memoColor.tableroColores[f][c] = Math.floor(Math.random() * 4)
            let casilla = document.querySelector("#f" + f + "_c" + c);
            switch (memoColor.tableroColores[f][c]) {
                case 0:
                    casilla.classList.add("azul")
                    break;
                case 1:
                    casilla.classList.add("verde")
                    break;
                case 2:
                    casilla.classList.add("rojo")
                    break;
                case 3:
                    casilla.classList.add("negro")
                    break;
            }

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
            case "a":
                this.classList.add("azul");
                memoColor.tableroJugador[fila][columna] = 0;
                console.log(memoColor.tableroJugador[fila][columna])
                    // Una vez introducido un valor podemos deshabilitar la casilla
                casilla.disabled = true;
                break;
            case "A":
                this.classList.add("azul");
                memoColor.tableroJugador[fila][columna] = 0;
                console.log(memoColor.tableroJugador[fila][columna])
                casilla.disabled = true;
                break;
            case "v":
                this.classList.add("verde");
                memoColor.tableroJugador[fila][columna] = 1;
                console.log(memoColor.tableroJugador[fila][columna])
                casilla.disabled = true;
                break;
            case "V":
                this.classList.add("verde");
                memoColor.tableroJugador[fila][columna] = 1;
                console.log(memoColor.tableroJugador[fila][columna])
                casilla.disabled = true;
                break;
            case "r":
                this.classList.add("rojo");
                memoColor.tableroJugador[fila][columna] = 2;
                console.log(memoColor.tableroJugador[fila][columna])
                casilla.disabled = true;
                break;
            case "R":
                this.classList.add("rojo");
                memoColor.tableroJugador[fila][columna] = 2;
                console.log(memoColor.tableroJugador[fila][columna])
                casilla.disabled = true;
                break;
            case "n":
                this.classList.add("negro");
                memoColor.tableroJugador[fila][columna] = 3;
                console.log(memoColor.tableroJugador[fila][columna])
                casilla.disabled = true;
                break;
            case "N":
                this.classList.add("negro");
                memoColor.tableroJugador[fila][columna] = 3;
                console.log(memoColor.tableroJugador[fila][columna])
                casilla.disabled = true;
                break;
            default:
                alert("Por favor, introduzca un valor válido!!");
        }
    } else {
        alert("Lo siento!! Ya has marcado un color en esa casilla y no se puede cambiar!!");
    }
    // Para que no nos salgan los valores que introducimos por teclado lo que se me ocurre es cancelar el evento    
    e.preventDefault();
}