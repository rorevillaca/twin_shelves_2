import { shuffle } from './utils/helpers.js'
import { initMainScreen, wallContainer, addBackgroundBooks } from "./screens/mainScreen.js"
import { initShelvesScreen, populateShelfView } from "./screens/shelvesScreen.js"
import { ParsePolygons } from "./utils/data.js"
import { initDirectionsScreen } from "./screens/directionsScreen.js"
import { topicButton } from './components/topicButton.js'
import { exhibitionButton } from "./components/exhibitionButton.js"
import { initStudentWork } from "./screens/studentWorkScreen.js" 
import { initHeritageObjects } from "./screens/heritageObjectsScreen.js" 
import { initSearchScreen } from "./screens/searchScreen.js" 


let currentlySelectedSection = ""
let animationRunning = false;

initMainScreen()
initShelvesScreen()
initDirectionsScreen()
initStudentWork()
initHeritageObjects()
initSearchScreen()

const wallContainerAttrs = (d3.select(".wall_container").node().getBoundingClientRect())
const wallWidth = wallContainerAttrs.width * 0.95
const wallRatio = 0.2250 //from inkscape (height / width)
const wallHeight = wallWidth * wallRatio


function add_highlighted_books(topic) {
  // Filter the data to include only books with the desired topic
  var filtered_books = background_books.filter(book => book.topic === topic);
  // Randomize the order
  filtered_books = shuffle(filtered_books);
  // Bind the filtered data to the selection
  const books = wallContainer.selectAll(".book").data(filtered_books);
  books.enter()
    .append("rect")
    .attr("class", "book")
    .attr("x", () => (Math.random() < 0.5 ? -50 : 1800)) // Randomly set initial x attribute
    //.attr("x", d => d.x_start * wall_width) // Transition to the actual x position
    .attr("y", () => (Math.random() < 0.5 ? 25 : 75)) // Randomly set initial x attribute
    //.attr("y", d => d.y_start * wall_height + (wall_container_attrs.height - wall_height) / 2)
    .attr("height", d => 0)
    .attr("width", d => 24)
    .attr("height", d => 60)
    .transition()
    .delay(function(d,i){return (2000/filtered_books.length) * i})
    .ease(d3.easeQuadIn)
    //.duration(1500)
    .attr("y", d => d.y_start * wallHeight + (wallContainerAttrs.height - wallHeight) / 2)
    .attr("width", d => d.book_width * wallWidth)
    .attr("height", d => d.book_height * wallHeight)
    .attr("x", d => d.x_start * wallWidth) // Transition to the actual x position;
}

const parsed_polygons = ParsePolygons(topic_polygons, wallContainerAttrs, wallWidth, wallHeight);

wallContainer
            .append("g")
            .selectAll("polygon")
            .remove()
            .data(parsed_polygons)
            .enter()
            .append("polygon")
            .attr("points", d => d.points)
            .attr("topic", d => d.topic)
            .attr("id", d => "polygon_"+d.topic)
            .attr("fill", "#838ef0")
            .attr("opacity","0%")
            //.attr("stroke", "red")
            .attr("stroke-width", 1)
            .on('click',function(d) {
                if (animationRunning) return; // Prevent running if animation is already in progress
                animationRunning = true; // Set the flag to indicate the animation is running
                //Add missing books back
                if (currentlySelectedSection !== "") {
                  addBackgroundBooks(currentlySelectedSection, wallContainer)}
                //Perform selection on books and tags
                selectSection(this.getAttribute('topic'))
                //Set state variable
                currentlySelectedSection = this.getAttribute('topic')
              });


function  magnifying_glass(topic){

    //Remove current magnifying glass (if any)
    wallContainer.selectAll(".magnifying_assets").remove();

    if (topic !== '') {

      const topic_entry = tag_info.find(entry => entry.topic === topic);
      const topic_name = topic_entry ? topic_entry.name : null;

      const defs = wallContainer.append("defs");

      const filter = defs.append("filter")
          .attr("id", "blurFilter");

      filter.append("feGaussianBlur")
          .attr("in", "SourceGraphic")
          .attr("stdDeviation", 7);  // Adjust the stdDeviation value to control the amount of blur

        // Add a color matrix to adjust opacity
      filter.append("feComponentTransfer")
        .append("feFuncA")
        .attr("type", "linear")
        .attr("slope", 4);  // Adjust slope to reduce translucency



      let group = wallContainer
              .append('g')
              .attr("class","magnifying_assets");
      //add rounded rectangle at +/- 5 pixels

      let rectX = getCoordOfTopic(topic, "x_perc", "min") - 15;
      let rectY = getCoordOfTopic(topic, "y_perc", "min") - 10;
      let rectWidth = getCoordOfTopic(topic, "x_perc", "max") - getCoordOfTopic(topic, "x_perc", "min") + 30;
      let rectHeight = getCoordOfTopic(topic, "y_perc", "max") - getCoordOfTopic(topic, "y_perc", "min") + 20;
      
      group.append("rect")
          .attr("class", "magnifying_glass")
          .attr('x', rectX)
          .attr('y', rectY)
          .attr('height', rectHeight)
          .attr('width', rectWidth)
          .attr("filter", "url(#blurFilter)")  // Apply the blur filter

      group.append("rect")
          .attr("class", "magnifying_glass")
          .attr('x', rectX)
          .attr('y', rectY)
          .attr('height', rectHeight)
          .attr('width', rectWidth)
          .on('click',function(d) {
            switch (topic) {
              case "heritage_objects":
                heritage_view.style.display = "grid";
                break
              case "student_work":
                object_view.style.display = "grid";
                break
              default:
                var bookCaseCurrentTopic = virtual_bookshelves.filter(book => book.topic_id === topic);
                shelf_view.style.display = "grid";
                populateShelfView({ topic_name: topic_name, 
                                    topicId: topic, 
                                    bookCaseCurrentTopic: bookCaseCurrentTopic})
            }


          });

      // Add text above the rectangle and center it horizontally
      group.append("text")
          .attr("class", "magnifying_text")
          .attr('x', rectX + rectWidth / 2)
          .attr('y', rectY - 10) // Adjust the -10 value as needed to position the text above the rectangle
          .text(topic_name);
      
      //add cursor
      group.append("image")
          .attr("xlink:href","src/res/pointer_icon.svg")
          .attr("height", "20")
          .attr("width", "20")
          .attr("x", getCoordOfTopic(topic,"x_perc","max")-5)
          .attr("y", getCoordOfTopic(topic,"y_perc","max")-5)

      // Call the pulsing function after some idle time (e.g., 5 seconds)
      setTimeout(() => {
        startPulsing();
      }, 5000);

      }     
}


