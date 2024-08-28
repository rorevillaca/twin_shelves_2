import {backButton} from "../components/backButton.js"

export function initHeritageObjects(){
    backButton("#heritage_view--header")

    const objectContainer = d3.select(".heritage_view--content")
    const objects = Array.from({length: heritage_data.length}, (v, i) => (i + 1));
    
    objects.forEach((object_id) => {
        const objectData =  heritage_data[object_id - 1]
        const currShelf = Math.ceil(object_id / 3)
        
        if (object_id % 3 === 1) {
            objectContainer
                .append("div")
                .attr("class", "heritageObjectShelf")
                .attr("id", `shelf_${currShelf}`)
        }

        const shelf = objectContainer.select(`#shelf_${currShelf}`)
        shelf
            .append("div")
            .attr("class", "heritageObject")
            .style("background-image", `url("src/res/photos/heritage_objects/${objectData.photo}")`)
            // .style("background-color", objectData.color)
    })
}