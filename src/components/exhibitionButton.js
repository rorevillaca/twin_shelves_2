
export function exhibitionButton(containerSelector, label, id) {

    const exhibitionContainer = d3.
        select(containerSelector).
        append("div")
        .attr("id", id)
    
    exhibitionContainer
        .append("div")
        .attr("class", "exhibitionsButton")
        .style("color","#2c2c6b")
        .text(label)
        .attr("id", id)
        .on('click', () => {
            console.log(id)
        })
}