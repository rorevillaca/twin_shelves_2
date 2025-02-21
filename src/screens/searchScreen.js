import { backButton } from "../components/backButton.js"
import { populateShelfView } from "./shelvesScreen.js"
import { keyboard } from "../components/keyboard.js"
import { wall, addShelfHighlight } from "../components/wall.js";
import { clearSelectedSection } from "../index.js"
import { colorsArray } from "../utils/helpers.js";


export function initSearchScreen() {
    backButton("#search-screen-header")

    //Set container for wall
    const wallContainer = d3.select(".search_wall_container")
        .append("svg")
        .attr("height", "100%")
        .attr("width", "95%");

    wall(wallContainer, "40%", false)

    d3
        .select(".search_container")
        .on('click', function () {
            d3.select(".search-screen").style("display", "grid");
            clearSelectedSection()
        })

    d3
        .select(".searchButton")
        .on('click', function () {
            search()
        })

    keyboard(".keyboard_container")
}


function search() {

    const query = d3.select('.searchInput').property('value');

    fetch('http://127.0.0.1:5000/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // First highlight shelves, then display results
            return new Promise(resolve => {
                //highlightShelves(data.distinct_shelves);
                // Get individual books
                const shelves = background_books.filter(item => data.distinct_shelves.includes(item.shelf_no));
                addIndividualBooks(shelves)
                setTimeout(() => resolve(data), 3000); // Wait
            });
        })
        .then(data => {
            //Clear search aids
            d3.select('.searchInput').property('value', '');
            d3.select(".search_wall_container").select("svg").selectAll(".wayPoints").remove()
            d3.select(".search_wall_container").select("svg").selectAll(".book").remove()
            //Display results
            shelf_view.style.display = "grid";
            populateShelfView({
                topic_name: "Search Results",
                topicId: "search_results",
                bookCaseCurrentTopic: data.bookshelves
            })
        })
        .catch(error => console.error('Error:', error));
}


function highlightShelves(shelves) {

    const wallContainer = d3.select(".search_wall_container").select("svg")
    const wallContainerAttrs = wallContainer.node().getBoundingClientRect()
    const WallAspectRatio = 4.443
    const originalShelfWidthPercentage = 0.0126
    const adjustedHeight = wallContainerAttrs.width / WallAspectRatio
    const yOffset = (wallContainerAttrs.height - adjustedHeight) / 2
    const shelfCoords = shelf_positions.filter(item => shelves.includes(item.shelf));
    const blink = false

    addShelfHighlight(shelfCoords,
        wallContainer,
        wallContainerAttrs,
        adjustedHeight,
        yOffset,
        originalShelfWidthPercentage,
        blink)
}

function addIndividualBooks(shelves) {
    console.log(shelves)
    const wallContainer = d3.select(".search_wall_container").select("svg")
    const wallContainerAttrs = (d3.select(".search_wall_container").node().getBoundingClientRect())
    const wallWidth = wallContainerAttrs.width * 0.95
    const wallRatio = 0.2250 //from inkscape (height / width)
    const wallHeight = wallWidth * wallRatio

    // Randomize the order
    //filtered_books = shuffle(filtered_books);
    // Bind the filtered data to the selection
    const books = wallContainer.selectAll(".book").data(shelves);
    books.enter()
        .append("rect")
        .attr("class", "book")
        .attr("fill", () => colorsArray[Math.floor(Math.random() * colorsArray.length)])
        .attr("y", d => d.y_start * wallHeight + (wallContainerAttrs.height - wallHeight) / 2)
        .attr("width", d => d.book_width * wallWidth)
        .attr("height", d => d.book_height * wallHeight)
        .attr("x", d => d.x_start * wallWidth) // Transition to the actual x position;
}