document.addEventListener("DOMContentLoaded", function () {
  // SCREEN TARGETS
  const oldValueDisplay = document.getElementById("oldValueDisplay");
  const operatorDisplay = document.getElementById("operatorDisplay");
  const mainValueDisplay = document.getElementById("mainValueDisplay");
  // BUTTON TARGETS
  const operatorButtons = document.querySelectorAll("button.button--operator");
  const numberButtons = document.querySelectorAll("button.button--number");
  const dotButton = document.querySelector("button.button--dot");
  const backspaceButton = document.querySelector("button.button--delete");
  const utilityButtons = document.querySelectorAll("button.button--utility");

  let currentValue = "";
  const MAX_DISPLAY_LENGTH = 12;

  // EVENT LISTENERS
  operatorButtons.forEach((element) => {
    element.addEventListener("click", (event) =>
      handleOperator(event.target.textContent)
    );
  });
  numberButtons.forEach((element) => {
    element.addEventListener("click", (event) =>
      handleNumber(event.target.textContent)
    );
  });
  utilityButtons.forEach((element) => {
    element.addEventListener("click", (event) =>
      handleUtility(event.target.textContent)
    );
  });
  dotButton.addEventListener("click", handleDot);
  backspaceButton.addEventListener("click", handleBackspace);
  document.addEventListener("keydown", (event) => handleKeyboard(event.key));

  function handleKeyboard(keyPressed) {
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
        handleNumber(keyPressed);
        break;
      case "=":
      case "Enter":
        handleOperator("=");
        break;
      case "+":
        handleOperator(keyPressed);
        break;
      case "-":
        handleOperator("-");
        break;
      case "*":
        handleOperator("x");
        break;
      case "/":
        handleOperator("÷");
        break;
      case ".":
        handleDot();
        break;
      case "Escape":
        handleUtility("AC");
        break;
      case "Backspace":
        handleBackspace();
        break;
      case "%":
        handleUtility("%");
        break;

      default:
        break;
    }
  }

  function handleBackspace() {
    if (mainValueDisplay.textContent.length) {
      if (mainValueDisplay.textContent.includes("e")) currentValue = "0";
      else currentValue = mainValueDisplay.textContent.slice(0, -1);
      mainValueDisplay.textContent = currentValue;
    }
  }

  function handleOperator(operatorClicked) {
    if (mainValueDisplay.textContent.endsWith(".")) return;

    if (operatorClicked === "=") {
      handleCalculation();
      oldValueDisplay.textContent = "";
      operatorDisplay.textContent = "";
      return;
    } else {
      const shouldCalculateFirst =
        Boolean(oldValueDisplay.textContent) &&
        Boolean(operatorDisplay.textContent) &&
        Boolean(mainValueDisplay.textContent);

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

  function handleNumber(numberClicked) {
    if (currentValue.length >= MAX_DISPLAY_LENGTH) return;

    if (currentValue.length === 0 || currentValue === "0") {
      currentValue = numberClicked;
    } else {
      currentValue = `${currentValue}${numberClicked}`;
    }

    mainValueDisplay.textContent = currentValue;
  }

  function handleUtility(utilityValue) {
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

  function handleReset() {
    oldValueDisplay.textContent = "";
    mainValueDisplay.textContent = "";
    operatorDisplay.textContent = "";
    currentValue = "";
  }

  function handleTogglePositivity() {
    if (currentValue.length >= MAX_DISPLAY_LENGTH || currentValue === "0")
      return;

    if (mainValueDisplay.textContent) {
      if (currentValue.includes("-")) {
        currentValue = currentValue.split("-")[1];
      } else {
        currentValue = `-${currentValue}`;
      }

      mainValueDisplay.textContent = currentValue;
    }
  }

  function handleTogglePercentage() {
    if (currentValue === "0") return;

    if (mainValueDisplay.textContent) {
      currentValue = (sanitizeNumber(currentValue) / 100).toString();
      mainValueDisplay.textContent = currentValue;
    }
  }

  function handleDot() {
    if (currentValue.length >= MAX_DISPLAY_LENGTH || currentValue.includes("."))
      return;

    if (currentValue.length === 0) {
      currentValue = "0.";
    } else {
      currentValue = `${currentValue}.`;
    }

    mainValueDisplay.textContent = currentValue;
  }

  function handleCalculation() {
    if (
      oldValueDisplay.textContent &&
      mainValueDisplay.textContent &&
      operatorDisplay.textContent
    ) {
      if (mainValueDisplay.textContent.endsWith(".")) return;

      const leftHandSide = sanitizeNumber(oldValueDisplay.textContent);
      const rightHandSide = sanitizeNumber(mainValueDisplay.textContent);

      switch (operatorDisplay.textContent) {
        case "÷":
          currentValue =
            rightHandSide === 0
              ? (() => {
                  alert("You know you can't do that silly");
                  return "0";
                })()
              : sanitizeNumber(leftHandSide / rightHandSide).toString();
          break;
        case "x":
          currentValue = sanitizeNumber(
            leftHandSide * rightHandSide
          ).toString();
          break;
        case "–":
          currentValue = sanitizeNumber(
            leftHandSide - rightHandSide
          ).toString();
          break;

        default:
          currentValue = sanitizeNumber(
            leftHandSide + rightHandSide
          ).toString();
          break;
      }

      mainValueDisplay.textContent = currentValue;
    }
  }

  function sanitizeNumber(numberToSanitize) {
    if (typeof numberToSanitize === "number") {
      // handle too large or too small numbers
      if (numberToSanitize.toString().length >= MAX_DISPLAY_LENGTH) {
        numberToSanitize = numberToSanitize.toExponential(2);
      } else {
        numberToSanitize = numberToSanitize.toString();
      }
    }

    const isFloat = numberToSanitize.includes(".");
    if (isFloat) {
      if (numberToSanitize.includes("-") || numberToSanitize.includes("+")) {
        // is out of bounds number
        return numberToSanitize;
      } else {
        //is normal float
        const decimalPlaceLength = numberToSanitize.split(".")[1].length;
        if (decimalPlaceLength > 1) {
          return Number(parseFloat(numberToSanitize).toFixed(2));
        } else {
          return parseFloat(numberToSanitize);
        }
      }
    } else {
      return parseInt(numberToSanitize);
    }
  }
});
