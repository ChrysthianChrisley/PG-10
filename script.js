// --- LÓGICA DE SENHA ---
// (Mantida exatamente como a sua)
const correctPassword = "7366";

function normalizeText(text) {
    if (!text) return '';
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

document.addEventListener('DOMContentLoaded', () => {
    // Esconde o container principal até a senha ser digitada
    const container = document.querySelector('.container');
    if (container) {
      container.style.display = 'none';
    }

    const enteredPassword = prompt("Por favor, digite a senha para acessar:");

    if (enteredPassword === correctPassword) {
        // Se a senha estiver correta, mostra o conteúdo e carrega os dados
        if (container) {
          container.style.display = 'block';
        }
        loadData();
    } else {
        // Se a senha estiver errada, nega o acesso
        alert("Senha incorreta. Acesso negado.");
        document.body.innerHTML = '<h1 style="text-align: center; margin-top: 50px;">Acesso Negado</h1>';
    }
});
// --- FIM DA LÓGICA DE SENHA ---


/**
 * ATUALIZE AQUI!
 * Cole a URL da sua *nova* implantação do Google Apps Script.
 */
const scriptUrl = 'https://script.google.com/macros/s/AKfycbzSTtp6uP3RrpHPNutRGQD59GdVQn_dEQoylJxRnHW9kkYIQweSl_fyg83s59Ut7Oj3/exec';

// Elementos da página
const statusElement = document.getElementById('status');
const searchInput = document.getElementById('searchInput');
const tableBody = document.querySelector("#processTable tbody");

/**
 * Carrega os dados da planilha.
 * Agora, ele verifica o ID do body para decidir qual aba solicitar.
 */
function loadData() {
    if (!statusElement) return; // Sai se os elementos não existirem (pág de erro)

    statusElement.textContent = "Carregando dados, por favor aguarde...";
    
    // 1. Determina o nome da aba baseado no ID do <body>
    const bodyId = document.body.id;
    let sheetName = "PG-10"; // Padrão

    if (bodyId === "page-pjtcicap") {
        sheetName = "7ª PJTCICAP - Projetos Extensão e Inovação";
    } else if (bodyId === "page-projetos") {
        sheetName = "Projetos";
    }
    
    // 2. Codifica o nome da aba para ser seguro na URL
    const encodedSheetName = encodeURIComponent(sheetName);
    
    // 3. Monta a URL da API com o callback e o novo parâmetro 'sheet'
    const apiUrl = `${scriptUrl}?callback=handleResponse&sheet=${encodedSheetName}`;
    
    // 4. Cria e adiciona o script tag para fazer a chamada JSONP
    const script = document.createElement('script');
    script.src = apiUrl;
    
    script.onerror = () => {
        statusElement.textContent = "Falha ao carregar os dados (erro de rede).";
        statusElement.style.color = 'red';
    };
    
    document.body.appendChild(script);
}

/**
 * Função de callback chamada pela resposta do Google Apps Script.
 * @param {object} response O objeto JSON retornado pelo script.
 */
function handleResponse(response) {
    if (!response) {
        statusElement.textContent = "Resposta vazia do servidor.";
        statusElement.style.color = 'red';
        return;
    }

    // Verifica se o Apps Script retornou um erro
    if (response.status === "error") {
        statusElement.textContent = `Falha: ${response.message}`;
        statusElement.style.color = 'red';
        console.error("Detalhes do erro:", response.details || "(sem detalhes)");
        return;
    }

    const data = response.data;
    tableBody.innerHTML = ''; // Limpa a tabela

    if (!data || data.length === 0) {
        statusElement.textContent = `Nenhum dado encontrado na aba "${response.sheet}".`;
        return;
    }

    // Popula a tabela
    data.forEach(rowData => {
        const tr = document.createElement('tr');
        // O seu script original lia 6 colunas (0 a 5)
        for (let i = 0; i < 6; i++) {
            const td = document.createElement('td');
            td.textContent = rowData[i] || ''; // Usa '' para células vazias
            tr.appendChild(td);
        }
        tableBody.appendChild(tr);
    });

    // Esconde o status e mostra a busca
    statusElement.style.display = 'none';
    searchInput.style.display = 'block';
}

/**
 * Filtra a tabela localmente com base no input de busca.
 * (Mantido exatamente como o seu)
 */
function filterTable() {
    if (!tableBody) return;

    // 1. Normaliza e converte para maiúsculas o texto da busca
    const filter = normalizeText(searchInput.value).toUpperCase();
    
    const trs = tableBody.getElementsByTagName("tr");
    for (let i = 0; i < trs.length; i++) {
        let display = "none";
        const tds = trs[i].getElementsByTagName("td");
        for (let j = 0; j < tds.length; j++) {
            // 2. Normaliza e converte para maiúsculas o texto da célula
            const cellText = normalizeText(tds[j].textContent).toUpperCase();
            
            if (cellText.indexOf(filter) > -1) {
                display = "";
                break;
            }
        }
        trs[i].style.display = display;
    }
}