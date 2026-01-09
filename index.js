const numberLabel = document.getElementById("numberLabel")
const turnOnButton = document.getElementById("turnOnButton")
const myInput = document.getElementById("myInput")
const averageLabel = document.getElementById("averageLabel")
const historyDiv = document.getElementById("historyDiv")
const saveButton = document.getElementById("saveButton")
const loadButton = document.getElementById("loadButton")
const loadButtonInput = document.getElementById("loadButtonInput")
const resetButton = document.getElementById("resetButton")
let mode = "OFF"
let curString = ""
let targetString = ""
let prevTime = 0
let curTime = 0
let timeDiff = 0
let historyEntriesArray = []
const historyElements = []
let timer
let countdownNumber
const HISTORY_KEY = "historyEntries"

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
        const sum = historyEntriesArray.reduce((accumulator, curValue) => accumulator + curValue.time, 0)
        const avg = sum / historyEntriesArray.length
        averageLabel.textContent = `Average: ${avg.toFixed(0)}ms`

        // Remove existing recent history elements
        for (let i = 0; i < historyElements.length; i++) {
            historyElements[i].remove();
        }
        historyElements.length = 0

        // Add new "recent history" elements to the pafe
        const length = historyEntriesArray.length
        for (let i = 0; i < 10; i++) {
            if (length - 1 - i >= 0)
                addHistory(historyEntriesArray[length - 1 - i])
        }

        // Write array onto local storage for later access
        localStorage.setItem(HISTORY_KEY, JSON.stringify(historyEntriesArray))

        console.log("JSON:", JSON.stringify(historyEntriesArray))
    }
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

    historyElements.push(newEntry)
}

turnOnButton.onclick = function(){
    if (mode == "OFF") {
        start()
    }
    else if (mode == "ON" || mode == "STARTING") {
        turnOff()
    }
}

saveButton.onclick = function(){
    const arrayJson = localStorage.getItem(HISTORY_KEY)
    
    const blob = new Blob([arrayJson], {type: "application/json"})
    const url = URL.createObjectURL(blob)

    const aElement = document.createElement("a")
    aElement.href = url
    aElement.download = "historyEntries.json"
    document.body.appendChild(aElement)
    aElement.click()
    aElement.remove()
    URL.revokeObjectURL(url)
}

loadButton.onclick = function(){
    loadButtonInput.click()
}

loadButtonInput.addEventListener("change", async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    loadButtonInput.disabled = true

    try {
        // load file into storage
        const text = await file.text()
        
        let parsedText
        try {
            parsedText = JSON.parse(text)
        } catch {
            alert("Invalid JSON file")
        }

        let isConfirm
        if (historyEntriesArray) {
            isConfirm = confirm("Replace current data?")
        } else {
            isConfirm = true
        }

        if (isConfirm) {
            localStorage.setItem(HISTORY_KEY, text)
            historyEntriesArray = parsedText
        }

        turnOff()

    } finally {
        loadButtonInput.disabled = false
        event.target.value = ""
    }
})

resetButton.onclick = function() {
    let isConfirm = confirm("Reset all data? (This action cannot be reverted unless the data has been exported)")

    if (isConfirm) {
        historyEntriesArray = []
        localStorage.removeItem(HISTORY_KEY)   
        turnOff()
        averageLabel.textContent = `Average: 0ms`

        // Remove existing recent history elements
        for (let i = 0; i < historyElements.length; i++) {
            historyElements[i].remove();
        }
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

// On page load
function main() {
    // load array from localstorage
    const arrayJson = localStorage.getItem(HISTORY_KEY)
    if (arrayJson) {
        historyEntriesArray = JSON.parse(arrayJson)
    } else {
        historyEntriesArray = []
    }

    turnOff()
}

main()