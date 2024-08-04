import {backButton} from "../components/backButton.js"
import { Wall } from "../components/wall.js";

export function initDirectionsScreen() {    
    backButton("#directions-view-header")

    //Set container for wall
    const wallContainer = d3.select(".directions-view__wall")
        .append("svg")
        .attr("height","100%")
        .attr("width","85%");
 
    Wall(wallContainer, "90%", true)
}

export function openDirectionsScreen(OCLC) {
    d3.select(".directions-view").style("display", "grid");

    const book_info = workshop_data.filter(book => book.OCLC === OCLC)[0];

    addBookCover(book_info.cover_file)
    addBBookDetails(book_info)
    addQR(book_info.OCLC)
    addPath(book_info.shelf)
}


function addBookCover(coverFilename){

    const coverContainer = d3.select(".directions-view__book-details__cover")
    const containerHeight = coverContainer.node().clientHeight;

    
    if (typeof coverFilename !== 'undefined') {//If image is available
        const imagePath = `src/res/resized_covers_struct/${coverFilename}`;
        coverContainer.style("background-image", `url(${imagePath})`);
        
        const img = new Image();
        img.src = imagePath;

        img.onload = function() {
            var width = img.naturalWidth;
            var height = img.naturalHeight;
            aspectRatio = width / height;
            const containerWidth = containerHeight * aspectRatio;
            coverContainer.style("width",`${containerWidth}px`);
            coverContainer.style("background-color", null);
        };

    } else {//If no image is available
        var aspectRatio = 0.66
        coverContainer.style("background-image", null);
        coverContainer.style("background-color", "silver");
        const containerWidth = containerHeight * aspectRatio;
        coverContainer.style("width",`${containerWidth}px`);
    }


}

function addBBookDetails(bookInfo){
    
    const locationContainer = d3.select(".directions-view__book-details__location")
    locationContainer.selectAll("*").remove()//Remove previous info (if any)
    
    locationContainer.append("h1")
        .text(bookInfo.title)
    locationContainer.append("h3")
        .text(bookInfo.authors)

    const locationText = `Code: <b>${bookInfo.std_call_number}</b><br>Floor: <b>${bookInfo.floor}</b><br>Shelf: <b>${bookInfo.shelf}</b>` 
    locationContainer.append("div").html(locationText)
}

function addQR(OCLC){
    const worldcatURL = `https://tudelft.on.worldcat.org/oclc/${OCLC}`
    const qrCode = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(worldcatURL)}&size=150x150&color=131-143-240&margin=10`
    const imgContainer = d3.select(".directions-view__book-details__QR_holder")
    imgContainer.select("img").remove()//Remove previous QR (if any)
    imgContainer.append("img")
      .attr("src", qrCode)
}

function addPath(shelfNumber){
    //addShelfHighlight(shelfNumber)
    followPath()
}

function addShelfHighlight(shelfNumber){
    const wallContainer = d3.select(".directions-view__wall").select("svg")
    const wallContainerAttrs = wallContainer.node().getBoundingClientRect()
    const shelfCoords = shelf_positions.filter(item => item.shelf === shelfNumber)[0];
    const WallAspectRatio = 4.443
    const originalShelfWidthPercentage = 0.0126
    const originalShelfHeightPercentage = 0.0213
    const shelfWidth = originalShelfWidthPercentage * wallContainerAttrs.width  
    const shelfHeight = originalShelfHeightPercentage * wallContainerAttrs.height  
    const adjustedHeight = wallContainerAttrs.width/WallAspectRatio
    const yOffset = (wallContainerAttrs.height - adjustedHeight)/2

    const waypointSize = 20
    
    wallContainer.selectAll(".wayPoints, .walkingPath").remove() //Remove previous rect (if any)
    
    const Station = wallContainer.append("rect")
        .attr("class", "wayPoints")
        .attr("x", `${0.5 * wallContainerAttrs.width}`)
        .attr("y", `${adjustedHeight + yOffset + 20}`)
        .attr("width", waypointSize)
        .attr("height", waypointSize)

    const shelfCenterX = shelfCoords.x_perc * wallContainerAttrs.width + shelfWidth / 2
    const shelfCenterY = shelfCoords.y_perc * adjustedHeight + yOffset + shelfHeight / 2

    const shelfHighlight = wallContainer.append("circle")
        .attr("class", "wayPoints")
        .attr("cx", shelfCenterX)
        .attr("cy", shelfCenterY)
        .attr("r", `${waypointSize  / 2}px`)

    // // Function to animate line drawing
    // function animateLine() {
    //     const line = wallContainer.append('line')
    //         .attr("class", "walkingPath")
    //         .attr("x1", `${0.5 * wallContainerAttrs.width + waypointSize / 2}`)
    //         .attr("y1", `${adjustedHeight + yOffset + 20 + waypointSize / 2}`)
    //         .attr("x2", shelfCenterX)
    //         .attr("y2", shelfCenterY)

    //     const totalLength = Math.sqrt(Math.pow(shelfCenterX - (0.5 * wallContainerAttrs.width + waypointSize / 2), 2) +
    //                                     Math.pow(shelfCenterY - (adjustedHeight + yOffset + 20 + waypointSize / 2), 2));

    //     line.attr("stroke-dasharray", totalLength + " " + totalLength)
    //         .attr("stroke-dashoffset", totalLength)
    //         .transition()
    //         .duration(1000)
    //         .ease(d3.easeLinear)
    //         .attr("stroke-dashoffset", 0);
    //}

    // Delay the appending of the line
    setTimeout(animateLine, 800);
}


function followPath(){

    const wallContainer = d3.select(".directions-view__wall").select("svg")
    const wallContainerAttrs = wallContainer.node().getBoundingClientRect()
    const WallAspectRatio = 4.443
    const adjustedHeight = wallContainerAttrs.width/WallAspectRatio
    const yOffset = (wallContainerAttrs.height - adjustedHeight)/2


    const coordinates = [
        [0.137, 0.955],
        [0.196, 0.786],
        [0.215, 0.786],
        [0.272, 0.622],
        [0.291, 0.622],
        [0.348, 0.458],
        [0.365, 0.458]
        
    ];

    const transformedCoordinates = coordinates.map(d => [
        d[0] * wallContainerAttrs.width,
        d[1] * adjustedHeight + yOffset
    ]);

    // Create path data string from coordinates
    const pathData = transformedCoordinates.map(d => d.join(",")).join(" L ");
    const pathString = `M ${pathData}`;

    // Append path to the SVG
    const path = wallContainer.append("path")
        .attr("d", pathString)
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