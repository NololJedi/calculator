'use strict';

/*Global constants*/
const MAX_EXPRESSION_LENGTH = 26;
const ERROR_MAX_LENGTH_MESSAGE = 'Maximum length was reached';
const OPERATION_BUTTON_ATTRIBUTE = 'data-operation';
const NUMBER_BUTTON_ATTRIBUTE = 'data-number';

/*Utils*/
function calculateResult(expression) {
    return eval(expression);
}

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
    let closedBracketIndex = lastNumber.lastIndexOf(")");
    let openBracketIndex = lastNumber.lastIndexOf("(");

    let operationIndex = getMaxIndex(minusIndex, plusIndex, divideIndex, multipleIndex, closedBracketIndex);

    if (operationIndex === -1) {
        return lastNumber;
    }

    if (closedBracketIndex === operationIndex) {
        lastNumber = lastNumber.substring(openBracketIndex, closedBracketIndex + 1);
        return lastNumber;
    }

    if (minusIndex === operationIndex) {
        let currentOpenBracketIndex = minusIndex - 1;
        if (openBracketIndex === currentOpenBracketIndex) {
            lastNumber = lastNumber.substring(openBracketIndex, lastNumber.length);
            return lastNumber;
        }
    }

    lastNumber = lastNumber.substring(operationIndex + 1, lastNumber.length);
    return lastNumber;
}

function getMaxIndex(first, second, third, fourth, five) {
    let numbers = [first, second, third, fourth, five];
    numbers.sort(sortNumber);

    return numbers.pop();
}

function sortNumber(a, b) {
    return a - b;
}

function isCurrentNumberNegative(expression) {
    let minusIndex = expression.lastIndexOf("-");
    let openBracketIndex = expression.lastIndexOf("(");

    if (minusIndex === expression.length - 1 && openBracketIndex !== expression.length - 2) {
        return false;
    }

    if (minusIndex === 0) {
        return false;
    }

    return openBracketIndex + 1 === minusIndex;
}

function isLastNumberNegative(expression) {
    let lastNumber = getLastNumber(expression);

    return isCurrentNumberNegative(lastNumber);
}

