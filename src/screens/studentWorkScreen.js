import {backButton} from "../components/backButton.js"
import {openDirectionsScreen} from "./directionsScreen.js"


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
        .text("Dream Hall")

    const description  = details
        .append("div")
        .attr("class","studentWorkDescription")
        .html("Description:<br><br>The best way to activate collections at the university library is to #work with #students!<br><br>That is why we are dedicating the newest exploration of the Collection Wall to student work.<br>The Library has been collaborating with a variety of courses related to data, design, and interactivity. We are building an Education Network to determine how the Collection Wall can become a co-curated source of knowledge for academic pursuits across campus.<br><br>Please tell us what you think and if you would like to join this network of students, staff, and researchers.")

    const extraDetails  = details
        .append("div")
        .attr("class","studentWorkExtraDetails")

    const exhibitionURL = `https://www.youtube.com/watch?v=mO_CqZ8hk7g`
    const QRCode = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(exhibitionURL)}&size=150x150&color=131-143-240&bgcolor=30-28-39`

    const QR = extraDetails
        .append("div")
        .attr("class","studentWorkQR")
        .text("Scan to learn more:")
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
                title: "Dream Hall",
                cover_file: "../photos/student_work.png",
                floor: 2,
                shelf: [498, 487, 488, 489, 490, 491, 492, 493, 494, 495, 496, 497, 499, 500, 501, 502, 503, 504]
            }
            openDirectionsScreen(info)
    })

}

