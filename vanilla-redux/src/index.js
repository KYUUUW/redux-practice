const add = document.getElementById("add");
const minus = document.getElementById("minus");
const number = document.getElementById("number");

let count = 0;
number.innerText = count;

const updateText = () => {
    number.innerText = count;
}

const handleAdd = () => {
    count = count + 1;
    //console.log("add", count);
    updateText();
}

const handleMinus = () => {
    count = count - 1;
    //console.log("minus", count);
    updateText();
}

add.addEventListener("click", handleAdd);
minus.addEventListener("click", handleMinus);