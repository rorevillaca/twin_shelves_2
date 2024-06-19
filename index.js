currently_selected_topic = "topic_1"

var wall_container = d3.select(".wall_container")
                       .append("svg")
                       .attr("height","100%")
                       .attr("width","90%");

books_background = wall_container.append("g")
                  .attr("id", "books_background")
                  .append("image")
                  .attr("xlink:href","res/book_background.svg")
                  .attr("height", "100%")
                  .attr("width", "100%")
                  .attr("opacity", "100%")
                  .attr("x", "0")
                  .attr("y", "0%")
                 
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
  
//wall_container.append("g")
//               .append("polygon")
//               .attr("points", "432.085,110.27 534.66,110.27 534.66,148.76 432.085,148.76")
//               .style("fill", "yellow")
//               .style("opacity", "0.6")

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
                select_topic(this.getAttribute('topic'))
                currently_selected_topic = this.getAttribute('topic')
              });

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
                            select_topic(this.getAttribute('topic'))
                            currently_selected_topic = this.getAttribute('topic')
                          });


function select_topic(topic_id) {
    console.log(topic_id)
    //Change previous selection to dark blue
    d3.select("#tag_"+currently_selected_topic).attr("xlink:href",function(d,i) {return "res/topic_tags/"+currently_selected_topic+".svg"})
    //Change color of polygons
    d3.selectAll("polygon").attr("opacity","0%")
    d3.select("#polygon_"+topic_id)
            .attr("opacity","20%")
            .transition()
            .duration(600)
            .attr("opacity","60%")
            .transition()
            .delay(200)
            .duration(600)
            .attr("opacity","40%")
    //Change selection to light blue
    d3.select("#tag_"+topic_id).attr("xlink:href",function(d,i) {return "res/topic_tags/selected/"+topic_id+".svg"})
    //Add magnifying glass icon
    wall_container.selectAll("#magnifying_glass").remove()
    if (topic_id !== 'None') {
    wall_background = wall_container
                  .append("g")
                  .attr("id", "magnifying_glass")
                  .append("image")
                  .attr("xlink:href","res/magnifying_glass.svg")
                  .attr("height", "30")
                  .attr("width", "30")
                  .attr("x", getAverageOfMaxCoordForTopic(topic_id,"x_perc"))
                  .attr("y", getAverageOfMaxCoordForTopic(topic_id,"y_perc"))
                  .attr("opacity","0%")
                  .transition()
                  .duration(900)
                  .delay(600)
                  .attr("opacity","100%")
                  .transition()
                  .duration(500)
                  .attr("height", "28")
                  .attr("width", "28")
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
    select_topic("None");
      // Reset the timer after calling the function
      resetTimer();
  }, 30000);
}

// Add event listener to the document to detect any click
document.addEventListener('click', resetTimer);
document.addEventListener('mousemove', resetTimer); // Reset on mouse move

// Set the initial 10-second timer when the script loads
resetTimer();




const getAverageOfMaxCoordForTopic = (topic, variable) => {
  const filteredData = topic_polygons.filter(item => item.topic === topic);

  const maxVar = filteredData.reduce((max, item) => item[variable] > max ? item[variable] : max, -Infinity);
  const minVar = filteredData.reduce((min, item) => item[variable] < min ? item[variable] : min, Infinity);
  const average = (maxVar + minVar) / 2;

  if (variable === 'x_perc') {
      return average * wall_width -14;
  } else if (variable === 'y_perc') {
      return average * wall_height - 14 + (wall_container_attrs.height-wall_height)/2;
  }
};