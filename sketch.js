const celdas = [];
let RETICULAX = document.getElementById("cellSize").value;
let RETICULAY;
let ancho; //ancho de la celda
let alto; //alto de la celda
const startButton = document.getElementById("start");

const azulejos = [];

const reglas = [
  { UP: 0, RIGHT: 1, DOWN: 0, LEFT: 0 }, // Tile 0
  { UP: 0, RIGHT: 0, DOWN: 0, LEFT: 1 }, // Tile 1
  { UP: 0, RIGHT: 1, DOWN: 0, LEFT: 0 }, // Tile 2
  { UP: 0, RIGHT: 2, DOWN: 0, LEFT: 1 }, // Tile 3
  { UP: 0, RIGHT: 3, DOWN: 0, LEFT: 0 }, // Tile 4
  { UP: 0, RIGHT: 0, DOWN: 0, LEFT: 3 }, // Tile 5
  { UP: 0, RIGHT: 0, DOWN: 0, LEFT: 0 }, // Tile 6
  { UP: 0, RIGHT: 0, DOWN: 0, LEFT: 0 }, // Tile 7
  { UP: 0, RIGHT: 0, DOWN: 0, LEFT: 0 }, // Tile 8
  { UP: 0, RIGHT: 0, DOWN: 0, LEFT: 0 }, // Tile 9
  { UP: 0, RIGHT: 0, DOWN: 0, LEFT: 0 }, // Tile 10
  { UP: 0, RIGHT: 0, DOWN: 0, LEFT: 0 }, // Tile 11
  { UP: 0, RIGHT: 0, DOWN: 0, LEFT: 0 }, // Tile 12
  { UP: 0, RIGHT: 0, DOWN: 0, LEFT: 0 }, // Tile 13
  { UP: 11, RIGHT: 0, DOWN: 0, LEFT: 0 }, // Tile 14
  { UP: 0, RIGHT: 5, DOWN: 0, LEFT: 0 }, // Tile 15
  { UP: 0, RIGHT: 0, DOWN: 0, LEFT: 2 }, // Tile 16
  { UP: 0, RIGHT: 1, DOWN: 0, LEFT: 0 }, // Tile 17
  { UP: 0, RIGHT: 0, DOWN: 0, LEFT: 1 }, // Tile 18
  { UP: 0, RIGHT: 0, DOWN: 0, LEFT: 0 }, // Tile 19
  { UP: 0, RIGHT: 1, DOWN: 0, LEFT: 0 }, // Tile 20
  { UP: 0, RIGHT: 0, DOWN: 0, LEFT: 1 }, // Tile 21
  { UP: 0, RIGHT: 4, DOWN: 0, LEFT: 0 }, // Tile 22
  { UP: 0, RIGHT: 0, DOWN: 0, LEFT: 4 }, // Tile 23
  { UP: 0, RIGHT: 0, DOWN: 0, LEFT: 0 }, // Tile 24
  { UP: 0, RIGHT: 0, DOWN: 0, LEFT: 0 }, // Tile 25
  { UP: 0, RIGHT: 1, DOWN: 0, LEFT: 0 }, // Tile 26
  { UP: 0, RIGHT: 0, DOWN: 0, LEFT: 1 }, // Tile 27
  { UP: 0, RIGHT: 0, DOWN: 0, LEFT: 5 }, // Tile 28
  { UP: 0, RIGHT: 6, DOWN: 0, LEFT: 0 }, // Tile 29
  { UP: 0, RIGHT: 0, DOWN: 0, LEFT: 6 }, // Tile 30
  { UP: 0, RIGHT: 0, DOWN: 0, LEFT: 0 }, // Tile 31
];

const NA = reglas.length; //numero de azulejos

