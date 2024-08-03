export function Wall(container, opacity, stairs) {
    
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