import {backButton} from "../components/backButton.js"
import {openDirectionsScreen} from "./directionsScreen.js"

export function initHeritageObjects(){
    backButton("#heritage_view--header")

    const objectContainer = d3.select(".heritage_view--content")
    const shelfNumber = Math.ceil(heritage_data.length/3)

    for (let index = 0; index < shelfNumber; index++) {
        objectContainer
            .append("div")
            .attr("class", "heritageObjectShelf")
            .attr("id", `shelf_${index}`)
        
        infoCard(objectContainer, index)

    }
    const objects = Array.from({length: heritage_data.length}, (v, i) => (i + 1));
    
    objects.forEach((objectId) => {
        const objectData =  heritage_data[objectId - 1]
        const currShelf = Math.floor((objectId-1) / 3)
        const shelf = objectContainer.select(`#shelf_${currShelf}`)

        Thumbnail(shelf, objectData, currShelf, objectId)

    })
}

function Thumbnail(shelf, objectData, currShelf, objectId){      
    const holder = shelf
        .append("div")
        .attr("class", "heritageThumbnail")
        .attr("id", `thumb_${objectId}`)//Im using color as identifier as it doesnt contain weird symbols
        .attr("shelf", currShelf)
        .on('click', () => {
            const infoCard = d3.select(`#info_card_${currShelf}`)
            dimThumbnail({exceptFor:objectId, opacity: 0.4})
            populateInfoCard(infoCard, objectData, currShelf)
        })
        
    const colorBar = holder.append("div")
        .attr("class", "heritageColorBox-container")
        .style("background-color", objectData.color)
        .append("span")
        .attr("class", "heritageColorBox-text")
        .text(objectData.abbreviation)

    const image = holder.append("div")
        .attr("class", "heritageImage")
        .style("background-image", `url("src/res/photos/heritage_objects/${objectData.photo}")`)
        
}

function infoCard(container, index){
    const card = container
        .append("div")
        .attr("class", "heritageInfoCard")
        .attr("id", `info_card_${index}`)

    const header = card
        .append("div")
        .attr("class", "heritageInfoCard--header")

    header.append("span")

    header.append("img")
        .attr("src", "src/res/Font-Awesome/times-circle.svg")
        .attr("class","inline-icon")
        .on('click',function() {
            d3
                .selectAll(".heritageInfoCard")
                .style("display", "none")
            dimThumbnail({exceptFor:null, opacity: 1})
        })

    const main = card
        .append("div")
        .attr("class", "heritageInfoCard--main")

    const footer = card
        .append("div")
        .attr("class", "heritageInfoCard--footer")

    footer.append("div")
                    .attr("class", "info_card--location_details--button")
                    .html('<b>See location</b>&emsp;<img src="src/res/Font-Awesome/arrow-circle-right.svg" class="inline-icon">')
                    .on('click', () => {
                        const info = {
                            title: "Heritage Objects",
                            cover_file: "../photos/student_work.png",
                            floor: 1,
                            shelf: 1048
                        }
                    openDirectionsScreen(info)
                })
    
    const objectInfo = main
        .append("div")
        .attr("class", "heritageInfoCard--block")

    const thesisInfo = main
        .append("div")
        .attr("class", "heritageInfoCard--block")

    const firstThesisInfo = main
        .append("div")
        .attr("class", "heritageInfoCard--block")

}

function populateInfoCard(infoCard, objectData, currShelf){

    //Display infoCard
    d3.selectAll(".heritageInfoCard").style("display", "none")
    infoCard.style("display", "flex")

    //Scroll to content position
    var content = d3.select('.heritage_view--content').node();
    d3.select('.heritage_view--content')
        .property('scrollLeft', (.30+.05) * content.clientWidth * currShelf) //Percentage from CSS (shelf width + 5% column-gap)

    //Populate header
    const header = infoCard.select(".heritageInfoCard--header")
    header
        .style("background-color", objectData.color)
    header
        .select("span")
        .text(objectData.faculty)

    //Set location button color
    infoCard.select(".info_card--location_details--button")
        .style("background-color", objectData.color)
    
}

function dimThumbnail({exceptFor, opacity}){
    d3
        .selectAll(".heritageThumbnail")
        .style("opacity", opacity)
    if (exceptFor !== null) {
        d3
        .selectAll(`#thumb_${exceptFor}`)
        .style("opacity", 1)
    }
}