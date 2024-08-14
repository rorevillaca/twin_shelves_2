
export function topicButton(containerSelector, label, id, barCount) {

    const exhibitionContainer = d3.select(containerSelector)
    const buttonContainer = exhibitionContainer
        .append("div")
        .attr("class", "topicButtonContainer")
        .attr("id", id)
    
    const topicName = buttonContainer
        .append("div")
        .attr("class", "topicButtonName")
        .text(label)

    for (let i = 0; i < barCount; i++) {
        buttonContainer.append("div")
            .attr("class","topicButtonBar")
    }
}