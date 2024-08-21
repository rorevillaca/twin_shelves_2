
export function exhibitionButton(containerSelector, label, id) {

    const exhibitionContainer = d3.
        select(containerSelector).
        append("div")
        .attr("id", id)
    
    exhibitionContainer
        .append("div")
        .attr("class", "exhibitionsButton")
        .text(label)
        .attr("id", id)
        .on('click', () => {
            console.log(id)
        })
}