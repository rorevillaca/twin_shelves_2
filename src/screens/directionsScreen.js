import { backButton } from "../components/backButton.js"
import { wall, addShelfHighlight } from "../components/wall.js";

export function initDirectionsScreen() {
    backButton("#directions-view-header")

    //Set container for wall
    const wallContainer = d3.select(".directions-view__wall")
        .append("svg")
        .attr("height", "100%")
        .attr("width", "85%");

    wall(wallContainer, "70%", true)
}

export function openDirectionsScreen(bookInfo) {
    d3.select(".directions-view").style("display", "grid");

    addBookCover(bookInfo.cover_file)
    addBookDetails(bookInfo)
    addQR(bookInfo)
    addPath(bookInfo.shelf, bookInfo.floor)
}


function addBookCover(coverFilename) {

    const coverContainer = d3.select(".directions-view__book-details__cover")
    const containerHeight = coverContainer.node().clientHeight;


    if (typeof coverFilename !== 'undefined') {//If image is available
        const imagePath = `src/res/resized_covers_struct/${coverFilename}`;
        coverContainer.style("background-image", `url(${imagePath})`);

        const img = new Image();
        img.src = imagePath;

        img.onload = function () {
            var width = img.naturalWidth;
            var height = img.naturalHeight;
            aspectRatio = width / height;
            const containerWidth = containerHeight * aspectRatio;
            coverContainer.style("width", `${containerWidth}px`);
            coverContainer.style("background-color", null);
        };

    } else {//If no image is available
        var aspectRatio = 0.66
        coverContainer.style("background-image", null);
        coverContainer.style("background-color", "rgba(111, 111, 173, 0.4)");
        coverContainer.style("background-opacity",0.7)
        const containerWidth = containerHeight * aspectRatio;
        coverContainer.style("width", `${containerWidth}px`);
    }
}

function addBookDetails(bookInfo) {

    const locationContainer = d3.select(".directions-view__book-details__location")
    locationContainer.selectAll("*").remove()//Remove previous info (if any)

    locationContainer.append("h1")
        .text(bookInfo.title)
    locationContainer.append("h3")
        .text(bookInfo.authors)

    var locationText = ""

    if ("std_call_number" in bookInfo) {
        locationText = locationText + `Code: <b>${bookInfo.std_call_number}</b>`
    }

    locationText = locationText + `  <b>|</b>  Floor: <b>${bookInfo.floor}</b><br>`
    console.log(bookInfo.shelf)
    if (bookInfo.shelf == 848) locationText = locationText + '<b>AI Librarian | Book Recommendations</b>'
    //if (bookInfo.title == "Heritage Objects") locationText = locationText + '<b>Heritage Exhibition</b>'
    //if (bookInfo.title == "Studet Work") locationText = locationText + '<b>Student Exhibition</b>'

    locationContainer
        .append("div")
        .attr("class","floor-location")
        .html(locationText)
}

