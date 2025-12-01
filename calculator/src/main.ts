let current = '';
let operator = '';
let memory = 0;

const display = document.getElementById('display') as HTMLOutputElement;

function updateDisplay(value: string) {
  display.value = value;
}

function handleDigit(digit: string) {
  current += digit;
  updateDisplay(current);
}

function handleOperator(op: string) {
  if (current === '') return;
  operator = op;
  memory = parseFloat(current);
  current = '';
}

function calculate() {
  const num = parseFloat(current);
  let result = 0;
  switch (operator) {
    case '+': result = memory + num; break;
    case '−': result = memory - num; break;
    case '×': result = memory * num; break;
    case '÷': result = memory / num; break;
    case '^': result = Math.pow(memory, num); break;
  }
  current = result.toString();
  updateDisplay(current);
  operator = '';
}

function handleAction(action: string) {
  switch (action) {
    case 'clear':
      current = '';
      operator = '';
      updateDisplay('0');
      break;

    // Basic operators
    case 'add': handleOperator('+'); break;
    case 'subtract': handleOperator('−'); break;
    case 'multiply': handleOperator('×'); break;
    case 'divide': handleOperator('÷'); break;
    case 'equals': calculate(); break;

    // Decimal point
    case 'decimal':
      if (!current.includes('.')) {
        current = current === '' ? '0.' : current + '.';
        updateDisplay(current);
      }
      break;

    // Memory functions
    case 'mc': memory = 0; break;
    case 'mplus': memory += parseFloat(current || '0'); break;
    case 'mminus': memory -= parseFloat(current || '0'); break;
    case 'mr': current = memory.toString(); updateDisplay(current); break;

    // Scientific functions
    case 'sqrt':
      current = Math.sqrt(parseFloat(current || '0')).toString();
      updateDisplay(current);
      break;
    case 'pow':
      handleOperator('^');
      break;
    case 'sin':
      current = Math.sin(parseFloat(current || '0')).toString();
      updateDisplay(current);
      break;
    case 'cos':
      current = Math.cos(parseFloat(current || '0')).toString();
      updateDisplay(current);
      break;
    case 'tan':
      current = Math.tan(parseFloat(current || '0')).toString();
      updateDisplay(current);
      break;
    case 'log':
      current = Math.log10(parseFloat(current || '0')).toString();
      updateDisplay(current);
      break;
    case 'ln':
      current = Math.log(parseFloat(current || '0')).toString();
      updateDisplay(current);
      break;
    case 'pi':
      current += Math.PI.toString();
      updateDisplay(current);
      break;
  }
}

document.querySelectorAll('button').forEach(button => {
  button.addEventListener('click', () => {
    const action = button.getAttribute('data-action');
    if (action) {
      handleAction(action);
    } else {
      handleDigit(button.textContent!);
    }
  });
});
