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
        equalsBtn.addEventListener('click', () => {
            const secondOperand = currentInput;

            const dateBack = {
                n1: firstOperand,
                n2: secondOperand,
                operacao: operato
            };

            console.log("Tá mandando para o back:", dateBack);

            // Botão de igual - Preparado para a API
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