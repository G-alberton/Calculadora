//falta arrumar aqui para que o cookie não esteja no localstorage

import { calcular, buscarHistorico } from '../services/api.js';
import { ehOperador, formatarExpressao, operadorParaDisplay } from '../utils/format.js';

const token = localStorage.getItem('token');
if (!token) window.location.href = 'autentication.html';

let expressao = [];
let digitandoNumero = false;
let acabouDeCalcular = false;

const displayExpressao = document.getElementById('display-expressao');
const displayValor     = document.getElementById('display-value');
const historyList      = document.getElementById('history-list');

function atualizarDisplay() {
  const ultimo = expressao.at(-1);
  displayValor.innerText = (ultimo && !ehOperador(ultimo)) ? ultimo : '0';
  displayExpressao.innerText = formatarExpressao(expressao);
}

function adicionarHistoricoLocal(texto, resultado) {
  document.querySelector('.empty-msg')?.remove();
  const item = document.createElement('div');
  item.className = 'history-item';
  item.style.cssText = 'padding:15px;border-bottom:1px solid #e2e8f0;text-align:right;';
  item.innerHTML = `<span style="color:#888;font-size:.85em">${texto}</span><br><strong>${resultado}</strong>`;
  historyList?.prepend(item);
}

// Números
document.querySelectorAll('.number').forEach((btn) => {
  btn.addEventListener('click', () => {
    const digito = btn.innerText;
    if (acabouDeCalcular) { expressao = []; acabouDeCalcular = false; digitandoNumero = false; }

    if (!digitandoNumero || !expressao.length || ehOperador(expressao.at(-1))) {
      expressao.push(digito === '.' ? '0.' : digito);
      digitandoNumero = true;
    } else {
      const atual = expressao.at(-1);
      if (digito === '.' && atual.includes('.')) return;
      expressao[expressao.length - 1] = atual + digito;
    }
    atualizarDisplay();
  });
});

// Operadores binários
document.querySelectorAll('.operator').forEach((btn) => {
  btn.addEventListener('click', () => {
    const op = btn.dataset.op;
    if (!op) return;
    acabouDeCalcular = false;
    if (!expressao.length) expressao.push('0');
    if (ehOperador(expressao.at(-1))) expressao[expressao.length - 1] = op;
    else expressao.push(op);
    digitandoNumero = false;
    atualizarDisplay();
  });
});

// Funções unárias (√ e log)
async function aplicarUnaria(operador) {
  const ultimo = expressao.at(-1);
  if (!ultimo || ehOperador(ultimo)) return;
  try {
    const calc = await calcular({ firstNumber: ultimo, operator: operador });
    const texto = `${operador}(${ultimo})`;
    displayExpressao.innerText = texto + ' =';
    displayValor.innerText = calc.result;
    expressao = [calc.result.toString()];
    digitandoNumero = true; acabouDeCalcular = true;
    adicionarHistoricoLocal(texto, calc.result);
  } catch (err) { alert(err.message); }
}

// Igual — suporta múltiplos números em sequência
document.getElementById('equals-btn')?.addEventListener('click', async () => {
  if (expressao.length < 3) return;
  if (ehOperador(expressao.at(-1))) expressao.pop();

  const textoCompleto = formatarExpressao(expressao);
  let acumulador = expressao[0];

  for (let i = 1; i < expressao.length; i += 2) {
    const op = expressao[i] === '÷' ? '/' : expressao[i];
    const n2 = expressao[i + 1];
    if (!op || !n2) break;
    try {
      const calc = await calcular({ firstNumber: acumulador, secondNumber: n2, operator: op });
      acumulador = calc.result.toString();
    } catch (err) { displayValor.innerText = 'Erro'; alert(err.message); return; }
  }

  displayExpressao.innerText = textoCompleto + ' =';
  displayValor.innerText = acumulador;
  expressao = [acumulador];
  digitandoNumero = true; acabouDeCalcular = true;
  adicionarHistoricoLocal(textoCompleto, acumulador);
});

// Botões de ação especial
document.querySelectorAll('[data-action]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const action = btn.dataset.action;
    if (action === 'clear') {
      expressao = []; digitandoNumero = false; acabouDeCalcular = false;
      displayValor.innerText = '0'; displayExpressao.innerText = '';
    } else if (action === 'sign') {
      const u = expressao.at(-1);
      if (u && !ehOperador(u)) { expressao[expressao.length - 1] = (parseFloat(u) * -1).toString(); atualizarDisplay(); }
    } else if (action === 'percent') {
      const u = expressao.at(-1);
      if (u && !ehOperador(u)) { expressao[expressao.length - 1] = (parseFloat(u) / 100).toString(); atualizarDisplay(); }
    } else if (action === 'backspace') {
      if (acabouDeCalcular || !expressao.length) return;
      const u = expressao.at(-1);
      if (ehOperador(u)) { expressao.pop(); digitandoNumero = true; }
      else if (u.length > 1) expressao[expressao.length - 1] = u.slice(0, -1);
      else { expressao.pop(); const nu = expressao.at(-1); digitandoNumero = nu ? !ehOperador(nu) : false; }
      atualizarDisplay();
    } else if (action === 'sqrt') { aplicarUnaria('sqrt'); }
      else if (action === 'log')  { aplicarUnaria('log'); }
  });
});

// Navegação entre abas
const sectionCalc    = document.getElementById('section-calc');
const sectionHistory = document.getElementById('section-history');
document.getElementById('btn-show-calc')?.addEventListener('click', () => {
  sectionCalc.style.display = 'block'; sectionHistory.style.display = 'none';
});
document.getElementById('btn-show-history')?.addEventListener('click', async () => {
  sectionCalc.style.display = 'none'; sectionHistory.style.display = 'block';
  historyList.innerHTML = '<p style="text-align:center;color:#888;padding:20px">Carregando...</p>';
  const history = await buscarHistorico();
  historyList.innerHTML = '';
  if (!history.length) { historyList.innerHTML = '<p class="empty-msg" style="text-align:center;color:#888;padding:20px">Nenhum cálculo ainda.</p>'; return; }
  history.forEach((c) => {
    const op = operadorParaDisplay(c.operator);
    const expr = c.second_number === null ? `${c.operator}(${c.first_number})` : `${c.first_number} ${op} ${c.second_number}`;
    const item = document.createElement('div');
    item.className = 'history-item';
    item.style.cssText = 'padding:15px;border-bottom:1px solid #e2e8f0;text-align:right;';
    item.innerHTML = `<span style="color:#888;font-size:.85em">${expr}</span><br><strong>${c.result}</strong>`;
    historyList.appendChild(item);
  });
});

document.getElementById('btn-exit')?.addEventListener('click', () => {
  localStorage.removeItem('token'); localStorage.removeItem('user');
  window.location.href = 'autentication.html';
});

atualizarDisplay();