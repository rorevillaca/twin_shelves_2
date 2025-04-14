import { typeText, shuffle, colorsArray, generateSequence } from "../utils/helpers.js"
import { wallContainer } from "../screens/mainScreen.js"
import { wallHeight, wallWidth, wallContainerAttrs, isIdle } from "../index.js"

export let factCardTimer;
let intervalId;

export function runFacts(factNo) {
    const parentContainer = d3.select(".parent_container")
    parentContainer
        .append("div")
        .attr("class", "facts_container")

    if (factNo == 1) {
        factCard(".facts_container")
    } else {
        factCard2(".facts_container")
    }
}

function factCard(containerSelector) {
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

function moverRandomBook(booksEnter){
        // Select a random book element
        const randomIndex = Math.floor(Math.random() *  booksEnter.size());
        const randomBook = booksEnter.nodes()[randomIndex]; // Select a random book element
        const randomDestination = shuffle(background_books)[0];

        const randomDestinationX = randomDestination.x_start
        const randomDestinationY = randomDestination.y_start
      
        d3.select(randomBook).raise();
      
        // Use D3 transition to animate the move
        d3.select(randomBook)
          .transition()
          .duration(2500)
          .delay(9000)
          .ease(d3.easeCubic)
          .attr("y", d => (d.y_start+randomDestinationY)/2 * wallHeight + (wallContainerAttrs.height - wallHeight) / 2)
          .attr("x", d => (d.x_start+randomDestinationX)/2 * wallWidth)
          .attr("width", 70)
          .attr("height", 70 * 1.3)
          .transition()
          .duration(2500)
          .ease(d3.easeCubic)
          .attr("y", randomDestinationY * wallHeight + (wallContainerAttrs.height - wallHeight) / 2)
          .attr("x", randomDestinationX * wallWidth)
          .attr("width",  d => d.book_width * wallWidth)
          .attr("height",  d => d.book_height * wallHeight)
}

function addRandomBooks() {
    const n = 800

    var booksArray = shuffle(background_books).slice(0, n);
    let coverFiles = virtual_bookshelves.filter(book => book.topic_id !== "dissertations").flatMap(shelf => shelf.books.map(book => book.cover_file))
    coverFiles = coverFiles.filter(file => file !== "NA").slice(0, n)


    booksArray.forEach((item, index) => {
        item.cover_file = coverFiles[index]
    })

    const booksEnter = wallContainer.selectAll(".book")
        .data(booksArray)
        .enter()
        .append("image")
        .attr("class", "book")
        .attr("y", d => d.y_start * wallHeight + (wallContainerAttrs.height - wallHeight) / 2)
        .attr("width", d => d.book_width * wallWidth)
        .attr("height", d => d.book_height * wallHeight)
        .attr("x", d => d.x_start * wallWidth)
        .style("opacity", 0.1)
        .attr("href", d => `src/res/resized_covers_struct/${d.cover_file}`)
        .style("object-fit", "fill")
        // .style("object-fit", "cover");


    // Transition for entering elements
    booksEnter
        .transition()
        .delay((d, i) => 3300 + i * 8) // Stagger bars
        .duration(30)
        .style("opacity", 1)

        intervalId = setInterval(function() {
            moverRandomBook(booksEnter);
        }, 5000);

}


function factCard2(containerSelector) {
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

        const factText1 = "The AI Librarian features a collection of must-reads, handpicked by TU Delft's experts"
        const delay = 100
        typeText(fact1, factText1, 2500, delay)

        animateConveyor(photoContainer)

    }, 500)

}

