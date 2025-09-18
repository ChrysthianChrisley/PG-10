// --- LÓGICA DE SENHA ---
const correctPassword = "Pguerj@7366";

function normalizeText(text) {
    if (!text) return '';
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

document.addEventListener('DOMContentLoaded', () => {
    const enteredPassword = prompt("Por favor, digite a senha para acessar:");

    if (enteredPassword === correctPassword) {
        // Se a senha estiver correta, mostra o conteúdo e carrega os dados
        document.querySelector('.container').style.display = 'block';
        loadData();
    } else {
        // Se a senha estiver errada, nega o acesso
        alert("Senha incorreta. Acesso negado.");
        document.body.innerHTML = '<h1 style="text-align: center; margin-top: 50px;">Acesso Negado</h1>';
    }
});
// --- FIM DA LÓGICA DE SENHA ---


// O restante do código permanece o mesmo, mas só será executado se a senha estiver correta.

// URL do seu Apps Script publicado como Web App (use a URL do /exec)
const scriptUrl = 'https://script.google.com/macros/s/AKfycbzFryBWpeT0dkw5-R39Hdpdeq6lNtI_vr-vNZBBlVf8Aoo-U7S9fOWw55rxWJq9akeC/exec';

const statusElement = document.getElementById('status');
const searchInput = document.getElementById('searchInput');
const tableBody = document.querySelector("#processTable tbody");

// Carrega os dados usando JSONP
function loadData() {
    const script = document.createElement('script');
    script.src = scriptUrl + '?callback=handleResponse';
    script.onerror = () => {
        statusElement.textContent = "Falha ao carregar os dados (erro de rede).";
        statusElement.style.color = 'red';
    };
    document.body.appendChild(script);
}

// Callback JSONP chamado pelo Apps Script
function handleResponse(response) {
    if (!response) {
        statusElement.textContent = "Resposta vazia do servidor.";
        statusElement.style.color = 'red';
        return;
    }

    if (response.status === "error") {
        statusElement.textContent = `Falha: ${response.message}`;
        statusElement.style.color = 'red';
        console.error("Detalhes do erro:", response.details || "(sem detalhes)");
        return;
    }

    const data = response.data;
    tableBody.innerHTML = '';

    if (!data || data.length === 0) {
        statusElement.textContent = "Nenhum dado encontrado na planilha.";
        return;
    }

    data.forEach(rowData => {
        const tr = document.createElement('tr');
        for (let i = 0; i < 6; i++) {
            const td = document.createElement('td');
            td.textContent = rowData[i] || '';
            tr.appendChild(td);
        }
        tableBody.appendChild(tr);
    });

    statusElement.style.display = 'none';
    searchInput.style.display = 'block';
}

// Filtro da tabela
// Filtro da tabela (VERSÃO CORRIGIDA)
function filterTable() {
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