
export function topicButton(containerSelector, label, id, barCount) {

    const exhibitionContainer = d3.select(containerSelector)
    const buttonContainer = exhibitionContainer
        .append("div")
        .attr("class", "topicButtonContainer")
        .attr("id", id)
        
    buttonContainer
        .style("opacity", 0)

    const topicName = buttonContainer
        .append("div")
        .attr("class", "topicButtonName")
        .text(label)

    for (let i = 0; i < barCount; i++) {
        buttonContainer.append("div")
            .attr("class", "topicButtonBar")
            .style("opacity", 0) // Start invisible
            .transition()
            .delay(300 + i * 100) // Stagger bars
            .duration(1200)
            .style("opacity", 1)
    }
}

