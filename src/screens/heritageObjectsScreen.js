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
        shelf
            .append("div")
            .attr("class", "heritageObject")
            .attr("shelf", currShelf)
            .style("background-image", `url("src/res/photos/heritage_objects/${objectData.photo}")`)
            // .style("background-color", objectData.color)
    })
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