import {backButton} from "../components/backButton.js"
import {openDirectionsScreen} from "./directionsScreen.js"


export function initRobotSociety() {

    backButton("#robot_view--header")

    const summaryContainer = d3.select(".robot_view--content")

    const photo = summaryContainer
        .append("div")
        .attr("class", "studentWorkPhoto")
        .append("img")
        .attr("src", "./src/res/photos/robot_society.png")

    const details = summaryContainer
        .append("div")
        .attr("class", "studentWorkDetails")

    const title  = details
        .append("div")
        .attr("class","studentWorkTitle")
        .html("Robot & Society<br>ME | TPM course exhibition")

    const description  = details
        .append("div")
        .attr("class","studentWorkDescription")
        .html("Description:<br><br>Mandatory ethics classes at TU Delft may be the only time in a degree that students have dedicated space to explore the socio-political-ecological implications of the technologies they will come to build.<br><br>Understanding robots requires attention beyond mere function and form.<br>Or, as Gergory Bateson says, 'it’s [technology] not just that and nothing more'<br><br>These machines emerge from a complex web of relationships that span time and space— from workers in mines, war negotiations, politicians speeches, sci-fi worlds, and e-waste sites. Robots and Society is designed to expand students’ perceptions to consider these aspects of robotics in their engineering careers.<br><br>Coordinator dr. Madeleine Ley (based on the course from dr. Olya Kudina)<br><br>Coach Jordi Viader Guerrero, Dmitry Muravev, Giorgia Pozzi, and Yunxuan Miao.")

    const extraDetails  = details
        .append("div")
        .attr("class","studentWorkExtraDetails")

    const exhibitionURL = `https://www.tudelft.nl/en/evenementen/2025/library/05-mei/robot-parade`
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
                title: "Robot & Society",
                cover_file: "../photos/robot_society.png",
                floor: 2,
                shelf: [715, 716, 717, 718, 719, 720, 721, 722, 723, 724, 725, 726, 727, 728, 729, 730, 731, 732]
            }
            openDirectionsScreen(info)
    })

}

