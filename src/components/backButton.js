
export function backButton(containerSelector) {

    const secondLevelScreens = [
        '#shelf-view--header',    
        '#object_view--header',
        '#heritage_view--header',
        '#search-screen-header']

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
            secondLevelScreens.includes(containerSelector)? alterMainTextOpacity(1):null;
        })
}

export function closeAllSecondaryScreens() {
    const secondaryScreens = d3.selectAll(".secondary_screen");
    secondaryScreens.style('display', 'none')
}

export function alterMainTextOpacity(opacity){
    d3
    .selectAll('.instructions_container, .topics_container, .exhibitions_container')
    .style("opacity", opacity)
}

