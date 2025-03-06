import { typeText, shuffle, colorsArray, generateSequence } from "../utils/helpers.js"
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


export function factCard2(containerSelector) {
    const container = d3.select(containerSelector)
    const photoContainer = container
        .append("div")
        .attr("class", "fact-profile-pics-container")
    const photoCanvas = photoContainer
        .append("svg")
        .attr("width", "100%")
        .attr("width", "100%")
        .append("g")

    const sequence = generateSequence(26, -70, 7.5)
    const shuffledRecommenders = shuffle(recommender_data)
    shuffledRecommenders.forEach((item, index) => {
        item.initialX = sequence[index];
    })

    photoCanvas
        .selectAll("image")
        .data(shuffledRecommenders)
        .enter()
        .append("image") 
        .attr("x", (d) => `${d.initialX}%`)
        .attr("y", "calc(50% - 50px)") 
        .attr("width", 100) 
        .attr("height", 100)
        .attr("href", (d) =>  `./src/res/recommenders/profile_pictures/recommender_${d.id}.png`)
        .style("clip-path", "circle(50%)")
        .each(function (d) {
            let currentX = d.initialX; 
            for (let i = 1; i <= 10; i++) {
                d3.select(this)
                    .transition()
                    .delay(i * 2500) 
                    .duration(2500) 
                    .attr("width", Math.abs(currentX + i * 7.5 - 50) < 1 ? 120 : 100)
                    .attr("height", Math.abs(currentX + i * 7.5 - 50) < 1 ? 120 : 100)
                    .attr("y",  Math.abs(currentX + i * 7.5 - 50) < 1 ? "calc(50% - 60px)" : "calc(50% - 50px)")
                    .attr("x", (d) => `${currentX + i * 7.5}%`)
                    .on("end", function () {
                        // After each transition, update the current X position and radius
                        currentX += 7.5;
                    });
            }
        });


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

        const factText1 = "The AI Librarian features a collection of must-reads, handpicked by TU Delft's domain experts"
        const delay = 100
        typeText(fact1, factText1, 2500, delay)

    }, 500)

}
