
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
        .style("color","#2c2c6b")
        .text(label)

    for (let i = 0; i < barCount; i++) {
        buttonContainer.append("div")
            .attr("class", "topicButtonBar")
            .style("opacity", 0) // Start invisible
            .transition()
            .delay(1800 + i * 90) // Stagger bars
            .duration(1200)
            .style("opacity", 1)
    }
}

