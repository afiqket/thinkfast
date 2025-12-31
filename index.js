const numberLabel = document.getElementById("numberLabel")
const myInput = document.getElementById("myInput")
const averageLabel = document.getElementById("averageLabel")
let mode = "OFF"
let curString = ""
let targetString = ""
let prevTime = 0
let curTime = 0
let timeDiff = 0
let timesArray = []

function getRandomDigit() {
    num = Math.floor(Math.random() * 10)
    // console.log("Random int: ", num)
    return num
}

function reset() {
    targetString = getRandomDigit()
    numberLabel.textContent = targetString
    curString = ""
    setTimeout(() => { myInput.value = ""; }, 0);
}

myInput.addEventListener('focus', () => {
    // console.log('Input field focused');
    mode = "ON";
});

myInput.addEventListener('blur', () => {
    // console.log('Input field unfocused');
    mode = "OFF";

    // reset input
    myInput.value = ""
    curString = ""
}); 

document.addEventListener('keydown', function(event) {
    // Code to execute when a key is pressed down

    if (mode == "OFF")
        return 

    key = event.key
    // console.log('Key pressed:', key);

    if (key == "Escape") {
        myInput.value = ""
        curString = ""
    }
    else if (key == "Enter") {
        // console.log("curString: ", curString)
        // console.log(timesArray)
        if (timesArray.length) { 
            let sum = timesArray.reduce((accumulator, curValue) => accumulator + curValue)
            let avg = sum / timesArray.length
            averageLabel.textContent = `Average: ${avg}ms`
            sum = 0
            avg = 0
        }
        reset()
    }
    else if (key == "Backspace") {
        curString = curString.slice(0, curString.length - 1)
    }
    else if (key.length == 1) {
        curString += key
    }

    if (curString != "" && curString == targetString) {
        // console.log("Strings match! Resetting...")
        event.preventDefault();
        curTime = Date.now()
        timeDiff = curTime - prevTime
        console.log(`timediff=${timeDiff}`)
        timesArray.push(timeDiff)        
        reset()
        prevTime = curTime
    }
});

reset()
prevTime = Date.now()