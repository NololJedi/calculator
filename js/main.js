'use strict';

/*Global constants*/
const MAX_EXPRESSION_LENGTH = 26;
const ERROR_MAX_LENGTH_MESSAGE = 'Maximum length was reached';
const OPERATION_BUTTON_ATTRIBUTE = 'data-operation';
const NUMBER_BUTTON_ATTRIBUTE = 'data-number';

/*Utils*/
function chooseZeroForExpression(expression) {
    if (expression.length === 0) {
        return "0.";
    }

    let lastSymbol = expression[expression.length - 1];

    switch (lastSymbol) {
        case "+":
        case "-":
        case "/": {
            return "0.";
        }
        case "*":
        case ".":
        default: {
            return "0";
        }
    }
}

function isDigitExistInExpression(expression) {
    if (expression.length === 0) {
        return true;
    }
    return expression.indexOf(".") === -1;
}

function isLastSymbolOperation(expression) {
    if (expression.length === 0) {
        return false;
    }

    switch (expression[expression.length - 1]) {
        case "+" :
        case "-" :
        case "/" :
        case "*" : {
            return true;
        }
        default: {
            return false;
        }
    }
}

function isLastSymbolDigit(expression) {
    if (expression.length === 0) {
        return true;
    }
    return expression[expression.length - 1] === ".";
}

function getLastNumber(expression) {
    let lastNumber = expression;
    if (isLastSymbolOperation(lastNumber)) {
        lastNumber = lastNumber.substring(0, lastNumber.length - 1);
    }

    let minusIndex = lastNumber.lastIndexOf("-");
    let plusIndex = lastNumber.lastIndexOf("+");
    let divideIndex = lastNumber.lastIndexOf("/");
    let multipleIndex = lastNumber.lastIndexOf("*");

    let operationIndex = getMaxIndex(minusIndex, plusIndex, divideIndex, multipleIndex);

    lastNumber = lastNumber.substring(operationIndex + 1, lastNumber.length);

    return lastNumber;
}

function getMaxIndex(first, second, third, fourth) {
    let numbers = [first, second, third, fourth];
    numbers.sort(sortNumber);

    return numbers.pop();
}

function sortNumber(a, b) {
    return a - b;
}

/*Main function*/
$(function () {

    /*Global variables*/
    let expression = $('#expression');
    let numbers = getElements('.number');
    let operations = getElements('.operation');
    let resultButton = $('#result');
    let clearButton = $('#clear');
    let deleteButton = $('#delete');
    let zeroButton = $('#zero');
    let digitButton = $('#digit');
    let isCleanNeed = false;

    setListeners();

    /*Operations*/
    function addNumberFromOneToNineToExpression(currentNumber) {
        checkForClean();
        if (!checkLimit()) {
            expression.text(expression.text() + currentNumber);
        }
    }

    function addZeroToExpression() {
        checkForClean();
        if (!checkLimit()) {
            let zero = chooseZeroForExpression(expression.val());
            expression.text(expression.text() + zero);
        }
    }

    function addOperationToExpression(operation) {
        checkForClean();
        if (!checkLimit()) {
            if (!isLastSymbolOperation(expression.text())
                && !isLastSymbolDigit(expression.text())) {
                expression.text(expression.text() + operation);
            }
        }
    }

    function addDigitToExpression() {
        checkForClean();
        if (!checkLimit()) {
            let fullExpression = expression.text();
            if (!isLastSymbolOperation(fullExpression)
                && !isLastSymbolDigit(fullExpression)
                && isDigitExistInExpression(getLastNumber(fullExpression))) {
                expression.text(fullExpression + ".");
            }
        }
    }

    function clearExpression() {
        expression.text('');
    }

    function calculateExpression() {
        expression.text(eval(expression.text()));
    }

    function deleteFromExpression() {
        checkForClean();
        expression.text(expression.text().substring(0, expression.text().length - 1))
    }

    /*Utils*/
    function getElements(elementName) {
        return document.querySelectorAll(elementName);
    }

    function setListenersToNumbers() {
        for (let index = 0; index < numbers.length; index++) {
            numbers[index].onclick = function () {
                let currentNumber = this.getAttribute(NUMBER_BUTTON_ATTRIBUTE);
                addNumberFromOneToNineToExpression(currentNumber);
            }
        }
        zeroButton.click(addZeroToExpression);

        addEventListener('keypress', function (event) {
            let code = event.which;
            if (code === 48) {
                addZeroToExpression();
            }
            if (code > 48 && code < 58) {
                addNumberFromOneToNineToExpression(String.fromCharCode(code))
            }
        })
    }

    function setListenersToOperations() {
        for (let index = 0; index < operations.length; index++) {
            operations[index].onclick = function () {
                let operation = this.getAttribute(OPERATION_BUTTON_ATTRIBUTE);
                addOperationToExpression(operation);
            }
        }

        digitButton.click(addDigitToExpression);

        addEventListener('keypress', function (event) {
            let operation = String.fromCharCode(event.which);

            switch (operation) {
                case "+": {
                    addOperationToExpression("+");
                    break;
                }
                case "-": {
                    addOperationToExpression("-");
                    break;
                }
                case "/": {
                    addOperationToExpression("/");
                    break;
                }
                case "*": {
                    addOperationToExpression("*");
                    break;
                }
                case "=": {
                    calculateExpression();
                    break;
                }
                case "c": {
                    clearExpression();
                    break;
                }
                case "d": {
                    deleteFromExpression();
                    break;
                }
                case ".": {
                    addDigitToExpression();
                    break;
                }


            }

        })
    }

    function setListeners() {
        setListenersToNumbers();
        setListenersToOperations();

        clearButton.click(clearExpression);

        resultButton.click(calculateExpression);

        deleteButton.click(deleteFromExpression);
    }

    function checkLimit() {
        if (expression.text().length === MAX_EXPRESSION_LENGTH) {
            expression.text(ERROR_MAX_LENGTH_MESSAGE);
            isCleanNeed = true;
            return true;
        }
        return false;
    }

    function checkForClean() {
        if (isCleanNeed){
            clearExpression();
            isCleanNeed = false;
        }
    }

});