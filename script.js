let pantalla = document.getElementById("pizarra").getContext("2d");
pantalla.fillStyle = "#F3F5FC";
let largoCanvas = 1000;
let altoCanvas = 520;
pantalla.fillRect(0, 0, largoCanvas, altoCanvas);
pantalla.lineWidth = 5;
pantalla.lineCap = "round";
pantalla.lineJoin = "round";
pantalla.strokeStyle = "#0A3871";

// Variables con las palabras por defecto y otra vacía para el sorteo, además intentos
let palabras = ["ALURA", "CSS", "HTML", "AUTO", "NOTEBOOK", "TELEFONO", "AÑEJO"];
let palabra = "";
let intentos = 7;

// Variables para dibujar las lineas y letras
let inicioDeDibujoEnX = largoCanvas / 2;    // dibujo: linea o letra
let largoLinea = 50;
let largoEspacioEntreLinea = 20;
let separacionEnX = largoLinea + largoEspacioEntreLinea;    //70
let siguienteDibujoEnX = "";

// Otras variables de uso
let letrasCorrectas = [];
let letrasCorrectasNoRepetidas = [];
let letrasIncorrectas = [];
let seguirElJuego = true;

// Al presionar botón "Iniciar Juego"
function empezar() {
    document.getElementById("ocultarBotonesPrincipales").style.display="none";
    document.getElementById("mostrarCanvas").style.display="block";
    document.getElementById("msgTactilId").style.color="#0A3871";
    /* 
    SortearPalabra();
    dibujarBase();
    dibujarLineas(); */
    // Uso reiniciar() en lugar de las fc de arriba para que no queden superposiciones
    // de canvas al navegar la página sin recargar.
    reiniciar();
}

document.getElementById("btnGuardar").onclick = () => {
    guardarPalabra();
}

// Para móviles/pantallas táctiles. Utilizo un input
function tomarLetra(){
    let letraTactil = document.getElementById("inputTactil").value.toUpperCase();
    let letraTactilCode = letraTactil.charCodeAt();

    if(letraTactil == "Ñ" && seguirElJuego) {
        verificarLetra(letraTactil);
    } else if(letraTactilCode >= 65 && letraTactilCode <= 90 && seguirElJuego) {
        letraTactilCode = String.fromCharCode(letraTactilCode);
        verificarLetra(letraTactilCode);
    }
    document.getElementById("inputTactil").value = "";
    document.getElementById("inputTactil").focus();

}

// Guarda la palabra que el usuario quiere agregar
function guardarPalabra() {
    //captura lo que el usuario ha escrito
    let nuevaPalabra = document.getElementById("textoEscrito").value;
    //expresion regular para validar lo escrito(sin espacios, acentos ni números)
    let expreg = /^[A-Za-z]+$/;
    let valido = expreg.test(nuevaPalabra);
  
    //agrega la palabra al array de las palabras a sortear
    if(nuevaPalabra !== "" && valido && nuevaPalabra.length > 2 && nuevaPalabra.length <= 8){
        palabras.push(nuevaPalabra.toUpperCase());
        alert("*La palabra fue guardada \n*Comienza el juego!😀");
        document.getElementById("textoEscrito").value = "";

        //hace que los componentes de la pantalla de agregar palabra desaparezcan
        document.getElementById("mostrarAgregarPalabra").style.display="none";
        empezar();
    }
    else{
      alert("*Ninguna palabra ha sido escrita o, \n*No cumple lo requerido \n* 🫤");
    }
}

// Lo primero que se hace al empezar
function SortearPalabra() {
    let sorteo = Math.floor(Math.random() * palabras.length);
    palabra = palabras[sorteo];
}

// A través de keydown estoy "escuchando" si se presiona una tecla, y la toma
// directamente en mayúscula, distinto de keypress que reconoce mayus o minúscula
document.addEventListener("keydown", (e) => {
    let letra = e.keyCode;
    
    if((letra >= 65 && letra <= 90) || letra == 192) {
        if(letra == 192) {
            letra = "Ñ";
        } else {
            letra = String.fromCharCode(letra);
        }
        if (seguirElJuego) {
            verificarLetra(letra);
        }
    }
})