function isLastSymbolMinus(expression) {
    return expression[expression.length - 1] === "-";
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
    let isModeOnCheckBox = $('#isModeOn');
    let isCleanNeed = false;
    let isModeOn = false;
    let isResultNeed = false;

    setListeners();

    /*Operations*/
    function addNumberFromOneToNineToExpression(currentNumber) {
        checkForClean();
        formatNumber();
        let expressionValue = expression.text();
        if (!checkLimit()) {
            if (isLastSymbolOperation(expressionValue)) {
                expression.text(expression.text() + currentNumber);
            } else if (isLastNumberNegative(expressionValue)) {
                if (expressionValue[expressionValue.length - 1] === ")") {
                    deleteFromExpression();
                }
                expression.text(expression.text() + currentNumber + ")");
            } else {
                expression.text(expression.text() + currentNumber);
            }
        }
    }

    function addZeroToExpression() {
        checkForClean();
        formatNumber();
        formatMinus();
        if (!checkLimit()) {
            if (isLastSymbolOperation(expression.text())) {
                expression.text(expression.text() + chooseZeroForExpression(expression.text()));
            } else if (isLastNumberNegative(expression.text())) {
                if (expression.text()[expression.text().length - 1] === ")") {
                    deleteFromExpression();
                }
                expression.text(expression.text() + chooseZeroForExpression(expression.text()) + ")");
            } else {
                expression.text(expression.text() + chooseZeroForExpression(expression.text()));
            }
        }
    }

    function addOperationToExpression(operation) {
        checkForClean();
        formatMinus();
        formatDigit();
        formatNegative(operation);
        let expressionValue = expression.text();

        if (!isLastSymbolOperation(expression.text()) || !isLastSymbolMinus(expression.text())) {
            isResultNeed = true;
        }

        if (!checkLimit()
            && !isLastSymbolOperation(expressionValue)
            && !isLastSymbolMinus(expressionValue)) {
            if (isModeOn) {
                if (expressionValue.length !== 0) {
                    expression.text(expressionValue + operation);
                }
            } else {
                if (expressionValue.length !== 0) {
                    if (!isResultNeed) {
                        expression.text(expressionValue + operation);
                        isResultNeed = true;
                    } else {
                        let result = calculateResult(expressionValue);
                        expression.text(result + operation);
                        isResultNeed = false;
                    }
                }
            }
        }

        if (isLastSymbolOperation(expressionValue) || isLastSymbolMinus(expressionValue)) {
            deleteFromExpression();
            expression.text(expression.text() + operation);
        }
    }

    function addDigitToExpression() {
        checkForClean();
        formatNegative("");
        let expressionValue = expression.text();

        if (!checkLimit()) {
            if (!isLastSymbolOperation(expressionValue)
                && !isLastSymbolDigit(expressionValue)
                && isDigitExistInExpression(getLastNumber(expressionValue))
                && !isLastSymbolMinus(expressionValue)) {
                if (isLastNumberNegative(expressionValue)) {
                    if (expressionValue[expressionValue.length - 1] === ")") {
                        deleteFromExpression();
                    }
                    expression.text(expression.text() + "." + ")");
                } else {
                    expression.text(expression.text() + ".");
                }
            }
        }

    }

    function addMinusToExpression() {
        checkForClean();
        formatMinus();
        formatDigit();
        let expressionValue = expression.text();
        if (expressionValue.length === 0) {
            expression.text("(-)");
            return;
        }
        if (!isLastSymbolOperation(expressionValue) || !isLastSymbolMinus(expressionValue)) {
            isResultNeed = true;
        }
        if (isLastSymbolOperation(expressionValue)) {
            expression.text(expression.text() + "(-)");
        } else if (expressionValue[expressionValue.length - 1] === ")") {
            if (!formatNegative("")) {
                setMinus(expressionValue);
            }
        } else if (isLastSymbolMinus(expressionValue)) {
            expression.text(expressionValue + "(-)");
        } else {
            if (isModeOn) {
                expression.text(expressionValue + "-");
            } else {
                setMinus(expressionValue);
            }
        }
    }

    function setMinus(expressionValue) {
        if (isModeOn) {
            expression.text(expressionValue + "-");
        } else {
            if (!isResultNeed) {
                expression.text(expressionValue + "-");
                isResultNeed = true;
            } else {
                let result = calculateResult(expressionValue);
                expression.text(result + "-");
                isResultNeed = false;
            }
        }
    }

    function clearExpression() {
        expression.text('');
    }

    function calculateExpression() {
        formatNegative("");
        formatNumber();
        formatDigit();
        formatMinus();
        formatNegative("");

        if (isLastSymbolOperation(expression.text())
            || isLastSymbolDigit(expression.text())
            || isLastSymbolMinus(expression.text())) {
            deleteFromExpression();
        }

        let expressionValue = expression.text();

        if (expressionValue.length === 0) {
            return;
        }

        if (isLastSymbolOperation(expressionValue[0])) {
            expressionValue = expressionValue.substring(1, expressionValue.length);
        }
        if (expressionValue !== ERROR_MAX_LENGTH_MESSAGE) {
            let result = calculateResult(expressionValue);
            expression.text(result);
        }
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
                if (operation === "-") {
                    addMinusToExpression();
                } else {
                    addOperationToExpression(operation);
                }
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
                    addMinusToExpression();
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

        isModeOnCheckBox.click(function () {
            isModeOn = isModeOnCheckBox.prop("checked");
            checkForClean();
            calculateExpression();
        });
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
        if (isCleanNeed) {
            clearExpression();
            isCleanNeed = false;
        }
    }

    function formatNegative(operation) {
        let currentValue = expression.text();
        let negative = currentValue.substring(currentValue.length - 3, currentValue.length);

        if (negative === "(-)") {
            deleteFromExpression();
            deleteFromExpression();
            deleteFromExpression();
            if (isLastSymbolOperation(expression.text())) {
                deleteFromExpression();
                expression.text(expression.text() + operation);
            }
            return true;
        } else {
            let lastNumber = getLastNumber(expression.text());
            if (lastNumber[0] === "("
                && lastNumber[1] === "-"
                && lastNumber[lastNumber.length - 1] !== ")") {
                expression.text(currentValue + ")" + operation);
                return true;
            }

            return false;
        }
    }

    function formatDigit() {
        let expressionValue = expression.text();
        if (isLastSymbolDigit(expressionValue)) {
            deleteFromExpression();
        } else if (expressionValue[expressionValue.length - 1] === ")"
            && expressionValue[expressionValue.length - 2] === ".") {
            expressionValue = expressionValue.substring(0, expressionValue.length - 2) + ")";
            expression.text(expressionValue);
        }
    }

    function formatNumber() {
        let lastNumber = getLastNumber(expression.text());
        if (lastNumber[0] === "0" && lastNumber[1] !== ".") {
            deleteFromExpression();
        }
        if (lastNumber[0] === "("
            && lastNumber[1] === "-"
            && lastNumber[2] === "0"
            && lastNumber[3] !== ".") {
            deleteFromExpression();
        }
    }

    function formatMinus() {
        let currentValue = expression.text();
        if (currentValue[currentValue.length - 1] === "-"
            && currentValue[currentValue.length - 2] === "(") {
            expression.text(expression.text().substring(0, expression.text().length - 2))
        }
    }
});