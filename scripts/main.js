document.addEventListener('DOMContentLoaded', function() {
    // SCREEN TARGETS
    const oldValueDisplay = document.getElementById('oldValueDisplay');
    const operatorDisplay = document.getElementById('operatorDisplay');
    const mainValueDisplay = document.getElementById('mainValueDisplay');
    // BUTTON TARGETS
    const operatorButtons = document.querySelectorAll('button.button--operator');
    const numberButtons = document.querySelectorAll('button.button--number');
    const dotButton = document.querySelector('button.button--dot');
    const backspaceButton = document.querySelector('button.button--delete');
    const utilityButtons = document.querySelectorAll('button.button--utility');

    let currentValue = "";
    const MAX_DISPLAY_LENGTH = 12;

    // EVENT LISTENERS
    operatorButtons.forEach((element)=>{
        element.addEventListener('click', handleOperator);
    })
    numberButtons.forEach((element)=>{
        element.addEventListener('click', handleNumber);
    })
    utilityButtons.forEach((element)=>{
        element.addEventListener('click', handleUtility);
    })
    dotButton.addEventListener('click', handleDot);
    backspaceButton.addEventListener('click', handleBackspace);
    document.addEventListener('keydown', handleKeyboard);

    function handleKeyboard(event) {
        const keyPressed = event.key;

        switch (keyPressed) {
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                handleNumber({ target: { textContent:keyPressed }})
                break;
            case '=':
            case 'Enter':
                handleOperator({ target: { textContent: '=' } });
                break;
            case '+':
                handleOperator({ target: { textContent: keyPressed } });
                break;
            case '-':
                handleOperator({ target: { textContent: "–" } });
                break;
            case '*':
                handleOperator({ target: { textContent: "x" } });
                break;
            case '/':
                handleOperator({ target: { textContent: "÷" } });
                break;
            case '.':
                handleDot();
                break;
            case 'Escape':
                handleUtility({ target: { textContent: 'AC' }});
                break;
            case 'Backspace':
                handleBackspace();
                break;
            case '%':
                handleUtility({ target: { textContent: '%' }});
                break;
        
            default:
                break;
        }
    }

    function handleBackspace() {
        if(mainValueDisplay.textContent.length){
            currentValue = mainValueDisplay.textContent.slice(0, -1);
            mainValueDisplay.textContent = currentValue;
        }
    }

    function handleOperator(event) {
        if (mainValueDisplay.textContent.endsWith(".")) return;
    
        const operatorClicked = event.target.textContent;
        if (operatorClicked === "=") {
            handleCalculation();
            oldValueDisplay.textContent = ""; 
            operatorDisplay.textContent = "";
            return;
        } else {
            const shouldCalculateFirst = Boolean(oldValueDisplay.textContent) 
                    && Boolean(operatorDisplay.textContent) && Boolean(mainValueDisplay.textContent);
    
            if (shouldCalculateFirst) {
                handleCalculation();
                // move to top
                oldValueDisplay.textContent = currentValue; //new current value from calculation
                operatorDisplay.textContent = operatorClicked;
                mainValueDisplay.textContent = "";
                currentValue = "";
            } else if (oldValueDisplay.textContent && operatorDisplay.textContent) {
                //all we want here is to change the operator
                operatorDisplay.textContent = operatorClicked;
            } else if (currentValue.length === 0) {
                return;
            } else {
                oldValueDisplay.textContent = currentValue;
                operatorDisplay.textContent = operatorClicked;
                mainValueDisplay.textContent = "";
                currentValue = "";
            }
        }
    }
    
    function handleNumber(event){
        if(currentValue.length >= MAX_DISPLAY_LENGTH) return;

        const numberClicked = event.target.textContent;

        if(currentValue.length === 0 || currentValue === "0"){
            currentValue = numberClicked;
        } else {
            currentValue = `${currentValue}${numberClicked}`;
        }
        
        mainValueDisplay.textContent = currentValue;
    }

    function handleUtility(event) {
        const utilityValue = event.target.textContent;

        switch (utilityValue) {
            case "AC":
                handleReset();
                break;
            case "+/-":
                handleTogglePositivity();
                break;
            case "%":
                handleTogglePercentage();
                break;
        
            default:
                break;
        }
    }

    function handleReset(){
        oldValueDisplay.textContent = "";
        mainValueDisplay.textContent = "";
        operatorDisplay.textContent = ""
        currentValue = "";
    }

    function handleTogglePositivity() {
        if(currentValue.length >= MAX_DISPLAY_LENGTH || currentValue === "0") return;

        if(mainValueDisplay.textContent){
            if(currentValue.includes('-')){
                currentValue = currentValue.split('-')[1];
            } else {
                currentValue = `-${currentValue}`;
            }

            mainValueDisplay.textContent = currentValue;
        }
    }

    function handleTogglePercentage() {
        if(currentValue.length >= MAX_DISPLAY_LENGTH || currentValue === "0") return;

        if(mainValueDisplay.textContent){
            currentValue = (sanitizeNumber(currentValue) / 100).toString();
            mainValueDisplay.textContent = currentValue;
        }
    }

    function handleDot() {
        if(currentValue.length >= MAX_DISPLAY_LENGTH || currentValue.includes('.')) return;

        if(currentValue.length === 0){
            currentValue = "0.";
        } else {
            currentValue = `${currentValue}.`;
        }

        mainValueDisplay.textContent = currentValue;
    }

    function handleCalculation(){
        if(oldValueDisplay.textContent && mainValueDisplay.textContent && operatorDisplay.textContent){
            if(mainValueDisplay.textContent.endsWith('.')) return;

            const leftHandSide = sanitizeNumber(oldValueDisplay.textContent);
            const rightHandSide = sanitizeNumber(mainValueDisplay.textContent);

            switch (operatorDisplay.textContent) {
                case "÷":
                    currentValue = rightHandSide === 0
                    ? (()=> {
                        alert('You know you can\'t do that silly');
                        return "0"
                    })()
                    : sanitizeNumber(leftHandSide / rightHandSide).toString();
                    break;
                case "x":
                    currentValue = sanitizeNumber(leftHandSide * rightHandSide).toString();
                    break;
                case "–":
                    currentValue = sanitizeNumber(leftHandSide - rightHandSide).toString();
                    break;
                    
                default:
                    currentValue = sanitizeNumber(leftHandSide + rightHandSide).toString();
                    break;
            }


            mainValueDisplay.textContent = currentValue;
        }
    }

    function sanitizeNumber(numberToSanitize) {
        if(typeof numberToSanitize === 'number'){
            // handle too large or too small numbers
            if(numberToSanitize.toString().length >= MAX_DISPLAY_LENGTH){
                numberToSanitize = numberToSanitize.toExponential(2);
            } else {
                numberToSanitize = numberToSanitize.toString();
            }
        }

        const isFloat = numberToSanitize.includes('.');
        if(isFloat){
            if(numberToSanitize.includes('-') || numberToSanitize.includes('+')){
                // is out of bounds number
                return numberToSanitize;
            } else {
                //is normal float
                const decimalPlaceLength = numberToSanitize.split('.')[1].length;
                if(decimalPlaceLength > 1){
                    return Number(parseFloat(numberToSanitize).toFixed(2));
                } else {
                    return parseFloat(numberToSanitize);
                }
            }
        } else {
            return parseInt(numberToSanitize);
        }
    }
})