function animateConveyor(photoContainer) {
    const availableHeight = photoContainer.node().getBoundingClientRect().height
    const availableWidth = photoContainer.node().getBoundingClientRect().width
    const photoWidth = availableHeight * 0.5
    const photoHeight = availableHeight * 0.8
    const xCoordCenter = (availableWidth - photoWidth) / 2
    const yCoord = (availableHeight - photoHeight) / 2
    const dimmedOpacity = 0.3
    const photoDiameterHighlight = availableHeight * 0.9
    const yCoordHighlight = (availableHeight - photoDiameterHighlight) / 2
    const xCoordHighlight = (availableWidth - photoDiameterHighlight) / 2
    const gapX = photoWidth / 2

    const xSpacing = gapX + photoWidth
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
            .attr("width", photoWidth)
            .attr("height", photoHeight)
            .attr("opacity", 0)
            .attr("href", `./src/res/recommenders/profile_pictures/recommender_${d.id}.png`)
            .attr("preserveAspectRatio", "xMidYMid slice")
            .transition()
            .duration(7000)
            .attr("opacity", calculateOpacity(d.conveyorID, centralID))

        for (let iteration = 1; iteration < 11; iteration++) {
            imageElement
                .transition()
                .ease(d3.easeCubicInOut)
                .delay(6000 * (iteration))
                .duration(2000)
                .attr("x", d.conveyorID === centralID ? xCoordHighlight : d.initialX + xSpacing * (iteration - 1))
                .attr("y", d.conveyorID === centralID ? yCoordHighlight : yCoord)
                .attr("width", d.conveyorID === centralID ? photoDiameterHighlight : photoWidth)
                .attr("height", d.conveyorID === centralID ? photoDiameterHighlight : photoHeight)
                .attr("opacity", calculateOpacity(d.conveyorID, centralID))

            if (!isIdle) break;
            centralID -= 1

        }

        setTimeout(() => animateBooks(), 13000);
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

function getRandomBooks(n) {
    const bookCaseCurrentTopic = virtual_bookshelves.filter(book => book.topic_id === "recommended_books");
    let randomRecommender = bookCaseCurrentTopic[Math.floor(Math.random() * bookCaseCurrentTopic.length)];
    let bookcase = randomRecommender.books.slice(0, n)
    let booksArray = shuffle(background_books).filter(book => book.topic === "recommended_books").slice(0, n);
    booksArray.forEach((item, index) => {
        item.cover_file = bookcase[index].cover_file
    })
    return booksArray
}

function animateBooks(iteration = 1) {

    if (iteration > 10) return

    const enlargeFactor = 17

    let booksArray = getRandomBooks(10)
    wallContainer.selectAll(".book").remove()
    wallContainer.selectAll("pattern").remove()

    // Enter selection: Add new elements
    let booksEnter = wallContainer.selectAll(".book")
        .data(booksArray)
        .enter()
        .append("rect")
        .attr("class", "book")
        .attr("y", d => d.y_start * wallHeight + (wallContainerAttrs.height - wallHeight) / 2)
        .attr("width", d => d.book_width * wallWidth)
        .attr("height", d => d.book_height * wallHeight)
        .attr("x", d => d.x_start * wallWidth)
        .attr("fill", () => colorsArray[Math.floor(Math.random() * colorsArray.length)])
        .style("opacity", 0)
        .transition()
        .style("opacity", 1)

    wallContainer.selectAll("defs").remove()
    const defs = wallContainer.append("defs");

    booksArray.forEach((d, i) => {
        defs.append("pattern")
            .attr("id", `pattern-${i}`)
            .attr("width", 1)
            .attr("height", 1)
            .attr("patternUnits", "objectBoundingBox")
            .append("image")
            .attr("xlink:href", d.cover_file == "NA" ? "src/res/resized_covers_struct/_recommended_books/cover_f-FdDwAAQBAJ.webp" : `src/res/resized_covers_struct/${d.cover_file}`)
            .attr("width", d.book_width * wallWidth * enlargeFactor)
            .attr("height", d.book_height * wallHeight * enlargeFactor * 0.6)
            .attr("preserveAspectRatio", "xMidYMid slice");

        booksEnter
            .transition()
            //.delay(4000)
            .duration(1500)
            .attr("fill", (d, i) => `url(#pattern-${i})`)
            .attr("y", 0.6 * wallHeight)
            .attr("x", (d, i) => (0.14 + (i / 5) * 0.24) * wallWidth)
            .attr("width", d => d.book_width * wallWidth * enlargeFactor)
            .attr("height", d => d.book_height * wallHeight * enlargeFactor)
        // .attr("fill", () => colorsArray[Math.floor(Math.random() * colorsArray.length)])

    });

    clearTimeout(factCardTimer) //IMPORTANT: Clears the timer before reassigning
    factCardTimer = setTimeout(() => animateBooks(iteration + 1), 6000);

}
