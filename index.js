const numberLabel = document.getElementById("numberLabel")
const turnOnButton = document.getElementById("turnOnButton")
const myInput = document.getElementById("myInput")
const averageLabel = document.getElementById("averageLabel")
const saveButton = document.getElementById("saveButton")
const firstNumberInput = document.getElementById("firstNumberInput")
const symbolSelect = document.getElementById("symbolSelect")
const secondNumberInput = document.getElementById("secondNumberInput")
let mode = "OFF"
let curString = ""
let targetString = ""
let prevTime = 0
let curTime = 0
let timeDiff = 0
const timesArray = []
let timer
let countdownNumber

function getRandomDigit() {
    num = Math.floor(Math.random() * 10)
    // console.log("Random int: ", num)
    return num
}

function reset() {
    targetString = getRandomDigit()
    numberLabel.textContent = targetString
    curString = ""
}

function turnOff() {
    mode = "OFF"
    clearInterval(timer)

    // Reset webpage items
    numberLabel.style.color = "black"
    turnOnButton.id = "turnOnButton"
    turnOnButton.textContent = "START"

    // Reset logic values
    myInput.value = ""
    curString = ""

    // Calculate average if possible
    if (timesArray.length) { 
        let sum = timesArray.reduce((accumulator, curValue) => accumulator + curValue)
        let avg = sum / timesArray.length
        averageLabel.textContent = `Average: ${avg.toFixed(0)}ms`
        sum = 0
        avg = 0
    }

    // Reset array
    timesArray.length = 0
}

function start() {
    mode = "STARTING"
    turnOnButton.id = "turnOffButton"
    turnOnButton.textContent = "STOP"
    myInput.value = ""
    myInput.focus()

    // Start countdown
    countdownNumber = 3
    numberLabel.style.color = "red"
    numberLabel.textContent = countdownNumber

    // setInterval(function, time_ms)
    timer = setInterval(() => {
        countdownNumber--
        numberLabel.textContent = countdownNumber

        if (countdownNumber === 0) {
            numberLabel.style.color = "black"
            mode = "ON"
            prevTime = Date.now()
            reset()
            clearInterval(timer)
        }
    }, 1000);
}

turnOnButton.onclick = function(){
    console.log(mode)
    if (mode == "OFF") {
        start()
    }
    else if (mode == "ON" || mode == "STARTING") {
        turnOff()
    }

}

document.addEventListener('keydown', function(event) {
    key = event.key
    // console.log('Key pressed:', key);

    if (key == "Enter") {
        if (mode == "OFF")
            start()
        else if (mode == "ON" || mode == "STARTING")
            turnOff()
    }

    if (mode == "OFF" || mode == "STARTING")
        return 

    if (key == "Escape") {
        myInput.value = ""
        curString = ""
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
        numberLabel.style.color = "green"
        setTimeout(() => {
            numberLabel.style.color = "black"
        }, 100)
        reset()
        prevTime = curTime
    }
});

saveButton.onclick = function() {
    let num1 = firstNumberInput.value
    let num2 = secondNumberInput.value
    let symbol = symbolSelect.value

    console.log(num1, symbol, num2)
}