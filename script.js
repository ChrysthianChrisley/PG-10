// A URL do seu App da Web implantado
const scriptUrl = 'https://script.google.com/macros/s/AKfycbzs02BxtLZpKbKa5SyhBHoHjrY6gu8ieJCwW4h53TTreSVOlZDfzH2BExkiiuj_y9LH/exec';

// Elementos da página
const statusElement = document.getElementById('status');
const searchInput = document.getElementById('searchInput');
const tableBody = document.querySelector("#processTable tbody");

// Esta função será executada assim que a página carregar
document.addEventListener('DOMContentLoaded', () => {
    // FAZ A CHAMADA SIMPLES, SEM CABEÇALHOS EXTRAS
    fetch(scriptUrl) 
        .then(res => {
            if (!res.ok) {
                throw new Error("Erro de acesso. Verifique o console do navegador (F12) para detalhes.");
            }
            return res.json();
        })
        .then(data => {
            // Limpa qualquer dado de exemplo que possa estar na tabela
            tableBody.innerHTML = ''; 

            if (!data || data.length === 0) {
                statusElement.textContent = "Nenhum dado encontrado na planilha.";
                return;
            }

            // Preenche a tabela com os dados recebidos da planilha
            data.forEach(rowData => {
                const tr = document.createElement('tr');
                for (let i = 0; i < 7; i++) { // Garante 7 colunas
                    const td = document.createElement('td');
                    td.textContent = rowData[i] || '';
                    tr.appendChild(td);
                }
                tableBody.appendChild(tr);
            });
            
            // Esconde a mensagem de status e mostra o campo de busca
            statusElement.style.display = 'none';
            searchInput.style.display = 'block';
        })
        .catch(error => {
            statusElement.textContent = `Falha ao carregar os dados. Causa provável: Você não está logado na conta Google correta ou um bloqueador de anúncios/extensão está interferindo.`;
            statusElement.style.color = 'red';
            console.error('Erro detalhado:', error);
        });
});

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