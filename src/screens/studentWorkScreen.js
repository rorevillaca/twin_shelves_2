import {backButton} from "../components/backButton.js"
import { openDirectionsScreen } from "./directionsScreen.js"


export function initStudentWork() {

    backButton("#object_view--header")

    const summaryContainer = d3.select(".object_view--content")

    const photo = summaryContainer
        .append("div")
        .attr("class", "studentWorkPhoto")
        .append("img")
        .attr("src", "./src/res/photos/student_work.png")

    const details = summaryContainer
        .append("div")
        .attr("class", "studentWorkDetails")

    const title  = details
        .append("div")
        .attr("class","studentWorkTitle")
        .text("Student Work")

    const description  = details
        .append("div")
        .attr("class","studentWorkDescription")
        .html("Description:<br><br>Lorem ipsum dolor sit amet, consectetur adipiscing elit.     Nullam id dolor quis urna aliquet fermentum. Sed suscipit turpis vel tortor viverra, nec tincidunt orci pulvinar. Aenean nec purus ut justo laoreet gravida. Proin nec libero sit amet lacus vehicula ullamcorper. Suspendisse potenti. Sed id convallis nulla, ac bibendum enim. Quisque egestas volutpat velit, non dictum nibh aliquam eget. Integer nec nulla nec lacus tincidunt venenatis sit amet ut magna. ")

    const extraDetails  = details
        .append("div")
        .attr("class","studentWorkExtraDetails")

    const exhibitionURL = `https://tudelft.on.worldcat.org/oclc/`
    const QRCode = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(exhibitionURL)}&size=150x150&color=131-143-240&margin=10`

    
    const QR = extraDetails
        .append("div")
        .attr("class","studentWorkQR")
        .text("Scan to see more about the collection:")
        .append("img")
        .attr("src", QRCode)

    const location = extraDetails
        .append("div")
        .attr("class","studentWorkLocation")

    const locationText = `Floor: <b>2</b>`
    location
        .append("div")
        .attr("class","studentWorkLocationText")
        .html(locationText)

    location
        .append("div")
        .attr("class", "studentWorkLocationButton")
        .html('<b>See location</b>&emsp;<img src="src/res/Font-Awesome/arrow-circle-right.svg" class="inline-icon">')
        .on('click', () => {
            const info = {
                title: "Student Work",
                cover_file: "../photos/student_work.png",
                floor: 2,
                shelf: 495
            }
            openDirectionsScreen(info)
    })

}

