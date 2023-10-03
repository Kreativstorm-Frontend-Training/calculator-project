console.log("test");

const h1 = document.getElementsByTagName("h1");
let arr = [];
function handleButton(value) {
  if (typeof value === "number") {
    handleDigit(value);
  }
}

function handleDigit(digit) {
  arr.push(digit);
  const num = arr.join("");
  const input = (document.getElementsByTagName("input")[0].defaultValue = num);
}
