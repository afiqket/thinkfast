const numberLabel = document.getElementById("numberLabel")
const turnOnButton = document.getElementById("turnOnButton")
const myInput = document.getElementById("myInput")
const averageLabel = document.getElementById("averageLabel")
const historyDiv = document.getElementById("historyDiv")
let mode = "OFF"
let curString = ""
let targetString = ""
let prevTime = 0
let curTime = 0
let timeDiff = 0
const historyEntriesArray = []
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
    if (historyEntriesArray.length) { 
        let sum = historyEntriesArray.reduce((accumulator, curValue) => accumulator + curValue.time, 0)
        let avg = sum / historyEntriesArray.length
        averageLabel.textContent = `Average: ${avg.toFixed(0)}ms`
        sum = 0
        avg = 0

        const length = historyEntriesArray.length
        for (let i = 0; i < length; i++) {
            addHistory(historyEntriesArray[i])
        }
    }

    // Reset array
    historyEntriesArray.length = 0
}

function start() {
    mode = "STARTING"
    turnOnButton.id = "turnOffButton"
    turnOnButton.textContent = "STOP"
    myInput.value = ""
    curString = ""
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

function addHistory(entry) {
    const newEntry = document.createElement("p")

    newEntry.textContent = `${entry.number}: ${entry.time}ms`
    historyDiv.appendChild(newEntry)
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
        if (mode == "OFF") {
            start()
        }
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
        // console.log(`timediff=${timeDiff}`)
        let entry = {
            number: targetString,
            time: timeDiff 
        }
        historyEntriesArray.push(entry)
        numberLabel.style.color = "green"
        setTimeout(() => {
            numberLabel.style.color = "black"
        }, 100)
        reset()
        prevTime = curTime
    }
});

