import { backButton } from "../components/backButton.js"
import { populateShelfView } from "./shelvesScreen.js"
import { keyboard } from "../components/keyboard.js"
import { wall } from "../components/wall.js";


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
        })

    d3
        .select(".searchButton")
        .on('click',function() {
            search()
        })

    keyboard(".keyboard_container")
}


function search() {
    const query = d3.select('.searchInput').property('value'); // Use property to get the value of an input field
            
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
        console.log(data)
        shelf_view.style.display = "grid";
        populateShelfView({ mode: "replicate",
            topic_name: "search_results", 
            topicId: "search_results", 
            bookCaseCurrentTopic: data.results})
    })
    .catch(error => console.error('Error:', error));
}