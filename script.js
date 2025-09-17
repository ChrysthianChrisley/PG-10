// URL do seu Apps Script publicado como Web App
const scriptUrl = 'https://script.google.com/macros/s/AKfycbzFryBWpeT0dkw5-R39Hdpdeq6lNtI_vr-vNZBBlVf8Aoo-U7S9fOWw55rxWJq9akeC/exec';

const statusElement = document.getElementById('status');
const searchInput = document.getElementById('searchInput');
const tableBody = document.querySelector("#processTable tbody");

// Função chamada no carregamento da página
document.addEventListener('DOMContentLoaded', () => {
    loadData();
});

// Cria <script> dinâmico para JSONP
function loadData() {
    const script = document.createElement('script');
    script.src = scriptUrl + '?callback=handleResponse';
    script.onerror = () => {
        statusElement.textContent = "Falha ao carregar os dados (erro de rede).";
        statusElement.style.color = 'red';
    };
    document.body.appendChild(script);
}

// Função de callback JSONP chamada pelo Apps Script
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

// Função de filtro da tabela
function filterTable() {
    const filter = searchInput.value.toUpperCase();
    const trs = tableBody.getElementsByTagName("tr");
    for (let i = 0; i < trs.length; i++) {
        let display = "none";
        const tds = trs[i].getElementsByTagName("td");
        for (let j = 0; j < tds.length; j++) {
            if (tds[j].textContent.toUpperCase().indexOf(filter) > -1) {
                display = "";
                break;
            }
        }
        trs[i].style.display = display;
    }
}
