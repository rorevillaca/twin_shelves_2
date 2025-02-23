
export function backButton(containerSelector) {

    const buttonContainer = d3.select(containerSelector);
    const screen = d3.select(buttonContainer.node().parentNode);

    const headerBackDiv = buttonContainer.append('div')
        .attr('class', 'header-back');

    headerBackDiv.append('img')
        .attr('src', "src/res/Font-Awesome/chevron-left.svg")
        .attr('class', 'chevron-left')
        .on('click', () => {
            screen.style('display', 'none')
        })

    headerBackDiv.append('p')
        .attr('class', 'back-text')
        .text("Back")
        .on('click', () => {
            screen.style('display', 'none')
        })
}

export function closeAllSecondaryScreens() {
    const secondaryScreens = d3.selectAll(".secondary_screen");
    secondaryScreens.style('display', 'none')
}