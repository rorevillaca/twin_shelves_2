currently_selected_topic = ""

var wall_container = d3.select(".wall_container")
                       .append("svg")
                       .attr("height","100%")
                       .attr("width","90%");


function add_background_books(topic) {
  wall_container.append("g")
      .attr("class", `books_background`)
      .attr("id", `books_background_${topic}`)
      .append("image")
      .attr("href", `res/books_background/${topic}.svg`)  // Dynamically set the file name
      .attr("height", "100%")
      .attr("width", "100%")
      .attr("opacity", 1)
      .attr("x", 0)
      .attr("y", 0);
}


// Loop through and append each SVG image
for (let i = 1; i <= 25; i++) {
  add_background_books(`topic_${i}`)
}
                 
wall_background = wall_container.append("g")
                  .attr("id", "wall_background")
                  .append("image")
                  .attr("xlink:href","res/wall_vector.svg")
                  .attr("height", "100%")
                  .attr("width", "100%")
                  .attr("opacity", "55%")
                  .attr("x", "0")
                  .attr("y", "0%")



var wall_container_attrs = (d3.select(".wall_container").node().getBoundingClientRect())
var wall_width = wall_container_attrs.width * 0.9
const wall_ratio = 0.2250 //from inkscape (height / width)
var wall_height = wall_width * wall_ratio

var topics_container = d3.select(".topics_container")
                        .append("svg")
                        .attr("height","100%")
                        .attr("width","100%");


topics_container.append("g")
                        .selectAll("image")
                        .remove()
                        .data(tag_info)
                        .enter()
                        .append('image')
                        .attr("topic", function(d,i) {return d.topic})
                        .attr("id", function(d,i) {return "tag_"+d.topic})
                        .attr("xlink:href",function(d,i) {return "res/topic_tags/"+d.topic+".svg"})
                        .attr("width", function(d,i) {return d.width_percentage*100 + "%"})
                        .attr("x", function(d,i) {return d.start_x_percentage*100 + "%"})
                        .attr("y", function(d,i) {return d.start_y_percentage*100 + "%"})
                        .on('click',function(d) {   
                            //Add missing books back
                            if (currently_selected_topic !== "") {
                              add_background_books(currently_selected_topic)}
                            //Perform selection on books and tags
                            select_topic(this.getAttribute('topic'))
                            //Set state variable
                            currently_selected_topic = this.getAttribute('topic')
                          });


function select_topic(topic_id) {
    console.log(topic_id)
    //Change previous selection to dark blue
    d3.select("#tag_"+currently_selected_topic).attr("xlink:href",function(d,i) {return "res/topic_tags/"+currently_selected_topic+".svg"});
    //Change selection to light blue
    d3.select("#tag_"+topic_id).attr("xlink:href",function(d,i) {return "res/topic_tags/selected/"+topic_id+".svg"});
    //Dim background books
    d3.selectAll(".books_background").attr("opacity", 0.5)
    // Construct the id of the group element to be removed
    const elementId = `books_background_${topic_id}`; 
    // Select the element with the constructed id and remove it
    d3.selectAll(`#${elementId}`).remove();
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
    if (currently_selected_topic !== "") {
      add_background_books(currently_selected_topic)};
    select_topic("");
    currently_selected_topic = "";
    //Undim background books
    d3.selectAll(".books_background").attr("opacity", 1)
    // Reset the timer after calling the function
    resetTimer();
  }, 15000);
}

// Add event listener to the document to detect any click
document.addEventListener('click', resetTimer);
document.addEventListener('mousemove', resetTimer); // Reset on mouse move

// Set the initial 10-second timer when the script loads
resetTimer();
