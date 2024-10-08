import {backButton} from "../components/backButton.js"

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

        Thumbnail(shelf, objectData, currShelf)

    })
}

function Thumbnail(shelf, objectData, currShelf){      
    const holder = shelf
        .append("div")
        .attr("class", "heritageThumbnail")
        .attr("shelf", currShelf)
        
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
    
    const objectInfo = card
        .append("div")
        .attr("class", "heritageInfoCard--block")

    const thesisInfo = card
        .append("div")
        .attr("class", "heritageInfoCard--block")

    const miscInfo = card
        .append("div")
        .attr("class", "heritageInfoCard--block")

}