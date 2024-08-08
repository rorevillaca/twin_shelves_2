
export function exhibitionButton(containerSelector, label, id) {

    const exhibitionContainer = d3.select(containerSelector)
    exhibitionContainer
        .append("div")
        .attr("class", "exhibitionsButton")
        .attr("id", id)
        .text(label)
        .on('click', () => {
            console.log(id)
        })
}