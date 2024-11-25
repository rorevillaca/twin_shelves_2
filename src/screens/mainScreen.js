import { wall } from "../components/wall.js";

export let wallContainer;

export function initMainScreen() {

    //Set container for wall
    wallContainer = d3.select(".wall_container")
        .append("svg")
        .attr("height","100%")
        .attr("width","95%");
    
    wall(wallContainer, "70%", false)
    
    // Loop through and append the books for each section
    for (let i = 1; i <= 25; i++) {
        addBackgroundBooks(`topic_${i}`, wallContainer)
    }
    addBackgroundBooks(`recommended_books`, wallContainer)
    addBackgroundBooks(`dissertations`, wallContainer)
    addBackgroundBooks(`heritage_objects`, wallContainer)
    addBackgroundBooks(`student_work`, wallContainer)
    addBackgroundBooks(`study_books`, wallContainer)
}

export function addBackgroundBooks(topic, container) {
    container.insert("g",":first-child") //Makes sure to append the element as the first child of the parent
        .attr("class", `books_background`)
        .attr("id", `books_background_${topic}`)
        .append("image")
        .attr("href", `src/res/books_background/${topic}.svg`)
        .attr("height", "100%")
        .attr("width", "100%")
        .attr("opacity", 1)
        .attr("x", 0)
        .attr("y", 0);
}