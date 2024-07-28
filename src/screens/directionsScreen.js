import {backButton} from "../components/backButton.js"
import { Wall } from "../components/wall.js";

export function initDirectionsScreen() {    
    backButton("#directions-view-header")

    //Set container for wall
    const wallContainer = d3.select(".directions-view__wall")
        .append("svg")
        .attr("height","100%")
        .attr("width","85%");
 
    Wall(wallContainer, "90%")
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
    addShelfHighlight(shelfNumber)
}

function addShelfHighlight(shelfNumber){
    const wallContainer = d3.select(".directions-view__wall").select("svg")
    const wallContainerAttrs = wallContainer.node().getBoundingClientRect()
    const shelfCoords = shelf_positions.filter(item => item.shelf === shelfNumber)[0];
    const WallAspectRatio = 4.443
    const originalShelfWidthPercentage = 0.0126
    const originalShelfHeightPercentage = 0.0213
    const adjustedHeight = wallContainerAttrs.width/WallAspectRatio
    const yOffset = (wallContainerAttrs.height - adjustedHeight)/2

    wallContainer.select("rect").remove() //Remove previous rect (if any)
    const shelfHighlight = wallContainer.append("rect")
         .attr("x", `${shelfCoords.x_perc * wallContainerAttrs.width}px`)
         .attr("y", `${shelfCoords.y_perc * adjustedHeight + yOffset}px`)
         .attr("width", `${originalShelfWidthPercentage * wallContainerAttrs.width}px`)
         .attr("height", `${originalShelfHeightPercentage * adjustedHeight}px`)
         .attr("fill", "yellow")
}
