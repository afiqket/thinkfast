
// Assign the objects. Use const to label that it must not change
// - Buttons
let mode = "off"
const onOffButton = document.getElementById("turnOnButton")

// - Label (text)
const counterLabel = document.getElementById("counterLabel");

onOffButton.onclick = function(){
    if (mode == "off") {
        mode = "on"
        onOffButton.id = "turnOffButton"
        onOffButton.textContent = "CLICK TO TURN OFF"
    } else if (mode == "on") {
        mode = "off"
        onOffButton.id = "turnOnButton"
        onOffButton.textContent = "CLICK TO TURN ON"
    }

    console.log(mode)
}