function preload() {
  for (let i = 0; i < NA; i++) {
    azulejos[i] = loadImage(`azulejos1/tile${i}.png`);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  ancho = width / RETICULAX;
  alto = ancho;
  RETICULAY = Math.floor(height / ancho);

  let opcionesI = [];
  for (let i = 0; i < azulejos.length; i++) {
    opcionesI.push(i);
  }
  for (let i = 0; i < RETICULAX * RETICULAY; i++) {
    celdas[i] = {
      colapsada: false,
      opciones: opcionesI,
    };
  }
  //print(celdas);
  //celdas[8].colapsada = true;
  //celdas[3].colapsada = true;
  startButton.addEventListener("click", resetAll);
}

function draw() {
  const celdasConOpciones = celdas.filter((celda) => {
    return celda.opciones.length > 0;
  });

  const celdasDisponibles = celdasConOpciones.filter(
    (celda) => celda.colapsada == false
  );
  if (celdasDisponibles.length > 0) {
    celdasDisponibles.sort((a, b) => a.opciones.length - b.opciones.length);
    const celdasPorColapsar = celdasDisponibles.filter((celda) => {
      return celda.opciones.length == celdasDisponibles[0].opciones.length;
    });

    const celdaSeleccionada = random(celdasPorColapsar);
    celdaSeleccionada.colapsada = true;

    const opcionSeleccionada = random(celdaSeleccionada.opciones);
    celdaSeleccionada.opciones = [opcionSeleccionada];

    //print(celdaSeleccionada);

    for (let x = 0; x < RETICULAX; x++) {
      for (let y = 0; y < RETICULAY; y++) {
        const celdaIndex = x + y * RETICULAX;
        const celdaActual = celdas[celdaIndex];
        if (celdaActual.colapsada) {
          const indiceDeAzulejo = celdaActual.opciones[0];
          const reglasActuales = reglas[indiceDeAzulejo];
          //print(reglasActuales);
          image(azulejos[indiceDeAzulejo], x * ancho, y * alto, ancho, alto);
          //Cambiar entropía UP
          if (y > 0) {
            const indeceUP = x + (y - 1) * RETICULAX;
            const celdaUP = celdas[indeceUP];
            if (!celdaUP.colapsada) {
              cambiarEntropia(celdaUP, reglasActuales["UP"], "DOWN");
            }
          }
          //Cambiar entropía RIGHT
          if (x < RETICULAX - 1) {
            const indeceRIGHT = x + 1 + y * RETICULAX;
            const celdaRIGHT = celdas[indeceRIGHT];
            if (!celdaRIGHT.colapsada) {
              cambiarEntropia(celdaRIGHT, reglasActuales["RIGHT"], "LEFT");
            }
          }
          //Cambiar entropía DOWN
          if (y < RETICULAY - 1) {
            const indeceDOWN = x + (y + 1) * RETICULAX;
            const celdaDOWN = celdas[indeceDOWN];
            if (!celdaDOWN.colapsada) {
              cambiarEntropia(celdaDOWN, reglasActuales["DOWN"], "UP");
            }
          }
          //Cambiar entropía LEFT
          if (x > 0) {
            const indeceLEFT = x - 1 + y * RETICULAX;
            const celdaLEFT = celdas[indeceLEFT];
            if (!celdaLEFT.colapsada) {
              cambiarEntropia(celdaLEFT, reglasActuales["LEFT"], "RIGHT");
            }
          }
        } else {
          //rect(x * ancho, y * alto, ancho, alto);
        }
      }
    }
  }
  //noLoop();
}

function cambiarEntropia(_celda, _regla, _opuesta) {
  const nuevasOpciones = [];
  for (let i = 0; i < _celda.opciones.length; i++) {
    if (_regla == reglas[_celda.opciones[i]][_opuesta]) {
      const celdaCompatible = _celda.opciones[i];
      nuevasOpciones.push(celdaCompatible);
    }
  }
  _celda.opciones = nuevasOpciones;
  print(nuevasOpciones);
}

function resetAll() {
  RETICULAX = document.getElementById("cellSize").value;
  ancho = width / RETICULAX;
  alto = ancho;
  RETICULAY = Math.floor(height / ancho);

  background(240);

  let opcionesI = [];
  for (let i = 0; i < azulejos.length; i++) {
    opcionesI.push(i);
  }
  for (let i = 0; i < RETICULAX * RETICULAX; i++) {
    celdas[i] = {
      colapsada: false,
      opciones: opcionesI,
    };
  }
}
