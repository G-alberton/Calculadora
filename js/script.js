document.addEventListener('DOMContentLoaded', () => {
    // Variáveis de controle
    let currentInput = '0';
    let firstOperand = null;
    let operato = null;

    const display = document.getElementById('display-value');

    // Seletores de Navegação (Corrigido o ID do histórico)
    const btnCalc = document.getElementById('btn-show-calc');
    const btnHistory = document.getElementById('btn-show-history'); 
    const sectionCalc = document.getElementById('section-calc');
    const sectionHistory = document.getElementById('section-history');
    const historyList = document.getElementById('history-list');

    // Função de Troca de Página
    const showPage = (page) => {
        if (page === 'calc') {
            sectionCalc.style.display = 'block';
            sectionHistory.style.display = 'none';
            btnCalc.classList.add('active');
            btnHistory.classList.remove('active');
        } else {
            sectionCalc.style.display = 'none';
            sectionHistory.style.display = 'block';
            btnHistory.classList.add('active');
            btnCalc.classList.remove('active');
        }
    };

    if (btnCalc) btnCalc.addEventListener('click', () => showPage('calc'));
    if (btnHistory) btnHistory.addEventListener('click', () => showPage('history'));

    // Função para Adicionar ao Histórico
    const addToHistory = (n1, op, n2, resultado) => {
        const emptyMsg = document.querySelector('.empty-msg');
        if (emptyMsg) emptyMsg.remove();

        const item = document.createElement('div');
        item.className = 'history-item';
        item.style.padding = "15px";
        item.style.borderBottom = "1px solid #e2e8f0";
        item.style.textAlign = "right"; // Corrigido: right

        item.innerHTML = `${n1} ${op} ${n2} = <strong>${resultado}</strong>`;

        if (historyList) historyList.prepend(item);
    };

    const updateDisplay = () => {
        if (display) {
            display.innerText = currentInput;
        }
    };

    // Digitação de Números
    document.querySelectorAll('.number').forEach(button => {
        button.addEventListener('click', () => {
            const num = button.innerText;

            if (currentInput === '0') {
                currentInput = num;
            } else {
                if (num === '.' && currentInput.includes('.')) return;
                currentInput += num;
            }
            updateDisplay();
        });
    });

    // Captura de Operador
    document.querySelectorAll('.operator').forEach(button => {
        button.addEventListener('click', () => {
            firstOperand = currentInput;
            operato = button.getAttribute('data-op');
            currentInput = '0';
            console.log(`Operação capturada: ${firstOperand} ${operato}`);
        });
    });

    // Botão de Igual
    const equalsBtn = document.getElementById('equals-btn');
    if (equalsBtn) {
        equalsBtn.addEventListener('click', () => {
            if (firstOperand === null || operato === null) return;

            const secondOperand = currentInput;
            const dateBack = {
                n1: firstOperand,
                n2: secondOperand,
                operacao: operato
            };

            //coloca 
            // Simulação de cálculo (Troca os símbolos para o eval entender)
            try {
                const expressao = `${dateBack.n1}${dateBack.operacao.replace('×','*').replace('÷','/')}${dateBack.n2}`;
                const resultadoSimulado = eval(expressao);
                
                // 1. Atualiza Display
                currentInput = resultadoSimulado.toString();
                updateDisplay();

                // 2. Adiciona ao Histórico
                addToHistory(dateBack.n1, dateBack.operacao, dateBack.n2, resultadoSimulado);

                // 3. Reseta para a próxima conta
                firstOperand = null;
                operato = null;

            } catch (error) {
                console.error("Erro no cálculo:", error);
                currentInput = "Erro";
                updateDisplay();
            }
        });
    }

    // Botão AC (Limpar)
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