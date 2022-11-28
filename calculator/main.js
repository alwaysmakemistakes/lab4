// получение элементов
// получение всех кнопок калькулятора
var buttons = document.querySelectorAll('.key');
// получение экрана
var scr = document.querySelector('#screen');
// получение доступа к элементу кнопки
var allButtons = document.querySelector('.buttons');


// Функция priority позволяет получить 
// значение приоритета для оператора.
// Возможные операторы: +, -, *, /.

function priority(operation) {
    if (operation == '+' || operation == '-') {
        return 1;
    } else {
        return 2;
    }
}

// Проверка, является ли строка str числом.

function isNumeric(str) {
    return /^\d+(.\d+){0,1}$/.test(str);
}

// Проверка, является ли строка str цифрой.

function isDigit(str) {
    return /^\d{1}$/.test(str);
}

// Проверка, является ли строка str оператором.

function isOperation(str) {
    return /^[\+\-\*\/]{1}$/.test(str);
}

// Функция tokenize принимает один аргумент -- строку
// с арифметическим выражением и делит его на токены 
// (числа, операторы, скобки). Возвращаемое значение --
// массив токенов.
// например, для 6*(3.5-2.5)+9/2
// вернется массив ['6', '*', '(', '3.5', '-', '2.5', ')', '+', '9', '/', '3']
function tokenize(str) {
    let tokens = []; // массив токенов
    let lastNumber = ''; // строка для корректного парсинга числа
    // проход по всем символам из строки
    for (char of str) {
        // проверка на число
        if (isDigit(char) || char == '.') {
            lastNumber += char;
        } else {
            // обнуление переменной для последнего числа
            if (lastNumber.length > 0) {
                tokens.push(lastNumber);
                lastNumber = '';
            }
        }
        // проверка на оператор или скобку
        if (isOperation(char) || char == '(' || char == ')') {
            tokens.push(char);
        }
    }
    if (lastNumber.length > 0) {
        tokens.push(lastNumber);
    }
    // возврат массива токенов
    return tokens;
}

// Функция compile принимает один аргумент -- строку
// с арифметическим выражением, записанным в инфиксной 
// нотации, и преобразует это выражение в обратную 
// польскую нотацию (ОПН). Возвращаемое значение -- 
// результат преобразования в виде строки, в которой 
// операторы и операнды отделены друг от друга пробелами. 
// Выражение может включать действительные числа, операторы 
// +, -, *, /, а также скобки. Все операторы бинарны и левоассоциативны.
// Функция реализует алгоритм сортировочной станции 
// (https://ru.wikipedia.org/wiki/Алгоритм_сортировочной_станции).

function compile(str) {
    let out = []; // массив вывода
    let stack = []; // массив stack
    // для каждого токена из массива токенов
    for (token of tokenize(str)) {
        // проверка на число
        if (isNumeric(token)) {
            out.push(token);
        } else if (isOperation(token)) {
            // в случае, если токен является оператором
            while (stack.length > 0 &&
                isOperation(stack[stack.length - 1]) &&
                priority(stack[stack.length - 1]) >= priority(token)) {
                out.push(stack.pop());
            }
            stack.push(token);
        } else if (token == '(') {
            // если токен является открывающей скобкой
            stack.push(token);
        } else if (token == ')') {
            // если токен является закрывающей скобкой
            while (stack.length > 0 && stack[stack.length - 1] != '(') {
                out.push(stack.pop());
            }
            stack.pop();
        }
    }
    // запись оставшихся операторов в вывод
    while (stack.length > 0) {
        out.push(stack.pop());
    }
    // возврат строки
    return out.join(' ');
}

// Функция evaluate принимает один аргумент -- строку 
// с арифметическим выражением, записанным в обратной 
// польской нотации. Возвращаемое значение -- результат 
// вычисления выражения. Выражение может включать 
// действительные числа и операторы +, -, *, /.
// Вам нужно реализовать эту функцию
// (https://ru.wikipedia.org/wiki/Обратная_польская_запись#Вычисления_на_стеке).

function evaluate(str) {
    // статичный объект, описывающий четыре базовые операции
    const operators = {
        '+': (x, y) => x + y,
        '-': (x, y) => x - y,
        '*': (x, y) => x * y,
        '/': (x, y) => x / y
    };
    // stack для обработки обратной польской нотации (ОПН)
    let stack = [];

    compile(str).split(' ').forEach((token) => {
        // если оператор, то выполнить соответствующую операцию над операндами
        if (token in operators) {
            let [y, x] = [stack.pop(), stack.pop()];
            stack.push(operators[token](x, y));
        } else {
            // иначе просто считать операнд в stack
            stack.push(parseFloat(token));
        }
    });
    // вернуть последний элемент stack, т.к. это является ответом
    return stack.pop();
}

// Функция clickHandler предназначена для обработки 
// событий клика по кнопкам калькулятора. 
// По нажатию на кнопки с классами digit, operation и bracket
// на экране (элемент с классом screen) должны появляться 
// соответствующие нажатой кнопке символы.
// По нажатию на кнопку с классом clear содержимое экрана 
// должно очищаться.
// По нажатию на кнопку с классом result на экране 
// должен появиться результат вычисления введённого выражения 
// с точностью до двух знаков после десятичного разделителя (точки).
// Реализуйте эту функцию. Воспользуйтесь механизмом делегирования 
// событий (https://learn.javascript.ru/event-delegation), чтобы 
// не назначать обработчик для каждой кнопки в отдельности.

function clickHandler(event) {
    // отсеивание некорректных нажаний
    if (event.target.value != undefined) {
        // по умолчанию введенный символ просто добавляется в конец экрана
        scr.value = scr.value + event.target.textContent;
        // в случае, если это знак равенства выполняется расчет 
        if (event.target.textContent == '=') {
            scr.value = evaluate(scr.value);
        }
        // в случае, если это знак очистки выполняется очистка
        if (event.target.textContent == 'C') {
            scr.value = '';
        }
    };
}


// назначение обработчика событий

window.onload = function () {
    // для всех кнопок назначаем обработчик
    // лучше использовать переменную buttonContainer вместо allButtons
    allButtons.onclick = clickHandler; 
};
