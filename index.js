currently_selected_topic = ""

var wall_container = d3.select(".wall_container")
                       .append("svg")
                       .attr("height","100%")
                       .attr("width","95%");


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
                  .attr("opacity", "70%")
                  .attr("x", "0")
                  .attr("y", "0%")


var wall_container_attrs = (d3.select(".wall_container").node().getBoundingClientRect())
var wall_width = wall_container_attrs.width * 0.95
const wall_ratio = 0.2250 //from inkscape (height / width)
var wall_height = wall_width * wall_ratio


function add_highlighted_books(topic) {
  // Filter the data to include only books with the desired topic
  var filtered_books = background_books.filter(book => book.topic === topic);
  // Randomize the order
  filtered_books = shuffle(filtered_books);
  // Remove existing books
  wall_container.selectAll(".book").remove();
  // Bind the filtered data to the selection
  const books = wall_container.selectAll(".book").data(filtered_books);
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
  .attr("y", d => d.y_start * wall_height + (wall_container_attrs.height - wall_height) / 2)
  .attr("width", d => d.book_width * wall_width)
  .attr("height", d => d.book_height * wall_height)
  .attr("x", d => d.x_start * wall_width) // Transition to the actual x position
  //.attr("height", d => d.book_height * wall_height) //Transition to the real height
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
    wall_container.selectAll(".magnifying_assets").remove();

    if (topic !== '') {

      const topic_entry = tag_info.find(entry => entry.topic === topic);
      const topic_name = topic_entry ? topic_entry.name : null;

      const defs = wall_container.append("defs");

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



      let group = wall_container
              .append('g')
              .attr("class","magnifying_assets");
      //add rounded rectangle at +/- 5 pixels

      let rectX = getCoordOfTopic(topic, "x_perc", "min") - 15;
      let rectY = getCoordOfTopic(topic, "y_perc", "min") - 10;
      let rectWidth = getCoordOfTopic(topic, "x_perc", "max") - getCoordOfTopic(topic, "x_perc", "min") + 30;
      let rectHeight = getCoordOfTopic(topic, "y_perc", "max") - getCoordOfTopic(topic, "y_perc", "min") + 20;
      
      group
              .append("rect")
              .attr("class", "magnifying_glass")
              .attr('x', rectX)
              .attr('y', rectY)
              .attr('height', rectHeight)
              .attr('width', rectWidth)
              .attr("filter", "url(#blurFilter)")  // Apply the blur filter

      group
              .append("rect")
              .attr("class", "magnifying_glass")
              .attr('x', rectX)
              .attr('y', rectY)
              .attr('height', rectHeight)
              .attr('width', rectWidth)
              .on('click',function(d) {
                shelf_view.style.display = "grid";
                d3.select(".shelf_view--topic_holder").text(topic_name)
              });

      // Add text above the rectangle and center it horizontally
      group
            .append("text")
            .attr("class", "magnifying_text")
            .attr('x', rectX + rectWidth / 2)
            .attr('y', rectY - 10) // Adjust the -10 value as needed to position the text above the rectangle
            .text(topic_name);
      
      //add cursor
      group
              .append("image")
              .attr("xlink:href","res/pointer_icon.svg")
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
  wall_container.selectAll(".magnifying_glass")
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



    //issues for tuesday's meeting:
    //Book covers are pixelated, does book view make sense?
    //Some shelves have 20+ books; how would this look like?



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
    wall_container.selectAll(".magnifying_assets").remove();
    //Change previous selection to dark blue
    d3.select("#tag_"+currently_selected_topic).attr("xlink:href",function(d,i) {return "res/topic_tags/"+currently_selected_topic+".svg"});
    //Change selection to light blue
    d3.select("#tag_"+topic_id).attr("xlink:href",function(d,i) {return "res/topic_tags/selected/"+topic_id+".svg"});
    //Dim background books
    d3.selectAll(".books_background").attr("opacity", 0.5)
    //Dim wall
    d3.selectAll("#wall_background").attr("opacity", 0.5)
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
    },3000)
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
    d3.selectAll("#wall_background").attr("opacity", 1)
    // Reset the timer after calling the function
    resetTimer();
  }, 30000);
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





///////////////// OVERLAY

document.querySelector('.chevron_left').addEventListener("click", function() {
  shelf_view.style.display = "none";
});


document.querySelector('.back_text').addEventListener("click", function() {
  shelf_view.style.display = "none";
});





