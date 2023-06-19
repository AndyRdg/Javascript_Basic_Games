//BOTONES
const boton = document.getElementById('pintar');
const botonMostrar = document.getElementById('rendirse');
const botonResolver = document.getElementById('mostrar');
const botonReiniciar = document.getElementById('reiniciar');

//ACCIONES
boton.addEventListener("click", inicio);
botonResolver.addEventListener("click", mostrarMinas);
botonMostrar.addEventListener("click", rendirse);
botonReiniciar.addEventListener("click", reiniciar)

var valido = true;

//Almacen de variables que se iran definiendo para cada partida
const buscaminas = {
    numMinasTotales: 0,
    numMinasEncontradas: 0,
    numFilas: 0,
    numColumnas: 0,
    aCampoMinas: [],
    numIntentos: 0
}

/*
Establecemos las variables y parametros indicados para iniciar la partida y comprobamos su validez
*/
function establecerVariables() {
    var errorVariables = "";
    buscaminas.numFilas = document.getElementById("ancho").value;
    buscaminas.numColumnas = document.getElementById("alto").value;

    if (buscaminas.numFilas < 2) {
        document.getElementById("mensaje").classList.add("mensaje_aviso");
        errorVariables += "<li>El número de columnas minimo debe ser 2</li>";
        document.getElementById("mensaje").innerHTML = errorVariables;
        alert("El numero de FILAS debe ser mayor a igual o mayor a 2");
        valido = false;
    }

    if (buscaminas.numColumnas < 2) {
        document.getElementById("mensaje").classList.add("mensaje_aviso");
        errorVariables += "<li>El número de filas minimo debe ser 2</li>";
        document.getElementById("mensaje").innerHTML = errorVariables;
        alert("El numero de COLUMNAS debe ser mayor a igual o mayor a 2");
        valido = false;

    }

    if (buscaminas.numFilas >= 2 && buscaminas.numColumnas >= 2) {
        errorVariables = ""
        document.getElementById("mensaje").innerHTML = errorVariables;
        valido = true;
    }


    // Podriamos manejar la dificultad del juego manejando el ratio de numero de minas totales o de intentos
    buscaminas.numMinasTotales = Math.round((buscaminas.numColumnas * buscaminas.numFilas) / 5);
    document.getElementById("minasTotales").value = buscaminas.numMinasTotales;

    buscaminas.numIntentos = Math.round((buscaminas.numColumnas * buscaminas.numFilas) / 1.5);
    document.getElementById("intentos").value = buscaminas.numIntentos;

    buscaminas.numMinasEncontradas = 0;
    document.getElementById("minas").value = buscaminas.numMinasEncontradas;




    console.log(buscaminas.numFilas);
    console.log(buscaminas.numColumnas);
    console.log(buscaminas.numMinasTotales);
    console.log(buscaminas.numIntentos);

    return valido;
}

function inicio() {
    establecerVariables()
        //Si el ancho y el alto son validos continuamos la ejecución.
    if (valido == true) {
        pintarTablero();
        generarCampoMinasVacio();
        repartirMinas();
    } else {
        document.getElementById("mensaje").innerHTML += "<li><b><u>ESTABLECE NUEVOS VALORES PARA ANCHO Y ALTO</b></u></li>";
    }

}

function pintarTablero() {
    let tablero = document.querySelector("#tablero");

    eliminarFormatos(); // Por si ha habido partidas previas y/o errores en introducción de datos

    var inicio = `BIENVENIDO!! <br> El juego va a comenzar: <br> El tablero contiene <b>${buscaminas.numMinasTotales}</b> minas !! Encuentralas y ganaras !<br> Suerte Jugador`
    document.getElementById("mensaje").innerHTML = inicio;

    //En caso de existir un tablero ya pintado, lo borramos y pintamos el nuevo.
    while (tablero.firstChild) {
        tablero.firstChild.removeEventListener("click", destapar);
        tablero.removeChild(tablero.firstChild);
    }

    //Establecemos el número de filas y columnas en el estilo del Html
    document.querySelector("html").style.setProperty("--num-filas", buscaminas.numFilas);
    document.querySelector("html").style.setProperty("--num-columnas", buscaminas.numColumnas);

    //Dibujamos mediante Divs el tablero que se muestra al jugador
    for (let f = 0; f < buscaminas.numFilas; f++) {
        for (let c = 0; c < buscaminas.numColumnas; c++) {
            let newDiv = document.createElement("div");
            newDiv.setAttribute("id", "f" + f + "_c" + c);
            newDiv.dataset.fila = f;
            newDiv.dataset.columna = c;

            newDiv.addEventListener("click", destapar); //evento para cada casilla con el botón izquierdo del raton

            tablero.appendChild(newDiv);


        }
    }

}

/*
 Creamos campo de minas como array, segun número de filas y columnas seleccionadas
*/
function generarCampoMinasVacio() {
    buscaminas.aCampoMinas = new Array(buscaminas.numFilas);
    for (let fila = 0; fila < buscaminas.numFilas; fila++) {
        buscaminas.aCampoMinas[fila] = new Array(buscaminas.numColumnas);
    }
}

/*
Repartimos minas de forma aleatoria con funciones Math
*/
function repartirMinas() {
    let numMinasColocadas = 0;

    while (numMinasColocadas < buscaminas.numMinasTotales) {
        let fila = Math.floor(Math.random() * buscaminas.numFilas);
        let columna = Math.floor(Math.random() * buscaminas.numColumnas);

        //Importante!: Comprobamos que no haya una mina en esa casilla ya.
        if (buscaminas.aCampoMinas[fila][columna] != "B") {
            //situamos mina
            buscaminas.aCampoMinas[fila][columna] = "B";
            numMinasColocadas++;
        }
    }
}


