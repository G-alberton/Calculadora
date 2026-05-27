export function formatarExpressao(expressao) {
  return expressao.join(' ');
}

export function operadorParaDisplay(op) {
  return op === '/' ? '÷' : op;
}

export function ehOperador(val) {
  return ['+', '-', '*', '÷', '^'].includes(val);
}