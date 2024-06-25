currently_selected_topic = ""

var wall_container = d3.select(".wall_container")
                       .append("svg")
                       .attr("height","100%")
                       .attr("width","90%");


function add_background_books(topic) {
  wall_container.insert("g",":first-child")
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


function add_highlighted_books(topic) {
  // Filter the data to include only books with the desired topic
  const filtered_books = background_books.filter(book => book.topic === topic);
  // Remove existing books
  wall_container.selectAll(".book").remove();
  // Bind the filtered data to the selection
  const books = wall_container.selectAll(".book").data(filtered_books);
  books.enter()
  .append("rect")
  .attr("class", "book")
  .attr("x", () => (Math.random() < 0.5 ? -50 : 2000)) // Randomly set initial x attribute
  .attr("y", d => d.y_start * wall_height + (wall_container_attrs.height - wall_height) / 2)
  .attr("width", d => d.book_width * wall_width)
  .attr("height", d => d.book_height * wall_height)
  //.attr("height", d => 0)
  .transition()
  .ease(d3.easeQuadOut)
  .duration(1500)
  .attr("x", d => d.x_start * wall_width) // Transition to the actual x position
}

function parse_polygons(data) {
  const result = {};

  data.forEach(item => {
    if (!result[item.topic]) {
      result[item.topic] = [];
    }
    result[item.topic].push(`${item.x_perc*wall_width},
      ${item.y_perc*wall_height + (wall_container_attrs.height-wall_height)/2}`);
  });

  const transformedData = Object.keys(result).map(topic => ({
    topic,
    points: result[topic].join(' ')
  }));

  return transformedData;
}

const parsed_polygons = parse_polygons(topic_polygons);

wall_container
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
                console.log(this.getAttribute('topic'))
                //Add missing books back
                if (currently_selected_topic !== "") {
                  add_background_books(currently_selected_topic)}
                //Perform selection on books and tags
                select_topic(this.getAttribute('topic'))
                //Set state variable
                currently_selected_topic = this.getAttribute('topic')
              });



function  magnifying_glass(topic){

    //Remove current magnifying glass (if any)
    wall_container.selectAll(".magnifying_glass").remove();
    //add rounded rectangle at +/- 5 pixels
    wall_container
            .append('g')
            .append("rect")
            .attr("class", "magnifying_glass")
            .attr('x', getCoordOfTopic(topic,"x_perc","min") - 10)
            .attr('y', getCoordOfTopic(topic,"y_perc","min") -10)
            .attr('height', getCoordOfTopic(topic,"y_perc","max")-getCoordOfTopic(topic,"y_perc","min") +20)
            .attr('width', getCoordOfTopic(topic,"x_perc","max")-getCoordOfTopic(topic,"x_perc","min")+20)
            .on('click',function(d) {
            });
    
    //on click: open black screen

    //add icon for clicking

    //issues for tomorrows meeting:
    //Book covers are pixelated, does book view make sense?
    //Some shelves have 20+ books; how would this look like?

}



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
    //Remove magnifying glass (if any)
    wall_container.selectAll(".magnifying_glass").remove();
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
    // Add white books
    add_highlighted_books(topic_id);
    // Wait 3 seconds
    setTimeout(function(){
      //Add magnifying glass
      magnifying_glass(topic_id);
    },1800)
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




const getCoordOfTopic = (topic, variable, min_or_max) => {

  const filteredData = topic_polygons.filter(item => item.topic === topic);
  const maxVar = filteredData.reduce((max, item) => item[variable] > max ? item[variable] : max, -Infinity);
  const minVar = filteredData.reduce((min, item) => item[variable] < min ? item[variable] : min, Infinity);

  if (variable === 'x_perc') {
      if (min_or_max === "min"){
        return minVar * wall_width;
      } else {
        return maxVar * wall_width;
      }
  } else if (variable === 'y_perc') {
      if (min_or_max === "min"){
        return minVar * wall_height  + (wall_container_attrs.height-wall_height)/2;
      } else {
        return maxVar * wall_height + (wall_container_attrs.height-wall_height)/2;
      }
  }
};