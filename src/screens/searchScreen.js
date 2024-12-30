import { backButton } from "../components/backButton.js"
import { populateShelfView } from "./shelvesScreen.js"
import { keyboard } from "../components/keyboard.js"
import { wall, addShelfHighlight } from "../components/wall.js";
import { clearSelectedSection } from "../index.js"


export function initSearchScreen() {    
    backButton("#search-screen-header")

    //Set container for wall
    const wallContainer = d3.select(".search_wall_container")
        .append("svg")
        .attr("height","100%")
        .attr("width","95%");
    
    wall(wallContainer, "40%", false)
    
    d3
        .select(".search_container")
        .on('click',function() {
            d3.select(".search-screen").style("display", "grid");
            clearSelectedSection()
        })

    d3
        .select(".searchButton")
        .on('click',function() {
            search()
        })

    keyboard(".keyboard_container")
}


function search() {

    const wallContainer = d3.select(".search_wall_container").select("svg")
    const wallContainerAttrs = wallContainer.node().getBoundingClientRect()
    const WallAspectRatio = 4.443
    const originalShelfWidthPercentage = 0.0126
    const adjustedHeight = wallContainerAttrs.width/WallAspectRatio
    const yOffset = (wallContainerAttrs.height - adjustedHeight)/2
    const shelfCoords = shelf_positions.filter(item => item.shelf === 1080)[0];

    addShelfHighlight(shelfCoords,
        wallContainer, 
        wallContainerAttrs,
        adjustedHeight,
        yOffset,
        originalShelfWidthPercentage)

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
        // shelf_view.style.display = "grid";
        // populateShelfView({ 
        //     topic_name: "Search Results", 
        //     topicId: "search_results", 
        //     bookCaseCurrentTopic: data.bookshelves})
    })
    .catch(error => console.error('Error:', error));
}