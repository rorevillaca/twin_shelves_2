export function wall(container, opacity, stairs) {
    
    //Add the wall silhouette
    container.append("g")
        .attr("id", "wall_background")
        .append("image")
        .attr("xlink:href","src/res/wall_vector.svg")
        .attr("height", "100%")
        .attr("width", "100%")
        .attr("opacity", opacity)
        .attr("x", "0")
        .attr("y", "0%")

    //Add the stairs
    if (stairs) {
        container.append("g")
        .append("image")
        .attr("xlink:href","src/res/stairs.svg")
        .attr("height", "100%")
        .attr("width", "100%")
        .attr("opacity", opacity)
        .attr("x", "0")
        .attr("y", "0%")
    }

}


export function addShelfHighlight(
    shelfCoords,
    wallContainer,
    wallContainerAttrs,
    adjustedHeight,
    yOffset,
    originalShelfWidthPercentage,
    blink
) {

    const wallRatio = 0.2250 //from inkscape (height / width)
    const wallHeight = wallContainerAttrs.width * wallRatio

    const originalShelfHeightPercentage = 0.0213
    const shelfWidth = originalShelfWidthPercentage * wallContainerAttrs.width  
    const shelfHeight = originalShelfHeightPercentage * wallHeight 

    shelfCoords.forEach(element => {
        const shelfCorner = [
            element.x_perc * wallContainerAttrs.width,
            element.y_perc * adjustedHeight + yOffset
        ]
        
        const shelfHighlight = wallContainer.append("rect")
            .attr("class", "wayPoints")
            .attr("x", element.x_perc * 100 * 1.005 + "%")
            .attr("y", shelfCorner[1])
            .attr("width", shelfWidth)
            .attr("height", shelfHeight)
        
        if (blink){ 
            shelfHighlight.classed("wayPoints blinking", true)
        }
    });

}