function verificarLetra(letra) {
    let esLetraCorrecta = false;
    
    for (let i = 0; i < palabra.length; i++) {
        /* siguienteDibujoEnX = inicioDeDibujoEnX;
        siguienteDibujoEnX += i * separacionEnX; 
        otra forma de hacerlo y luego envío siguienteDibujoEnX en lugar de valorDeX*/
        siguienteDibujoEnX = i * separacionEnX;
        let valorDeX = inicioDeDibujoEnX + siguienteDibujoEnX;
        if (letra === palabra[i] && !letrasCorrectasNoRepetidas.includes(letra)) {
            letrasCorrectas.push(letra);
            dibujarLetraCorrecta(letra, valorDeX);
            esLetraCorrecta = true;
        } 
    }
    if (esLetraCorrecta) {
        letrasCorrectasNoRepetidas.push(letra);
    } 
    else if (!letrasIncorrectas.includes(letra) && !letrasCorrectasNoRepetidas.includes(letra)) {
        letrasIncorrectas.push(letra);
        //siempre son 7 intentos/letras => 7*30(espacio)=210. 210/2=105 para cada
        //lado de la mitad, sería 500-105=395 pero como letrasIncorrectas.length
        //empieza en 1 => le resto un espacio, 395-30=365. Así queda centrado
        dibujarLetraIncorrecta(letra, 365 + (letrasIncorrectas.length * 30));
        intentos -= 1;
        dibujarEtapa();
    }
    verificarJuego();
}

function dibujarEtapa() {
    pantalla.lineWidth = 5;
    switch (intentos) {
        case 0:
            dibujarPiernaDerecha();
            break;
        case 1:
            dibujarPiernaIzquierda();
            break;
        case 2:
            dibujarBrazoDerecho();
            break;
        case 3:
            dibujarBrazoIzquierdo();
            break;
        case 4:
            dibujarCuerpo();
            break;
        case 5:
            dibujarCabeza();
            break;
        case 6:
            dibujarHorca();
            break;
        default:
            break;
    }
}

function verificarJuego() {
    if(letrasCorrectas.length == palabra.length) {
        mostrarGanaste();
        seguirElJuego = false;
    }
    else if(intentos == 0)  {
        mostrarPerdiste();
        seguirElJuego = false;
    }
}

// ===================== BOTONES =======================
function reiniciar() {
    pantalla.fillStyle="#F3F5FC";
    pantalla.fillRect(0, 0, largoCanvas, altoCanvas);
    //al usar textAlign center en el cartel de perdiste, debo resetear
    //para ubicar bien las letras correctas, por eso uso textAlign start
    pantalla.textAlign="start";
    pantalla.lineWidth = 5;
    palabra = "";
    intentos = 7;
    inicioDeDibujoEnX = largoCanvas / 2;    // dibujo: linea o letra
    siguienteDibujoEnX = "";
    letrasCorrectas = [];
    letrasCorrectasNoRepetidas = [];
    letrasIncorrectas = [];
    seguirElJuego = true;
    SortearPalabra();
    dibujarBase();
    dibujarLineas();
}

function mostrarAgregarPalabra() {
    document.getElementById("ocultarBotonesPrincipales").style.display="none";
    document.getElementById("mostrarAgregarPalabra").style.display="block";
}

// Vuelve al inicio sin recargar la pág., resetea el input y cancela seguirElJuego
function volverInicioDesdeGuardarPalabra() {
    document.getElementById("ocultarBotonesPrincipales").style.display="block";
    document.getElementById("mostrarAgregarPalabra").style.display="none";
    document.getElementById("textoEscrito").value = "";
    seguirElJuego = false;
}

// Vuelve al inicio sin recargar la pág. y cancela seguirElJuego
function volverInicioDesdeCanvas() {
    document.getElementById("ocultarBotonesPrincipales").style.display="block";
    document.getElementById("mostrarCanvas").style.display="none";
    // oculto el msg usando el mismo color de fondo
    document.getElementById("msgTactilId").style.color="#F3F5FC";
    seguirElJuego = false;
    
    // Al navegar sin recargar la pág. las palabras nuevas que ingreso siguen vigentes.
}

// =============== DIBUJOS DEL CANVAS ================

// Dibujo la base de la horca
function dibujarBase() {
    pantalla.beginPath();
    pantalla.moveTo(300, 350);
    pantalla.lineTo(700, 350);
    pantalla.stroke();
    pantalla.closePath();
}

