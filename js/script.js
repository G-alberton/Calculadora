document.addEventListener('DOMContentLoaded', () => {
    // Lembrando que a calculadora até o momento só é possível fazer calculo de dois valores
    let currentInput = '0';
    let firstOperand = null;
    let operato = null;

    const display = document.getElementById('display-value');

    // Aqui se trata da parte da digitação, coisa básica
    const updateDisplay = () => {
        if (display) {
            display.innerText = currentInput;
        }
    };

    document.querySelectorAll('.number').forEach(button => {
        button.addEventListener('click', () => {
            const num = button.innerText; // Pegando o valor do botão clicado

            if (currentInput === '0') {
                currentInput = num;
            } else {
                // Evita colocar múltiplos pontos decimais
                if (num === '.' && currentInput.includes('.')) return;
                currentInput += num;
            }
            updateDisplay();
        });
    });

    // Aqui a gente tá cuidando da questão de capturar o operador
    document.querySelectorAll('.operator').forEach(button => {
        button.addEventListener('click', () => {
            firstOperand = currentInput;
            operato = button.getAttribute('data-op');
            currentInput = '0';
            console.log(`Tá indo pro back: ${firstOperand} ${operato} ...`);
        });
    });

const equalsBtn = document.getElementById('equals-btn');

if (equalsBtn) {
  equalsBtn.addEventListener('click', async () => {
    if (expressao.length < 3) return;

    if (ehOperador(expressao[expressao.length - 1])) {
      expressao.pop();
    }

    const firstNumber = expressao[0];
    const operatorOriginal = expressao[1];
    const secondNumber = expressao[2];

    if (!firstNumber || !operatorOriginal || !secondNumber) {
      displayValor.innerText = 'Erro';
      return;
    }

    const operator = operatorOriginal === '÷' ? '/' : operatorOriginal;

    try {
      const response = await fetch(`${API_URL}/api/calculations`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          firstNumber,
          secondNumber,
          operator
        })
      });

      const data = await response.json();

      if (!response.ok) {
        displayValor.innerText = 'Erro';
        console.error(data);
        alert(data.message || 'Erro ao realizar cálculo');
        return;
      }

      const resultado = data.calculation.result;

      const expressaoTexto = `${firstNumber} ${operatorOriginal} ${secondNumber}`;

      if (displayExpressao) {
        displayExpressao.innerText = expressaoTexto + ' =';
      }

      displayValor.innerText = resultado;

      expressao = [resultado.toString()];
      digitandoNumero = true;
      acabouDeCalcular = true;

      adicionarHistoricoLocal(expressaoTexto, resultado);
    } catch (error) {
      console.error('Erro ao conectar com o backend:', error);
      displayValor.innerText = 'Erro';
      alert('Erro ao conectar com o servidor.');
    }
  });
}

    // Botão AC aqui, para limpar
    const clearBtn = document.querySelector('[data-action="clear"]');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            currentInput = '0';
            firstOperand = null;
            operato = null;
            updateDisplay();
        });
    }
});