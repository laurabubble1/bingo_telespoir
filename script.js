function CreateCardDialog() {
    const dialog = document.getElementById('CardDialog');
    if (dialog) {
        if (typeof dialog.showModal !== 'function') {
            dialogPolyfill.registerDialog(dialog);
        }
        dialog.showModal();
    } else {
        console.error('Dialog element not found');
    }
}

function HandleCardsubmit() {
    CreateCardDialog();
}

// Assuming there's a submit button inside the dialog
document.getElementById('confirmBtn').onclick = function() {
    const dialog = document.getElementById('CardDialog');
    if (dialog) {
        const cardData = {
            B: document.getElementById('input_B').value.split(',').map(Number),
            I: document.getElementById('input_I').value.split(',').map(Number),
            N: document.getElementById('input_N').value.split(',').map(Number),
            G: document.getElementById('input_G').value.split(',').map(Number),
            O: document.getElementById('input_O').value.split(',').map(Number)
        };
        CreateCard(cardData);
        dialog.close();
    } else {
        console.error('Dialog element not found');
    }
};

function CreateCard(cardData) {
    const cardsDiv = document.getElementById('card-list');
    if (!cardsDiv) {
        console.error('Cards container not found');
        return;
    }

    const cardNumber = cardsDiv.children.length + 1;
    const cardTable = document.createElement('table');
    cardTable.className = 'bingo-card';
    cardTable.id = `card_${cardNumber}`;

    // Create header row
    const headerRow = document.createElement('tr');
    ['B', 'I', 'N', 'G', 'O'].forEach(function(column) {
        const th = document.createElement('th');
        th.textContent = column;
        headerRow.appendChild(th);
    });
    cardTable.appendChild(headerRow);

    // Create rows for numbers
    for (let i = 0; i < 5; i++) {
        const row = document.createElement('tr');
        ['B', 'I', 'N', 'G', 'O'].forEach(function(column) {
            const td = document.createElement('td');
            td.textContent = cardData[column][i] || '';
            row.appendChild(td);
        });
        cardTable.appendChild(row);
    }

    cardsDiv.appendChild(cardTable);
}

function HandleSubmit(){
    var lettre = document.getElementById('lettre').value;
    var numero = document.getElementById('nombre').value;
    var numerolist = document.getElementById('numeros-ul');
    var li = document.createElement('li');
    length = numerolist.children.length;
    li.id = `numero_${length+1}`;
    li.textContent = lettre + numero;
    numerolist.appendChild(li);
    var CardTables = document.getElementsByClassName('bingo-card');
    for (let i=0; i<CardTables.length; i++){
        var cardTable = CardTables[i];
        var cardData = GetCardData(cardTable);
        var columnIndex = ['B', 'I', 'N', 'G', 'O'].indexOf(lettre);
        if (columnIndex !== -1) {
            var rows = cardTable.getElementsByTagName('tr');
            for (let rowIndex = 1; rowIndex < rows.length; rowIndex++) {
            var cell = rows[rowIndex].getElementsByTagName('td')[columnIndex];
            if (cell.textContent == numero) {
                cell.style.backgroundColor = 'green';
            }
            }
        }
    }

}

function GetCardData(cardTable){
    var cardData = {
        B: [],
        I: [],
        N: [],
        G: [],
        O: []
    };
    var rows = cardTable.getElementsByTagName('tr');
    for (let i = 1; i < rows.length; i++) {
        var cells = rows[i].getElementsByTagName('td');
        cardData.B.push(cells[0].textContent);
        cardData.I.push(cells[1].textContent);
        cardData.N.push(cells[2].textContent);
        cardData.G.push(cells[3].textContent);
        cardData.O.push(cells[4].textContent);
    }
    return cardData;
}

function HandleCancel(){
    var numerolist = document.getElementById('numeros-ul');
    var length = numerolist.children.length;
    var li = document.getElementById(`numero_${length}`);
    data = li.textContent;
    var lettre = data[0];
    var numero = data.substring(1);
    console.log(`Removed number: ${lettre + numero}`);
    if (li){
        li.remove();
    }
    var CardTables = document.getElementsByClassName('bingo-card');
    for (let i=0; i<CardTables.length; i++){
        var cardTable = CardTables[i];
        var cardData = GetCardData(cardTable);
        var columnIndex = ['B', 'I', 'N', 'G', 'O'].indexOf(lettre);
        if (columnIndex !== -1) {
            var rows = cardTable.getElementsByTagName('tr');
            for (let rowIndex = 1; rowIndex < rows.length; rowIndex++) {
            var cell = rows[rowIndex].getElementsByTagName('td')[columnIndex];
            if (cell.textContent == numero) {
                cell.style.backgroundColor = 'white';
            }
            }
        }
    }
}
function collectData() {
    let data = '';

    // Collect card data
    const CardTables = document.getElementsByClassName('bingo-card');
    for (let i = 0; i < CardTables.length; i++) {
        const cardTable = CardTables[i];
        data += `Card ${i + 1}:\n`;
        for (let row of cardTable.rows) {
            for (let cell of row.cells) {
                if (cell.style.backgroundColor === 'green') {
                    data += cell.textContent + ' (marked)\t';
                }else{
                data += cell.textContent + '\t';
                }

            }
            data += '\n';
        }
        data += '\n';
    }

    // Collect list data
    const numerolist = document.getElementById('numeros-ul');
    if (numerolist) {
        data += 'Numbers List:\n';
        for (let li of numerolist.children) {
            data += li.textContent + '\n';
        }
    }

    return data;
}

function saveToFile(data, filename) {
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function handleSave() {
    const data = collectData();
    saveToFile(data, 'bingo_data.txt');
}

// Add event listener to the save button
document.getElementById('save-button').addEventListener('click', handleSave);

document.getElementById('file-input').addEventListener('change', handleFileUpload);

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        parseData(content);
    };
    reader.readAsText(file);
}

function parseData(data) {
    const lines = data.split('\n');
    let currentCard = null;
    let isNumbersList = false;

    lines.forEach(line => {
        if (line.startsWith('Card')) {
            currentCard = document.createElement('table');
            currentCard.className = 'bingo-card';
            document.getElementById('card-list').appendChild(currentCard);

            const headerRow = document.createElement('tr');
            ['B', 'I', 'N', 'G', 'O'].forEach(column => {
                const th = document.createElement('th');
                th.textContent = column;
                headerRow.appendChild(th);
            });
            currentCard.appendChild(headerRow);
        } else if (line.trim() === '') {
            // Skip empty lines
        } else if (line.startsWith('B\tI\tN\tG\tO')) {
            // Skip header row
        } else if (line.startsWith('Numbers List:')) {
            isNumbersList = true;
        } else if (isNumbersList) {
            const numerolist = document.getElementById('numeros-ul');
            const li = document.createElement('li');
            li.textContent = line;
            numerolist.appendChild(li);
        } else if (currentCard) {
            const row = document.createElement('tr');
            const cells = line.split('\t').filter(cell => cell.trim() !== '');
            cells.forEach(cell => {
                const td = document.createElement('td');
                if (cell.includes('(marked)')) {
                    td.textContent = cell.replace(' (marked)', '');
                    td.style.backgroundColor = 'green';
                } else {
                    td.textContent = cell;
                }
                row.appendChild(td);
            });
            currentCard.appendChild(row);
        }
    });
}