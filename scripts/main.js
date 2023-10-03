let currentValue = undefined;
let operator = undefined;
let arr = [];
let isFloat = false;

function handleButton(value) {
  if (typeof value === "number") {
    handleDigit(value);
  } else if (value === "AC") {
    handleClear();
  } else if (value == ".") {
    handleDot();
  } else if (value === "=") {
    operate();
  } else if (isDoubleOperator(value)) {
    handleDoubleOperator(value);
  } else {
    handleSingleOperator(value);
  }
}

function operate() {
  if (arr.length === 0) return;
  const value = parseFloat(arr.join(""));
  if (!currentValue) currentValue = value;
  else
    switch (operator) {
      case "*":
        currentValue = currentValue * value;
        break;
      case "+":
        currentValue = currentValue + value;
        break;
      case "-":
        currentValue = currentValue - value;
        break;
      case "/":
        currentValue = currentValue / value;
        break;
    }

  arr = [];
  isFloat = false;
  turnOffOperator();
  display(currentValue);
}

function handleDigit(digit) {
  arr.push(digit);
  const num = arr.join("");
  display(num);
}

function handleClear() {
  arr = [];
  currentValue = undefined;
  isFloat = false;
  turnOffOperator();
  display(0);
}

function handleCalculate() {}

function handleDot() {
  if (!isFloat) {
    isFloat = true;
    if (arr.length === 0) {
      currentValue = undefined;
      arr.push("0");
    }
    arr.push(".");
    const num = arr.join("");
    display(num);
  }
}

function handleDoubleOperator(value) {
  if (currentValue === undefined) {
    const num = arr.join("");
    if (num === "") currentValue = 0;
    else currentValue = parseFloat(num);
    display(currentValue);
    arr = [];
    isFloat = false;
  } else {
    operate();
  }

  turnOffOperator();
  turnOnOperator(value);
}

function handleSingleOperator(op) {
  turnOffOperator();
  const value =
    arr.length === 0
      ? currentValue === undefined
        ? 0
        : currentValue
      : parseFloat(arr.join(""));

  let newValue;
  if (op === "%") {
    newValue = value / 100;
  } else if (op === "+/-") {
    newValue = -value;
  }
  arr = newValue.toString().split("");
  isFloat = arr.includes(".");
  display(newValue);
  currentValue = undefined;
}

function display(content) {
  document.getElementsByTagName("input")[0].defaultValue = content;
}

function turnOnOperator(value) {
  if (operator === undefined) {
    operator = value;
    const e = document.getElementById(value);
    if (e) e.className = "button__operator-active";
  }
}

function turnOffOperator() {
  if (operator !== undefined) {
    document.getElementById(operator).className = "button__operator";
    operator = undefined;
  }
}

function isDoubleOperator(op) {
  return ["+", "-", "*", "/"].includes(op);
}
