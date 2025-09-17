const scriptUrl = 'https://script.google.com/macros/s/AKfycbzs02BxtLZpKbKa5SyhBHoHjrY6gu8ieJCwW4h53TTreSVOlZDfzH2BExkiiuj_y9LH/exec';

const statusElement = document.getElementById('status');
const searchInput = document.getElementById('searchInput');
const tableBody = document.querySelector("#processTable tbody");

document.addEventListener('DOMContentLoaded', () => {
    fetch(scriptUrl) 
        .then(res => res.json()) // Converte a resposta para JSON
        .then(response => {
            // VERIFICA O STATUS DENTRO DO JSON
            if (response.status === "error") {
                throw new Error(response.message);
            }

            // PEGA OS DADOS DE DENTRO DO CAMPO "data"
            const data = response.data;
            tableBody.innerHTML = ''; 

            if (!data || data.length === 0) {
                statusElement.textContent = "Nenhum dado encontrado na planilha.";
                return;
            }

            data.forEach(rowData => {
                const tr = document.createElement('tr');
                for (let i = 0; i < 7; i++) {
                    const td = document.createElement('td');
                    td.textContent = rowData[i] || '';
                    tr.appendChild(td);
                }
                tableBody.appendChild(tr);
            });
            
            statusElement.style.display = 'none';
            searchInput.style.display = 'block';
        })
        .catch(error => {
            statusElement.textContent = `Falha ao carregar os dados: ${error.message}`;
            statusElement.style.color = 'red';
            console.error('Erro detalhado:', error);
        });
});

function filterTable() {
    // Esta função não precisa de mudanças
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