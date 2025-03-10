import { typeText, shuffle, colorsArray, generateSequence } from "../utils/helpers.js"
import { wallContainer } from "../screens/mainScreen.js"
import { wallHeight, wallWidth, wallContainerAttrs, isIdle } from "../index.js"

export function factCard(containerSelector) {
    const container = d3.select(containerSelector)
    const introText = "Did you know?"

    setTimeout(() => {
        const factIntro = container
            .append("div")
            .attr("class", "did-u-know")
            .text(introText)
            .attr("color", "#2c2c6b")

        const fact1 = container.
            append("div").
            attr("class", "fact")
            .text(".")
        const fact2 = container.
            append("div").
            attr("class", "fact")
            .text(".")


        const factText1 = "The Collection Wall is home to over 24.000 books"
        const factText2 = "spanning 130 years of technical literature"
        const delay = 100
        typeText(fact1, factText1, 2500, delay)
        typeText(fact2, factText2, 2500 + delay * (factText1.length + 1), 100)
        addRandomBooks()
    }, 500)

}

function addRandomBooks() {

    var booksArray = shuffle(background_books).slice(0, 1000);

    const booksEnter = wallContainer.selectAll(".book")
        .data(booksArray)
        .enter()
        .append("rect")
        .attr("class", "book")
        .attr("y", d => d.y_start * wallHeight + (wallContainerAttrs.height - wallHeight) / 2)
        .attr("width", d => d.book_width * wallWidth)
        .attr("height", d => d.book_height * wallHeight)
        .attr("x", d => d.x_start * wallWidth)
        .attr("fill", () => colorsArray[Math.floor(Math.random() * colorsArray.length)])
        .style("opacity", 0.1)

    // Transition for entering elements
    booksEnter
        .transition()
        .delay((d, i) => 3300 + i * 8) // Stagger bars
        .duration(30)
        .style("opacity", 1)
}


export function factCard2(containerSelector) {
    const container = d3.select(containerSelector)

    const introText = "Looking for your next read?"

    setTimeout(() => {

        const factIntro = container
            .append("div")
            .attr("class", "did-u-know")
            .text(introText)
            .attr("color", "#2c2c6b")

        const fact1 = container.
            append("div").
            attr("class", "fact")
            .text(".")

        const photoContainer = container
            .append("div")
            .attr("class", "fact-profile-pics-container")

        const factText1 = "The AI Librarian features a collection of must-reads, handpicked by TU Delft's domain experts"
        const delay = 100
        typeText(fact1, factText1, 2500, delay)

        animateConveyor(photoContainer)

    }, 500)

}

function animateConveyor(photoContainer) {
    const availableHeight = photoContainer.node().getBoundingClientRect().height
    const availableWidth = photoContainer.node().getBoundingClientRect().width
    const photoDiameter = availableHeight * 0.6
    const xCoordCenter = (availableWidth - photoDiameter) / 2
    const yCoord = (availableHeight - photoDiameter) / 2
    const dimmedOpacity = 0.3
    const photoDiameterHighlight = availableHeight * 0.8
    const yCoordHighlight = (availableHeight - photoDiameterHighlight) / 2
    const xCoordHighlight = (availableWidth - photoDiameterHighlight) / 2
    const gapX = photoDiameter / 2

    const xSpacing = gapX + photoDiameter
    const minX = xCoordCenter - xSpacing * 19
    const sequence = generateSequence(26, minX, xSpacing)
    const conveyorID = generateSequence(26, 0, 1)

    const shuffledRecommenders = shuffle(recommender_data)
    shuffledRecommenders.forEach((item, index) => {
        item.initialX = sequence[index]
        item.conveyorID = conveyorID[index]
    })

    const photoCanvas = photoContainer
        .append("svg")
        .attr("width", "100%")
        .attr("width", "100%")
        .append("g")


    shuffledRecommenders.forEach((d) => {
        let centralID = 19
        const imageElement = photoCanvas
            .append("image")
            .attr("x", d.initialX)
            .attr("y", yCoord)
            .attr("width", photoDiameter)
            .attr("height", photoDiameter)
            .attr("opacity", 0)
            .attr("href", `./src/res/recommenders/profile_pictures/recommender_${d.id}.png`)
            .style("clip-path", "circle(50%)")
            .attr("preserveAspectRatio", "xMidYMid slice")
            .transition()
            .duration(13000)
            .attr("opacity", calculateOpacity(d.conveyorID, centralID))

        let iteration = 0
        while (iteration < 10) {
            imageElement
                .transition()
                .ease(d3.easeCubicInOut)
                .delay(6000 * iteration)
                .duration(4000)
                .attr("x", d.conveyorID === centralID ? xCoordHighlight : d.initialX + xSpacing * iteration)
                .attr("y", d.conveyorID === centralID ? yCoordHighlight : yCoord)
                .attr("width", d.conveyorID === centralID ? photoDiameterHighlight : photoDiameter)
                .attr("height", d.conveyorID === centralID ? photoDiameterHighlight : photoDiameter)
                .attr("opacity", calculateOpacity(d.conveyorID, centralID))
            
            if (!isIdle) break;
            iteration += 1
            centralID -= 1
        }
    });


}

function calculateOpacity(conveyorID, targetNumber) {
    const absDistance = Math.abs(conveyorID - targetNumber);
    if (absDistance >= 7) {
        return 0;
    }
    // Linearly map the distance to opacity
    const opacity = 1 - (absDistance / 7);
    return opacity;
}

function animateBooks() {
    const booksArray = shuffle(background_books).filter(book => book.topic === "recommended_books").slice(0, 15);
    wallContainer.selectAll(".book").remove()

    // Enter selection: Add new elements
    const booksEnter = wallContainer.selectAll(".book")
        .data(booksArray)
        .enter()
        .append("rect")
        .attr("class", "book")
        .attr("y", d => d.y_start * wallHeight + (wallContainerAttrs.height - wallHeight) / 2)
        .attr("width", d => d.book_width * wallWidth)
        .attr("height", d => d.book_height * wallHeight)
        .attr("x", d => d.x_start * wallWidth)
        //.attr("fill", (d, i) => `url(#pattern-${i})`)
        .attr("fill", () => colorsArray[Math.floor(Math.random() * colorsArray.length)])
        .style("opacity", 1);
}
