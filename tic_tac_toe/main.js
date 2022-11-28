let turn = 0; // определение очереди хода
let gameOver = false; // определение конца игры


// функция вывода сообщения на экран
function showMessage(msg, category = 'success') {
    // получение элемента сообщение
    let messages = document.querySelector('.messages');
    // создание нового элемента div
    let createDiv = document.createElement('div');
    // добавления класса элементу
    createDiv.classList.add('msg', category);
    // добавление элементу значение сообщения 
    createDiv.innerHTML = msg;
    // добавление в конец 
    messages.append(createDiv);
    // задание удаления по таймеру
    setTimeout(() => createDiv.remove(), 2000);
}

// функция поиска победителя
function findWinner() {
    let cells = document.querySelectorAll('.cell');
    /*  0 1 2
        3 4 5
        6 7 8*/
    let row, column, diag, diag1, winner;
    diag = cells[0].innerHTML != '' ? cells[0].innerHTML : null;
    diag1 = cells[2].innerHTML != '' ? cells[2].innerHTML : null;
    for (let i = 0; i < 3; i++) {
        row = cells[i * 3].innerHTML != '' ? cells[i * 3].innerHTML : null;
        column = cells[i].innerHTML != '' ? cells[i].innerHTML : null;
        for (let j = 0; j < 3; j++) {
            if (!row && !column) {
                break;
            }

            if (cells[i * 3 + j].innerHTML != row)
                row = null;

            if (cells[j * 3 + i].innerHTML != column)
                column = null;
        }

        winner = row || column;
        if (winner)
            return winner;
        if (cells[i * 3 + i].innerHTML != diag)
            diag = null;
        if (cells[i * 3 + 2 - i].innerHTML != diag1)
            diag1 = null;
    }
    winner = diag || diag1;
    return winner;
}

// функция проверки наличия свободных полей для совершения хода
function checkAvailableSteps() {
    let cells = document.querySelectorAll('.cell');
    for (let i = 0; i < 9; i ++) {
        if (cells[i].innerHTML == '') return true;
    }
    return false;
}


// функция для обработки события
function clickHandler(event) {
    if (gameOver) {
        showMessage('Игра закончена', 'danger');
        return;
    }

    if (event.target.innerHTML != '') {
        showMessage('Поле занято', 'danger');
        return;
    }

    event.target.innerHTML = turn == 0 ? 'X' : 'O';
    turn = (turn + 1) % 2;

    let winner = findWinner();
    if (winner != null || !checkAvailableSteps()) {
        showMessage(winner ? `${winner} одержал победу!` : 'Ничья');
        gameOver = true;
    }

}

// функция создания доски
function initBoard() {
    let gameBoard = document.getElementById('board');

    for (let i = 0; i < 9; i++) {
        let createDiv = document.createElement('div');
        createDiv.className = 'cell';
        createDiv.innerHTML = '';
        gameBoard.append(createDiv);
        createDiv.addEventListener('click', clickHandler);
    }

    return gameBoard;
}

// функция создания новой игры
function newGame() {
    let cells = document.querySelectorAll('.cell');
    for (let i = 0; i < 9; i++) {
        cells[i].innerHTML = '';
    }
    gameOver = false;
    turn = 0;
}

// запуск функций
window.onload = function () {
    // инициализация доски
    initBoard();
    // получение элемента кнопка
    let button = document.querySelector('.new-game-btn');
    // назначение элементу кнопка обработчика
    button.addEventListener('click', newGame);
};
