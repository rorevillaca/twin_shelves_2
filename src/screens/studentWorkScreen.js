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
        .text("Student Work")

    const description  = details
        .append("div")
        .attr("class","studentWorkDescription")
        .html("Description:<br><br>Through course collaborations, students drew inspiration from the library's extensive collections to create their own works. The CW prototype #2 explores how the Collection Wall can become a co-curated source of knowledge for academic pursuits across campus. The creative results are now showcased on the Wall, offering an interactive experience for the visitors. The authors’ names and photos are prominently featured, celebrating the students' contributions.<br><br>Additionally, professors involved in these courses are invited to curate their own shelves, presenting their TOP 10 book recommendations. This integration of student and faculty inputs with our collections not only enriches the library's offerings but also fosters a collaborative academic environment. The Collection Wall thus becomes a dynamic space where visitors can engage with curated knowledge, fostering inspiration and scholarly exchange. ")

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
                title: "Student Work",
                cover_file: "../photos/student_work.png",
                floor: 2,
                shelf: 495
            }
            openDirectionsScreen(info)
    })

}

