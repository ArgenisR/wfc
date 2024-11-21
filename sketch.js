const celdas = [];
const RETICULA = 10;
const azulejos = [];
const NA = 11; // número de azulejos
const reglas = [
  //tail 0
  { UP: 0, RIGHT: 0, DOWN: 0, LEFT: 0 },
  //tail 1
  { UP: 1, RIGHT: 1, DOWN: 1, LEFT: 0 },
  //tail 2
  { UP: 0, RIGHT: 1, DOWN: 1, LEFT: 1 },
  //tail 3
  { UP: 1, RIGHT: 1, DOWN: 0, LEFT: 1 },
  //tail 4
  { UP: 1, RIGHT: 0, DOWN: 1, LEFT: 1 },
  //tail 5
  { UP: 1, RIGHT: 0, DOWN: 0, LEFT: 1 },
  //tail 6
  { UP: 1, RIGHT: 1, DOWN: 0, LEFT: 0 },
  //tail 7
  { UP: 0, RIGHT: 0, DOWN: 1, LEFT: 1 },
  //tail 8
  { UP: 0, RIGHT: 1, DOWN: 1, LEFT: 0 },
  //tail 9
  { UP: 1, RIGHT: 1, DOWN: 1, LEFT: 1 },
  //tail 10
  { UP: 0, RIGHT: 0, DOWN: 0, LEFT: 0 },
];

function preload() {
  for (let i = 0; i < NA; i++) {
    azulejos[i] = loadImage("azulejos/tile" + i + ".png");
  }
}

function setup() {
  createCanvas(1080, 1080);
  inicializarCeldas();
}

function draw() {
  background(220);

  const celdasDisponibles = celdas.filter((celda) => !celda.colapsada);
  if (celdasDisponibles.length > 0) {
    celdasDisponibles.sort((a, b) => a.opciones.length - b.opciones.length);

    const celdasPorColapsar = celdasDisponibles.filter((celda) => {
      return celda.opciones.length === celdasDisponibles[0].opciones.length;
    });

    const celdaSeleccionada = random(celdasPorColapsar);
    celdaSeleccionada.colapsada = true;

    const opcionSeleccionada = random(celdaSeleccionada.opciones);
    celdaSeleccionada.opciones = [opcionSeleccionada];

    for (let x = 0; x < RETICULA; x++) {
      for (let y = 0; y < RETICULA; y++) {
        const celdaIndex = x + y * RETICULA;
        const celdaActual = celdas[celdaIndex];

        if (celdaActual.colapsada) {
          const indiceDeAzulejo = celdaActual.opciones[0];
          const reglasActuales = reglas[indiceDeAzulejo];

          image(azulejos[indiceDeAzulejo], x * ancho, y * alto, ancho, alto);

          actualizarEntropia(x, y, reglasActuales);
        } else {
          stroke(0);
          noFill();
          rect(x * ancho, y * alto, ancho, alto);
        }
      }
    }
  } else {
    inicializarCeldas(); // Reinicia las celdas cuando todas están colapsadas
  }
}

function inicializarCeldas() {
  ancho = width / RETICULA;
  alto = height / RETICULA;

  let opcionesI = [];
  for (let i = 0; i < azulejos.length; i++) {
    opcionesI.push(i);
  }

  for (let i = 0; i < RETICULA * RETICULA; i++) {
    celdas[i] = {
      colapsada: false,
      opciones: opcionesI.slice(), // Crear una copia de las opciones iniciales
    };
  }
}

function actualizarEntropia(x, y, reglasActuales) {
  const direcciones = [
    { dx: 0, dy: -1, lado: "UP", opuesto: "DOWN" },
    { dx: 1, dy: 0, lado: "RIGHT", opuesto: "LEFT" },
    { dx: 0, dy: 1, lado: "DOWN", opuesto: "UP" },
    { dx: -1, dy: 0, lado: "LEFT", opuesto: "RIGHT" },
  ];

  for (const dir of direcciones) {
    const nx = x + dir.dx;
    const ny = y + dir.dy;

    if (nx >= 0 && nx < RETICULA && ny >= 0 && ny < RETICULA) {
      const vecinoIndex = nx + ny * RETICULA;
      const celdaVecina = celdas[vecinoIndex];

      if (!celdaVecina.colapsada) {
        const nuevasOpciones = celdaVecina.opciones.filter((opcion) => {
          return reglas[opcion][dir.opuesto] === reglasActuales[dir.lado];
        });
        celdaVecina.opciones = nuevasOpciones;
      }
    }
  }
}
