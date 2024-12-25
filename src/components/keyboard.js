// https://hodgef.com/simple-keyboard/editor/?d=hodgef/simple-keyboard-npm-demos/tree/ios-theme

const keyboardRows = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["↑", "z", "x", "c", "v", "b", "n", "m", "←"],
    [" "], // Use a single space for Space bar
];

let currCase = "lower";


export function keyboard(containerSelector) {
    
    const container = d3.select(containerSelector)
    const outline = container.append("div").attr('class', 'keyboard_outline')

    keyboardRows.forEach((row)=>{createRow(row,outline)})
}

function createRow(keys, outline, targetInputSelector = ".searchInput") {
    const row = outline.append("div").attr("class", "keyboard-row");
    keys.forEach((key) => createKey(row, key, targetInputSelector));
}

function createKey(row, key, targetInputSelector) {
    const isSpecialKey = ["↑", "←"].includes(key);
    const isSpaceKey = key === " "
    var keyClass = isSpecialKey ? "keyboard-key special-key" : "keyboard-key";
    keyClass = isSpaceKey ? "keyboard-key space-key" : keyClass
    const keyLabel = isSpaceKey ? "_____" : key;

    const keyElement = row
        .append("div")
        .attr("class", keyClass)
        .text(keyLabel);

    if (key === "↑"){
        keyElement.attr("id", "shift-key")
    }

    keyElement.on("click", function () {
        const searchBox = d3.select(targetInputSelector);

        if (isSpecialKey) {
            handleSpecialKey(key, searchBox);
        } else {
            searchBox.property("value", function () {
                return this.value + setCase(key);
            });
        }
    });
}

function handleSpecialKey(key, searchBox) {
    switch (key) {
        case "↑":
            shiftKeyboardCases()
            break;
        case "←":
            searchBox.property("value", function () {
                return this.value.slice(0, -1)
            });
            break;
    }
}

function shiftKeyboardCases() {
    d3.selectAll(".keyboard-key")
        .each(function () {
            const element = d3.select(this);
            const currentText = element.text();
            element.text(currCase === "lower" ? currentText.toUpperCase() : currentText.toLowerCase()); 
        });

    currCase = currCase === "lower" ? "upper" : "lower"; 
    const shiftColor = currCase === "lower" ? "transparent" : "#808ff7"
    d3.select("#shift-key").style("background-color", shiftColor)
}


function setCase(text){ 
    if (currCase === "upper") {
        return text.toUpperCase();
    } else {
        return text.toLowerCase();
    }
}