function startPulsing() {
  wallContainer.selectAll(".magnifying_glass")
      .transition()
      .duration(1000)
      .ease(d3.easeCubicInOut)
      .attr("opacity", 0.5)
      .transition()
      .duration(1000)
      .ease(d3.easeCubicInOut)
      .attr("opacity", 1)
      .on("end", startPulsing); // Repeat the pulsing
}

tag_info.forEach(d => {
  switch (d.tag_type) {
    case "book_collection":
      topicButton(".topics_container", d.name, d.topic, d.number_of_bars);  
      break;  
    case "exhibition":
      exhibitionButton(".exhibitions_container", d.name, d.topic)
      break;
  }
});

d3.selectAll(".topicButtonContainer, .exhibitionsButton")
  .on('click',function(d) {
    const section = this.getAttribute('id')
    if (animationRunning) return; // Prevent running if animation is already in progress
    animationRunning = true; // Set the flag to indicate the animation is running
    //Add missing books back
    if (currentlySelectedSection !== "") {
      addBackgroundBooks(currentlySelectedSection, wallContainer)}
    //Perform selection on books and tags
    selectSection(section)
    //Set state variable
    currentlySelectedSection = section
  });






function selectSection(sectionId) {
    if (currentlySelectedSection !== "") {
      d3.select("#"+currentlySelectedSection).selectAll("div").style("background-color","#2c2c6b")
    }    

    //Remove magnifying glass (if any)
    wallContainer.selectAll(".magnifying_assets").remove();
    //Dim background books
    d3.selectAll(".books_background").attr("opacity", 0.5)
    //Dim wall
    d3.selectAll("#wall_background").attr("opacity", 0.5)
    // Construct the id of the group element to be removed
    const elementId = `books_background_${sectionId}`; 
    // Select the element with the constructed id and remove it
    d3.selectAll(`#${elementId}`).remove();
    // Remove existing books
    wallContainer.selectAll(".book").remove();
    
    if (sectionId !== "") {
      //Change selection to light blue
      d3.select("#"+sectionId).selectAll("div").style("background-color","#808ff7")
      var waitTime = 0

      if (sectionId !== "heritage_objects" && sectionId !== "student_work") {
        waitTime = 3000
        add_highlighted_books(sectionId); 
      }
      // Wait bfore running
      setTimeout(function(){
        //Add magnifying glass
        magnifying_glass(sectionId);
        animationRunning = false; // Set the flag to indicate the animation has finished
        },waitTime)
    }

}

// Initialize a variable to hold the timeout ID
let timeoutId;

// Function to reset the timer
function resetTimer() {
  // Clear the existing timer
  clearTimeout(timeoutId);
  
  // Set a new 10-second timer
  timeoutId = setTimeout(() => {
    //Add missing books back
    if (currentlySelectedSection !== "") {
      addBackgroundBooks(currentlySelectedSection, wallContainer)};
    selectSection("");
    currentlySelectedSection = "";
    //Undim background books
    d3.selectAll(".books_background").attr("opacity", 1)
    d3.selectAll("#wall_background").attr("opacity", 1)
    // Reset the timer after calling the function
    resetTimer();
  }, 15000);
}

// Add event listener to the document to detect any click
document.addEventListener('click', resetTimer);
document.addEventListener('mousemove', resetTimer); // Reset on mouse move

// Set the initial 10-second timer when the script loads
resetTimer();


const getCoordOfTopic = (topic, variable, min_or_max) => {

  const filteredData = topic_polygons.filter(item => item.topic === topic);
  const maxVar = filteredData.reduce((max, item) => item[variable] > max ? item[variable] : max, -Infinity);
  const minVar = filteredData.reduce((min, item) => item[variable] < min ? item[variable] : min, Infinity);

  if (variable === 'x_perc') {
      if (min_or_max === "min"){
        return minVar * wallWidth;
      } else {
        return maxVar * wallWidth;
      }
  } else if (variable === 'y_perc') {
      if (min_or_max === "min"){
        return minVar * wallHeight  + (wallContainerAttrs.height-wallHeight)/2;
      } else {
        return maxVar * wallHeight + (wallContainerAttrs.height-wallHeight)/2;
      }
  }
};