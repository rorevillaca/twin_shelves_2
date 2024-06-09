currently_selected_topic = "topic_1"

var wall_container = d3.select(".wall_container")
                       .append("svg")
                       .attr("height","95%")
                       .attr("width","100%");
                 
wall_background = wall_container.append("g")
                  .attr("id", "wall_background")
                  .append("image")
                  .attr("xlink:href","res/wall_vector.svg")
                  .attr("height", "100%")
                  .attr("width", "100%")
                  .attr("x", "0")
                  .attr("y", "0%")
                  .attr("id", "wall_background")



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
                        .attr("id", function(d,i) {return d.topic})
                        .attr("xlink:href",function(d,i) {return "res/topic_tags/"+d.topic+".svg"})
                        .attr("width", function(d,i) {return d.width_percentage*100 + "%"})
                        .attr("x", function(d,i) {return d.start_x_percentage*100 + "%"})
                        .attr("y", function(d,i) {return d.start_y_percentage*100 + "%"})
                        .on('click',function(d) {   
                            select_topic(this.id)
                            currently_selected_topic = this.id
                          });


function select_topic(topic_id) {
    console.log(topic_id)
    //Change previous selection to dark blue
    d3.select("#"+currently_selected_topic).attr("xlink:href",function(d,i) {return "res/topic_tags/"+currently_selected_topic+".svg"})
    //Change selection to light blue
    d3.select("#"+topic_id).attr("xlink:href",function(d,i) {return "res/topic_tags/selected/"+topic_id+".svg"})

}