// Accion del evento al clickar sobre una casilla
function destapar(miEvento) {
    if (miEvento.type === "click") {
        let casilla = miEvento.currentTarget;
        let fila = parseInt(casilla.dataset.fila, 10);
        let columna = parseInt(casilla.dataset.columna, 10)

        if (buscaminas.numIntentos <= 0 || buscaminas.numMinasEncontradas >= buscaminas.numMinasTotales) {
            finPartida();
        } else {
            destaparCasilla(fila, columna);

        }
    }
}

/* 
Obtenemos los parametros y destapamos la casilla sobre la que hemos hecho click 
Se contrasta el contenido con nuestro mapa de minas y se ofrece una respuesta segun resultado
*/
function destaparCasilla(fila, columna) {
    console.log("Destapamos la casilla con fila" + fila + " y la columna" + columna);

    if (fila > -1 && fila < buscaminas.numFilas && columna > -1 && columna < buscaminas.numColumnas) {
        // obtenemos la casilla con la fila y columna
        let casilla = document.querySelector("#f" + fila + "_c" + columna);

        //Comprobamos que la casilla no esté destapada
        if (!casilla.classList.contains("destapado")) {
            casilla.classList.add("destapado");

            //Descontamos 1 intento, cuando pulsa una casilla que no haya sido destapada.
            buscaminas.numIntentos = buscaminas.numIntentos - 1;
            document.getElementById("intentos").value = buscaminas.numIntentos;

            if (buscaminas.aCampoMinas[fila][columna] != "B") {

                casilla.classList.add("vacio")


            } else if (buscaminas.aCampoMinas[fila][columna] == "B") {
                casilla.classList.add("bomba")
                casilla.innerHTML = "B";
                buscaminas.numMinasEncontradas = buscaminas.numMinasEncontradas + 1;
                alert(`Has encontrado una mina \n ¡¡¡ Cuidado! NO la pises !!! `)
                document.getElementById("minas").value = buscaminas.numMinasEncontradas;
                if (buscaminas.numMinasEncontradas >= buscaminas.numMinasTotales) {
                    finPartida();
                }

            }
        } else {
            alert("La casilla seleccionada ya ha sido destapada\n Seleccione otra casilla")
        }
        if (buscaminas.numIntentos <= 0 || buscaminas.numMinasEncontradas >= buscaminas.numMinasTotales) {
            finPartida();
        }

    }
}

//Mostramos mensajes en función del motivo por el cual haya finalizado la partida, en nuestro caso fin de partida por Intentos o por encontrar Todas las Minas
function finPartida() {

    if (buscaminas.numIntentos <= 0) {
        document.getElementById("mensaje").classList.add("mensaje_error");
        error = "<b><u>FIN DE PARTIDA: número de intentos agotado</u></b> <br>"
        error += `Has encontrado ${buscaminas.numMinasEncontradas} minas <br> Buen intento!`
            //alert(error); En caso de querer mostrarlo mediante alert pero deberia ser formateado el texto

        // Lo mostramos aprovechando el cuadro de mensaje y cambiando sus propiedades
        document.getElementById("mensaje").innerHTML = error;
    }

    if (buscaminas.numMinasEncontradas >= buscaminas.numMinasTotales) {
        document.getElementById("mensaje").classList.add("mensaje_exito");
        var victoria = `¡¡ENHORABUENA!! Menuda Potra <br> Has encontrado las ${buscaminas.numMinasTotales} minas !! <br> Eres un gran zapador`
            //alert(victoria) //En caso de querer mostrarlo mediante alert

        //Visualmente nos gusta más mostrarlo mediante el cuadro de mensaje accediendo a las propiedades del mismo
        document.getElementById("mensaje").innerHTML = victoria;


    }
    return;
}

//Descubrimos el tablero completo destapando casillas con minas y casillas vacias, con su respectivo formato.
function rendirse() {
    for (let f = 0; f < buscaminas.numFilas; f++) {
        for (let c = 0; c < buscaminas.numColumnas; c++) {
            let casilla = document.querySelector("#f" + f + "_c" + c);
            if (!casilla.classList.contains("destapado")) {
                casilla.classList.add("destapado");


                if (buscaminas.aCampoMinas[f][c] != "B") {
                    casilla.classList.add("vacio")

                } else if (buscaminas.aCampoMinas[f][c] == "B") {
                    casilla.classList.add("bomba")
                    casilla.innerHTML = "B";
                    document.getElementById("minas").value = buscaminas.numMinasTotales;

                }

            }
        }
    }
}

/*
Mostramos un ! encima de las casillas que contienen una mina, pero sin destaparla, 
en caso de estar ya destapada o no contener mina no hace nada
*/
function mostrarMinas() {
    for (let f = 0; f < buscaminas.numFilas; f++) {
        for (let c = 0; c < buscaminas.numColumnas; c++) {
            let casilla = document.querySelector("#f" + f + "_c" + c);
            if (buscaminas.aCampoMinas[f][c] == "B" && !casilla.classList.contains("destapado")) {
                casilla.innerHTML = "!";
                casilla.classList.add("bomba-detectada");

            }
        }
    }
}

//Limpiamos los formatos de partidas o intentos anteriores
function eliminarFormatos() {
    document.getElementById("mensaje").classList.remove("mensaje_error");
    document.getElementById("mensaje").classList.remove("mensaje_exito");
    document.getElementById("mensaje").classList.remove("mensaje_aviso");

}

function reiniciar() {
    location.reload(true); // Recargamos la página completa para "reiniciar" todo de forma rapida
}