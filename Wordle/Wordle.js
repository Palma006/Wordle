// Cargar las palabras desde el archivo JSON
let palabras = [];
fetch('Wordle.json')
  .then(response => response.json())
  .then(data => {
    palabras = data.palabras;
    iniciarJuego();
  })
  .catch(error => console.error("Error al cargar las palabras:", error));

let palabraOculta;
let intentos = 0;
const maxIntentos = 5;
const gridContainer = document.getElementById('grid-container');
const message = document.getElementById('message');
const restartBtn = document.getElementById('restart-btn');

// Iniciar un nuevo juego
function iniciarJuego() {
  palabraOculta = palabras[Math.floor(Math.random() * palabras.length)];
  let longitud = palabraOculta.length;
  gridContainer.style.gridTemplateColumns = `repeat(${longitud}, 50px)`;
  intentos = 0;
  gridContainer.innerHTML = '';
  message.textContent = '';
  
  // Crear la cuadrícula de 5x5
  for (let i = 0; i < maxIntentos; i++) {
    let row = document.createElement('div');
    row.classList.add('row');
    for (let j = 0; j < palabraOculta.length; j++) {
      let input = document.createElement('input');
      input.maxLength = 1;
      input.disabled = false;
      input.addEventListener('input', handleInput);
      input.addEventListener('keydown', handleInput);
      row.appendChild(input);
    }
    gridContainer.appendChild(row);
  }
}

// Manejar la entrada del usuario
function handleInput(e) {
  const input = e.target;
  const row = input.parentElement;
  const inputs = Array.from(row.children);

  if (e.key === "Enter") {
    console.log("Han pulsado el intro");

    // Validamos que los imputs están llenos
    if (inputs.some(input => input.value === '')) {
      message.textContent = "Por favor, ingresa todas las letras.";
      return;
    }

    // Validamos si el intento es correcto o no
    validarIntento(inputs.map(input => input.value).join(''));

    // Si aún le quedan intentos, pasamos al siguiente intento
    if (intentos < maxIntentos) {
      // Preparamos para el siguiente intento
      const siguienteFila = document.querySelectorAll('.row')[intentos];
      Array.from(siguienteFila.children).forEach(input => input.disabled = false);
      siguienteFila.children[0].focus(); // Enfocar al primer input de la siguiente fila
    }
  }

  if (e.key === "Backspace") {
    console.log("Se ha pulsado el borrado");

    // Cogemos el índice del input y le restamos uno para ir al anterior si es mayor que 0.
    const currentIndex = inputs.indexOf(input);
    if (currentIndex > 0) {
      const prevInput = inputs[currentIndex - 1];
      prevInput.value = '';  // Limpiar el valor
      prevInput.focus();  // Enfocar el anterior
    }
  }

  // Si el usuario escribe algo en el input, pasa al siguiente
  if (input.value.length === 1) {
    // Encontrar el siguiente input en la misma fila
    const nextInput = inputs[inputs.indexOf(input) + 1];
    if (nextInput) {
      nextInput.focus(); // Enfocar el siguiente input
    }
  }

  // Verificar si todos los inputs de la fila están llenos
  if (inputs.every(input => input.value.length === 1)) {
    // Deshabilitar los inputs de la fila completa para evitar más cambios
    inputs.forEach(input => input.disabled = true);
    validarIntento(inputs.map(input => input.value).join(''));
  }
}

// Validar el intento
function validarIntento(intento) {
  intentos++;
  const row = document.querySelectorAll('.row')[intentos - 1];
  const inputs = Array.from(row.children);
  let aciertos = 0;
  
  [...intento].forEach((letra, index) => {
    if (letra === palabraOculta[index]) {
      inputs[index].classList.add('correct');
      aciertos++;
    } else if (palabraOculta.includes(letra)) {
      inputs[index].classList.add('misplaced');
    } else {
      inputs[index].classList.add('incorrect');
    }
  });

  if (aciertos === palabraOculta.length) {
    message.textContent = "¡Has ganado!";
  } else if (intentos === maxIntentos) {
    message.textContent = `Has perdido. La palabra era: ${palabraOculta}`;
  }
}

// Botón de reiniciar
restartBtn.addEventListener('click', () => {
  iniciarJuego();
});
