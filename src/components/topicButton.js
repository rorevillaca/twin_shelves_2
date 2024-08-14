
export function topicButton(containerSelector, label, id, barCount) {

    const exhibitionContainer = d3.select(containerSelector)
    const buttonContainer = exhibitionContainer
        .append("div")
        .attr("class", "topicButtonContainer")
    
    const topicName = buttonContainer
        .append("div")
        .attr("class", "topicButtonName")
        .attr("id", id)
        .text(label)
        .on('click', () => {
            console.log(id)
        })

    for (let i = 0; i < barCount; i++) {
        buttonContainer.append("div")
            .attr("class","topicButtonBar")
    }
}