// Función para crear cantidad de lineas de acuerdo a la palabra sorteada
/* Para que el total de lineas de la palabra quede centrado respecto de la base de 
la horca y del largo del canvas.
Explicación: El largo total del canvas es de 1000, cada linea mide 50 y cada espacio 
mide 20. Depende la cantidad de letras hago la cuenta, ej con 3 letras: 50+20+50+20+50 o,
((cantidad de letras * 70) - espacio). A eso lo divido en 2 y se lo resto a la mitad
de 1000 para que salga centrado. (3*70)-20=190, /2= 95. 1000/2=500 => 500-95=405, que
marca el comienzo de x (let inicioDeDibujoEnX) para la primera linea. 
405 + 190(letras+espacios) = 595 y faltarían 405, que es justo la medida donde empecé,
para llegar a 1000. 1000=405+190+405. */
function dibujarLineas() {
    inicioDeDibujoEnX -= (palabra.length * separacionEnX - largoEspacioEntreLinea) / 2;
    for (let i = 0; i < palabra.length; i++) {
        siguienteDibujoEnX = i * separacionEnX;
        let valorDeX = inicioDeDibujoEnX + siguienteDibujoEnX;
        crearLinea(valorDeX);
    }
}

// Función para crear cada linea de la palabra debajo de la base de la horca
function crearLinea(valorDeX) {
    pantalla.beginPath();
    pantalla.moveTo(valorDeX, 450);
    pantalla.lineTo(valorDeX + 50, 450); //puse +50 porque 50 es la medida de la linea
    pantalla.stroke();
    pantalla.closePath();
}

// si uso strokeText puedo usar lineWidth para que la letra quede hueca.
// http://w3.unpocodetodo.info/canvas/text.php
function dibujarLetraCorrecta(letra, valorDeX) {
    pantalla.strokeStyle = "#0A3871";
    pantalla.lineWidth = 3;
    pantalla.font = "60px Verdana";
    pantalla.strokeText(letra, valorDeX + 5, 435, 40);
}

function dibujarLetraIncorrecta(letra, valorDeX) {
    pantalla.fillStyle = "#0A3871";
    pantalla.font = "bold 30px Inter";
    pantalla.fillText(letra, valorDeX + 5, 490, 40);
}

function mostrarGanaste() {
    pantalla.font = "bold 64px Inter";
    pantalla.fillStyle="green"
    pantalla.fillText("Ganaste,",670,120)
    pantalla.fillText("Felicidades!",630,200)
}

function mostrarPerdiste() {
    pantalla.textAlign="center";
    pantalla.font = "bold 64px Inter";
    pantalla.fillStyle="red"
    pantalla.fillText("Perdiste!",800,100);
    pantalla.fillText("Fin del juego!",800,170);

    //muestra cual era la palabra
    pantalla.font = "bold 48px Inter";
    pantalla.fillStyle="blue"
    pantalla.fillText("La palabra era:",800,250);
    pantalla.fillText(palabra,800,310);
}

// =============== DIBUJOS DE LA HORCA Y EL MUÑECO ================
function dibujarHorca() {
    pantalla.beginPath();
    pantalla.moveTo(350, 350);
    pantalla.lineTo(350, 3);
    pantalla.lineTo(550, 3);
    pantalla.lineTo(550, 50);
    pantalla.stroke();
    pantalla.closePath();
}

function dibujarCabeza() {
    pantalla.beginPath();
    pantalla.arc(550, 80, 30, 0, 2*3.14);
    pantalla.stroke();
    pantalla.closePath();
}

function dibujarCuerpo() {
    pantalla.beginPath();
    pantalla.moveTo(550, 110);
    pantalla.lineTo(550, 230);
    pantalla.stroke();
    pantalla.closePath();
}

function dibujarBrazoIzquierdo() {
    pantalla.beginPath();
    pantalla.moveTo(550, 130);
    pantalla.lineTo(500, 170);
    pantalla.stroke();
    pantalla.closePath();
}

function dibujarBrazoDerecho() {
    pantalla.beginPath();
    pantalla.moveTo(550, 130);
    pantalla.lineTo(600, 170);
    pantalla.stroke();
    pantalla.closePath();
}

function dibujarPiernaIzquierda() {
    pantalla.beginPath();
    pantalla.moveTo(550, 230);
    pantalla.lineTo(500, 280);
    pantalla.stroke();
    pantalla.closePath();
}

function dibujarPiernaDerecha() {
    pantalla.beginPath();
    pantalla.moveTo(550, 230);
    pantalla.lineTo(600, 280);
    pantalla.stroke();
    pantalla.closePath();
}