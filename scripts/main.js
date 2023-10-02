console.log("test");

const h1 = document.getElementsByTagName('h1');
let arr = [];
const handleButton = (value) => {
    if( typeof value === 'number' ){
        arr.push(value);
        const num = arr.join("");
        const input = document.getElementsByTagName('input')[0].defaultValue = num;
    }
}