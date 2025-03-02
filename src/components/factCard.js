import { typeText, shuffle, colorsArray } from "../utils/helpers.js"
import { wallContainer } from "../screens/mainScreen.js"
import { wallHeight, wallWidth, wallContainerAttrs } from "../index.js"

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
