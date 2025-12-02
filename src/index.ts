let current = '';
let memory = 0;
let expression = '';

const display = document.getElementById('display') as HTMLOutputElement;

function updateDisplay(value: string) {
  display.value = value;
}

function handleDigit(digit: string) {
  const last = expression.slice(-1);
  if (last === ')') {
    expression += ' × ';
  }
  expression += digit;
  current += digit;
  updateDisplay(expression);
}

function handleOperator(op: string) {
  expression += ` ${op} `;
  current = '';
  updateDisplay(expression);
}

function handleBracket(bracket: string) {
  const last = expression.slice(-1);
  if (bracket === '(' && (/\d/.test(last) || last === ')')) {
    expression += ' × ';
  }
  expression += ` ${bracket} `;
  updateDisplay(expression);
}

function tokenize(expr: string): string[] {
  const raw = expr.trim().split(/\s+/);
  const tokens: string[] = [];
  for (let i = 0; i < raw.length; i++) {
    const token = raw[i];
    if (token === '−' || token === '-') {
      if (
        i === 0 ||
        ['+', '−', '-', '×', '÷', '^', '('].includes(raw[i - 1])
      ) {
        const next = raw[i + 1];
        if (next !== undefined && !isNaN(parseFloat(next))) {
          tokens.push((-parseFloat(next)).toString());
          i++;
          continue;
        }
      }
    }
    tokens.push(token);
  }
  return tokens;
}

function precedence(op: string): number {
  switch (op) {
    case '^': return 4;
    case '×': case '÷': return 3;
    case '+': case '−': return 2;
    default: return 0;
  }
}

function isLeftAssociative(op: string): boolean {
  return op !== '^';
}

function toPostfix(tokens: string[]): string[] {
  const output: string[] = [];
  const stack: string[] = [];
  for (const token of tokens) {
    if (!isNaN(parseFloat(token))) {
      output.push(token);
    } else if (['+', '−', '×', '÷', '^'].includes(token)) {
      while (
        stack.length &&
        ['+', '−', '×', '÷', '^'].includes(stack[stack.length - 1]) &&
        (
          (isLeftAssociative(token) && precedence(token) <= precedence(stack[stack.length - 1])) ||
          (!isLeftAssociative(token) && precedence(token) < precedence(stack[stack.length - 1]))
        )
      ) {
        output.push(stack.pop()!);
      }
      stack.push(token);
    } else if (['sin','cos','tan','log','ln'].includes(token)) {
      stack.push(token);
    } else if (token === '(') {
      stack.push(token);
    } else if (token === ')') {
      while (stack.length && stack[stack.length - 1] !== '(') {
        output.push(stack.pop()!);
      }
      stack.pop();
      if (stack.length && ['sin','cos','tan','log','ln'].includes(stack[stack.length - 1])) {
        output.push(stack.pop()!);
      }
    }
  }
  while (stack.length) {
    output.push(stack.pop()!);
  }
  return output;
}

function evalPostfix(postfix: string[]): number {
  const stack: number[] = [];
  for (const token of postfix) {
    if (!isNaN(parseFloat(token))) {
      stack.push(parseFloat(token));
    } else if (['sin','cos','tan','log','ln'].includes(token)) {
      const a = stack.pop();
      if (a === undefined) throw new Error();
      switch (token) {
        case 'sin': stack.push(Math.sin(a * Math.PI / 180)); break;
        case 'cos': stack.push(Math.cos(a * Math.PI / 180)); break;
        case 'tan': stack.push(Math.tan(a * Math.PI / 180)); break;
        case 'log':
          if (a <= 0) throw new Error();
          stack.push(Math.log10(a));
          break;
        case 'ln':
          if (a <= 0) throw new Error();
          stack.push(Math.log(a));
          break;
      }
    } else {
      const b = stack.pop()!;
      const a = stack.pop()!;
      switch (token) {
        case '+': stack.push(a + b); break;
        case '−': stack.push(a - b); break;
        case '×': stack.push(a * b); break;
        case '÷': stack.push(a / b); break;
        case '^': stack.push(Math.pow(a, b)); break;
      }
    }
  }
  return stack[0];
}

function calculate() {
  try {
    const tokens = tokenize(expression);
    const postfix = toPostfix(tokens);
    const result = evalPostfix(postfix);
    expression = result.toString();
    current = expression;
    updateDisplay(expression);
  } catch {
    updateDisplay('Error');
    expression = '';
    current = '';
  }
}

function handleAction(action: string) {
  switch (action) {
    case 'clear':
      current = '';
      expression = '';
      updateDisplay('0');
      break;
    case 'add': handleOperator('+'); break;
    case 'subtract': handleOperator('−'); break;
    case 'multiply': handleOperator('×'); break;
    case 'divide': handleOperator('÷'); break;
    case 'pow': handleOperator('^'); break;
    case 'equals': calculate(); break;
    case 'open-bracket': handleBracket('('); break;
    case 'close-bracket': handleBracket(')'); break;
    case 'decimal':
      if (!current.includes('.')) {
        current = current === '' ? '0.' : current + '.';
        expression += current.endsWith('.') ? '.' : '';
        updateDisplay(expression);
      }
      break;
    case 'mc': memory = 0; break;
    case 'mplus':
      memory += parseFloat(current || '0');
      current = memory.toString();
      updateDisplay(current);
      break;
    case 'mminus':
      memory -= parseFloat(current || '0');
      current = memory.toString();
      updateDisplay(current);
      break;
    case 'sqrt':
      current = Math.sqrt(parseFloat(current || '0')).toString();
      expression = current;
      updateDisplay(current);
      break;
    case 'sin':
      expression += ' sin ( ';
      updateDisplay(expression);
      break;
    case 'cos':
      expression += ' cos ( ';
      updateDisplay(expression);
      break;
    case 'tan':
      expression += ' tan ( ';
      updateDisplay(expression);
      break;
    case 'log':
      expression += ' log ( ';
      updateDisplay(expression);
      break;
    case 'ln':
      expression += ' ln ( ';
      updateDisplay(expression);
      break;
    case 'pi':
      const lastPi = expression.slice(-1);
      if (/\d/.test(lastPi) || lastPi === ')') {
        expression += ' × ';
      }
      expression += Math.PI.toString();
      updateDisplay(expression);
      break;
    case 'euler':
      const lastE = expression.slice(-1);
      if (/\d/.test(lastE) || lastE === ')') {
        expression += ' × ';
      }
      expression += Math.E.toString();
      updateDisplay(expression);
      break;
    case 'random':
      const rand = Math.random().toString();
      current = rand;
      expression = rand;
      updateDisplay(rand);
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