function addQR(bookInfo) {
    const imgContainer = d3.select(".directions-view__book-details__QR_holder")
    imgContainer.text("")
    imgContainer.select("*").remove()//Remove previous QR (if any)
    if ("OCLC" in bookInfo) {
        const OCLC = bookInfo.OCLC
        const worldcatURL = `https://tudelft.on.worldcat.org/oclc/${OCLC}`
        const qrCode = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(worldcatURL)}&size=150x150&color=131-143-240&bgcolor=30-28-39`
        imgContainer.text("Scan to see more:")
        imgContainer.append("img")
            .attr("src", qrCode)
    }

}

function addPath(shelfNumber, floorNo) {
    const wallContainer = d3.select(".directions-view__wall").select("svg")
    const wallContainerAttrs = wallContainer.node().getBoundingClientRect()
    //const kioskCoordPercentage = 599.262 / 1002.816
    const kioskCoordPercentage = 250 / 1002.816
    const waypointSize = 20
    const WallAspectRatio = 4.443
    const kioskOffset = 20
    const originalShelfWidthPercentage = 0.0126
    const adjustedHeight = wallContainerAttrs.width / WallAspectRatio
    const yOffset = (wallContainerAttrs.height - adjustedHeight) / 2

    
    shelfNumber = Array.isArray(shelfNumber) ? shelfNumber : [shelfNumber];
    const shelfCoords = shelf_positions
        .filter(item => shelfNumber.includes(item.shelf))
        .sort((a, b) => shelfNumber.indexOf(a.shelf) - shelfNumber.indexOf(b.shelf));
    const blink = true


    wallContainer.selectAll(".wayPoints, .walkingPath").remove() //Remove previous elements (if any)

    d3.select(".floor-location").classed("blinking", true)

    addStation(kioskCoordPercentage,
        kioskOffset,
        wallContainer,
        wallContainerAttrs,
        waypointSize,
        adjustedHeight,
        yOffset)

    addShelfHighlight(shelfCoords,
        wallContainer,
        wallContainerAttrs,
        adjustedHeight,
        yOffset,
        originalShelfWidthPercentage,
        blink
    )

    const route = buildRoute(shelfCoords[0],
        floorNo,
        kioskCoordPercentage,
        wallContainerAttrs,
        adjustedHeight,
        yOffset,
        kioskOffset,
        originalShelfWidthPercentage)
    animatePath(route)
}

function addStation(
    kioskCoordPercentage,
    kioskOffset,
    wallContainer,
    wallContainerAttrs,
    waypointSize,
    adjustedHeight,
    yOffset
) {

    const startingPoint = [kioskCoordPercentage * wallContainerAttrs.width,
    adjustedHeight + yOffset + kioskOffset]

    const Station = wallContainer.append("circle")
        .attr("class", "wayPoints")
        .attr("cx", startingPoint[0])
        .attr("cy", startingPoint[1])
        .attr("r", `${waypointSize / 2}px`)
}


function buildRoute(
    shelfCoords,
    floorNo,
    kioskCoordPercentage,
    wallContainerAttrs,
    adjustedHeight,
    yOffset,
    kioskOffset,
    originalShelfWidthPercentage
) {

    const floorYPercentage = [
        0.963,
        0.800,
        0.638,
        0.476
    ]

    const leftStairsPercentage = [
        [[0.129, floorYPercentage[0]], [0.139, floorYPercentage[0]], [0.196, floorYPercentage[1]], [0.205, floorYPercentage[1]]],
        [[0.215, floorYPercentage[1]], [0.271, floorYPercentage[2]], [0.282, floorYPercentage[2]]],
        [[0.291, floorYPercentage[2]], [0.348, floorYPercentage[3]], [0.357, floorYPercentage[3]]]
    ]

    const rightStairsPercentage = [
        [[0.511, floorYPercentage[0]], [0.520, floorYPercentage[0]], [0.577, floorYPercentage[1]], [0.590, floorYPercentage[1]]],
        [[0.623, floorYPercentage[1]], [0.680, floorYPercentage[2]], [0.691, floorYPercentage[2]]],
        [[0.699, floorYPercentage[2]], [0.756, floorYPercentage[3]], [0.766, floorYPercentage[3]]]
    ]

    // Add kiosk to route
    var route = [[kioskCoordPercentage, (adjustedHeight + kioskOffset) / adjustedHeight],
    [kioskCoordPercentage, floorYPercentage[0]]]

    // Add escalators
    for (let index = 0; index < floorNo - 1; index++) {
        if (shelfCoords.x_perc > 0.4) {
            route = route.concat(rightStairsPercentage[index]);
        } else {
            route = route.concat(leftStairsPercentage[index]);
        }
    }

    // Add destination shelf to route
    route = route.concat([[shelfCoords.x_perc * 1.005 + originalShelfWidthPercentage / 2, floorYPercentage[floorNo - 1]]]);
    route = route.concat([[shelfCoords.x_perc * 1.005 + originalShelfWidthPercentage / 2, shelfCoords.y_perc]]);


    // Convert route from percentage to screen pixels
    const transformedRoute = route.map(d => [
        d[0] * wallContainerAttrs.width,
        d[1] * adjustedHeight + yOffset
    ]);

    // Create path data string from coordinates
    const routeData = transformedRoute.map(d => d.join(",")).join(" L ");
    const routeString = `M ${routeData}`;

    return routeString
}

function animatePath(route) {

    const wallContainer = d3.select(".directions-view__wall").select("svg")

    // Append path to the SVG
    const path = wallContainer.append("path")
        .attr("d", route)
        .attr("class", "walkingPath");

    // Calculate total length of the path
    const totalLength = path.node().getTotalLength();

    // Apply animation to draw the line
    path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);
}