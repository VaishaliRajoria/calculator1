// Object to hold the calculator's state
const calculator = {
    displayValue: '0', // The value shown on the screen
    firstOperand: null, // The first number in an operation
    waitingForSecondOperand: false, // Flag to check if we're ready for the second number
    operator: null, // The operator for the calculation
};

// Function to update the display
function updateDisplay() {
    const display = document.querySelector('.calculator-screen');
    display.value = calculator.displayValue;
}

updateDisplay(); // Initialize the display

// Event listener for all button clicks
const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', (event) => {
    // Access the clicked element
    const { target } = event;
    const { value } = target;

    // Exit if the clicked element is not a button
    if (!target.matches('button')) {
        return;
    }

    switch (value) {
        case '+':
        case '-':
        case '*':
        case '/':
        case '=':
            handleOperator(value);
            break;
        case '.':
            inputDecimal(value);
            break;
        case 'all-clear':
            resetCalculator();
            break;
        default:
            // Check if the key is an integer
            if (Number.isInteger(parseFloat(value))) {
                inputDigit(value);
            }
    }

    updateDisplay();
});

// Function to handle digit input
function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;

    if (waitingForSecondOperand === true) {
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
    } else {
        // Overwrite '0' or append the digit
        calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
}

// Function to handle decimal input
function inputDecimal(dot) {
    // If waiting for the next number, start with '0.'
    if (calculator.waitingForSecondOperand === true) {
        calculator.displayValue = '0.';
        calculator.waitingForSecondOperand = false;
        return;
    }

    // Add a decimal point only if one doesn't already exist
    if (!calculator.displayValue.includes(dot)) {
        calculator.displayValue += dot;
    }
}

// Function to handle operators
function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue);

    // If an operator is already set, and we're ready for a new one,
    // perform the previous calculation first
    if (operator && calculator.waitingForSecondOperand) {
        calculator.operator = nextOperator;
        return;
    }

    if (firstOperand === null && !isNaN(inputValue)) {
        // Set the first operand if it's not already set
        calculator.firstOperand = inputValue;
    } else if (operator) {
        // If an operator exists, perform the calculation
        const result = calculate(firstOperand, inputValue, operator);
        
        // Format to a fixed number of decimal places to avoid long fractions
        calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
        calculator.firstOperand = result;
    }

    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
}

// Calculation logic
function calculate(firstOperand, secondOperand, operator) {
    if (operator === '+') {
        return firstOperand + secondOperand;
    } else if (operator === '-') {
        return firstOperand - secondOperand;
    } else if (operator === '*') {
        return firstOperand * secondOperand;
    } else if (operator === '/') {
        // Handle division by zero
        if (secondOperand === 0) {
            alert("Error: Cannot divide by zero!");
            return 0;
        }
        return firstOperand / secondOperand;
    }

    return secondOperand; // For the '=' case
}

// Function to reset the calculator
function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
}