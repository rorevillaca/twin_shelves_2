import { wall } from "../components/wall.js";

export let wallContainer;

export function addWall() {

    //Set container for wall
    wallContainer = d3.select(".wall_container")
        .append("svg")
        .attr("height","100%")
        .attr("width","95%");
    
    wall(wallContainer, "50%", false)

}

export function addBooks(){

    let delay = 95

    d3.range(1, 26).forEach((i, index) => {
        d3.timeout(() => {
            addBackgroundBooks(`topic_${i}`, wallContainer);
        }, 200 + index * delay)

    })
    const additionalBooks = [
        'recommended_books',
        'dissertations',
        'heritage_objects',
        'student_work',
        'study_books'
    ];

    additionalBooks.forEach((book, index) => {
        d3.timeout(() => {
            addBackgroundBooks(book, wallContainer);
        }, 200 + (25 + index) * delay);
    });
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

export function removeBooks(){
    d3.selectAll(".books_background").remove()
}