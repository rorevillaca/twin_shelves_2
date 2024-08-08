import {capitalizeFirstLetterOfEachWord, shuffle} from './utils/helpers.js'
import {initMainScreen, wallContainer, addBackgroundBooks} from "./screens/mainScreen.js"
import {initShelvesScreen} from "./screens/shelvesScreen.js"
import {ParsePolygons} from "./utils/data.js"
import {initDirectionsScreen, openDirectionsScreen} from "./screens/directionsScreen.js"



let currentlySelectedTopic = ""
let animationRunning = false;

initMainScreen()
initShelvesScreen()
initDirectionsScreen()

const wallContainerAttrs = (d3.select(".wall_container").node().getBoundingClientRect())
const wallWidth = wallContainerAttrs.width * 0.95
const wallRatio = 0.2250 //from inkscape (height / width)
const wallHeight = wallWidth * wallRatio


function add_highlighted_books(topic) {
  // Filter the data to include only books with the desired topic
  var filtered_books = background_books.filter(book => book.topic === topic);
  // Randomize the order
  filtered_books = shuffle(filtered_books);
  // Remove existing books
  wallContainer.selectAll(".book").remove();
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
                if (currentlySelectedTopic !== "") {
                  addBackgroundBooks(currentlySelectedTopic, wallContainer)}
                //Perform selection on books and tags
                selectTopic(this.getAttribute('topic'))
                //Set state variable
                currentlySelectedTopic = this.getAttribute('topic')
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
            shelf_view.style.display = "grid";
            populate_topics_shelf_view(topic, topic_name)
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


var topicsContainer = d3.select(".topics_container")
    .append("svg")
    .attr("height","100%")
    .attr("width","100%");


topicsContainer.append("g")
    .selectAll("image")
    .remove()
    .data(tag_info)
    .enter()
    .append('image')
    .attr("topic", function(d,i) {return d.topic})
    .attr("id", function(d,i) {return "tag_"+d.topic})
    .attr("xlink:href",function(d,i) {return "src/res/topic_tags/"+d.topic+".svg"})
    .attr("width", function(d,i) {return d.width_percentage*100 + "%"})
    .attr("x", function(d,i) {return d.start_x_percentage*100 + "%"})
    .attr("y", function(d,i) {return d.start_y_percentage*100 + "%"})
    .on('click',function(d) {   
        if (animationRunning) return; // Prevent running if animation is already in progress
        animationRunning = true; // Set the flag to indicate the animation is running
        //Add missing books back
        if (currentlySelectedTopic !== "") {
          addBackgroundBooks(currentlySelectedTopic, wallContainer)}
        //Perform selection on books and tags
        selectTopic(this.getAttribute('topic'))
        //Set state variable
        currentlySelectedTopic = this.getAttribute('topic')
      });


function selectTopic(topicId) {
    //Remove magnifying glass (if any)
    wallContainer.selectAll(".magnifying_assets").remove();
    //Change previous selection to dark blue
    d3.select("#tag_"+currentlySelectedTopic).attr("xlink:href",function(d,i) {return "src/res/topic_tags/"+currentlySelectedTopic+".svg"});
    //Change selection to light blue
    d3.select("#tag_"+topicId).attr("xlink:href",function(d,i) {return "src/res/topic_tags/selected/"+topicId+".svg"});
    //Dim background books
    d3.selectAll(".books_background").attr("opacity", 0.5)
    //Dim wall
    d3.selectAll("#wall_background").attr("opacity", 0.5)
    // Construct the id of the group element to be removed
    const elementId = `books_background_${topicId}`; 
    // Select the element with the constructed id and remove it
    d3.selectAll(`#${elementId}`).remove();
    // Add white books
    add_highlighted_books(topicId);
    // Wait 3 seconds
    setTimeout(function(){
      //Add magnifying glass
      magnifying_glass(topicId);
      animationRunning = false; // Set the flag to indicate the animation has finished
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
    if (currentlySelectedTopic !== "") {
      addBackgroundBooks(currentlySelectedTopic, wallContainer)};
    selectTopic("");
    currentlySelectedTopic = "";
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






















function populate_topics_shelf_view(topic_id, topic_name){
  d3.selectAll(".book_details--visible").remove()
  d3.selectAll(".book_details--invisible").remove()
  d3.selectAll(".bookcase_holder").remove()

  var bookcase_curr_topic = virtual_bookshelves.filter(book => book.topic_id === topic_id);
  var number_of_bookcases = bookcase_curr_topic.length

  d3.select(".shelf_view--topic_holder").text(topic_name)
  var subtopic_holder = d3.select(".shelf_view--subtopic_holder")
  var uniqueSubtopics = [...new Set(bookcase_curr_topic.map (item => item.sub_topic))]

  subtopic_holder.selectAll(".shelves_subtopics").remove()
  
  subtopic_holder
    .selectAll(".shelves_subtopics")
    .data(uniqueSubtopics)
    .enter()
    .append("div")
    .attr("class", "shelves_subtopics")
    .attr("id",d => d)
    .text(d => d)
    .on('click',function() {
      navigateToSubtopic(bookcase_curr_topic,this.getAttribute('id'))
    })

  //Calculate width for book details div
  var shelf_view_attr = (d3.select(".shelf_view--shelves").node().getBoundingClientRect())
  const book_details_width = shelf_view_attr.width * 0.333333 

  const bookcases = Array.from({ length: number_of_bookcases}, (v, i) => (i + 1));

  bookcases.forEach((bookcase_id) => {
    const bookcase_content =  bookcase_curr_topic[bookcase_id - 1]

    const bookcase_holder = d3.select(".shelf_view--shelves")
                          .append("div")
                          .attr("class", "bookcase_holder")

    if (bookcase_content.virtual_shelf_temp === 1){
      bookcase_holder
            .append("div")
            .attr("class", "subtopic_separator")
            .text(capitalizeFirstLetterOfEachWord(bookcase_content.sub_topic))
    }

    const bookcase = bookcase_holder.append("div")
                          .attr("class", "bookcase")

    addInfoCard(bookcase_id)

    for (let i = 1; i <= bookcase_content.books_in_bookcase; i++) {

      var coverFilename = bookcase_content.books[i-1].cover_file
      var OCLC = bookcase_content.books[i-1].OCLC
      
      const book = bookcase.append("div")
        .attr("class", "shelf--book")
        .attr("bookcase_id",bookcase_id)
        .attr("id",OCLC)

      if (bookcase_content.virtual_shelf_temp === 1){
        book.style("min-width", "23%")
      } else {
        book.style("min-width", "18%")
      }

        if (coverFilename === "NA") {
            book.style("background-color", "silver");
        } else {
            book.style("background-image", `url("src/res/resized_covers_struct/${coverFilename}")`)
        }

      book.on('click',function() {
        let bookcase_id = this.getAttribute('bookcase_id')
        d3.select('.shelf_view--shelves')
          .property('scrollLeft', book_details_width * (bookcase_id - 1))
        d3.selectAll(".book_details--visible")
          .attr("class", "book_details--invisible")

        d3.selectAll(".shelf--book").classed("dimmed", true);
        d3.select(this).classed("dimmed", false).classed("highlighted", true);

        const info_card = d3.select(`#book_details_${bookcase_id}`)
        info_card.attr("class", "book_details--visible")
        fillInfoCard(info_card, this.getAttribute('id'))
        })
    }
  });


  function navigateToSubtopic(bookcase_curr_topic,subtopic_name){
    const lowercase_name = subtopic_name.toLowerCase()
    const index = bookcase_curr_topic.findIndex(item => item.sub_topic === lowercase_name);
    d3.selectAll(".book_details--visible")
      .attr("class", "book_details--invisible")
    d3.select('.shelf_view--shelves')
      .property('scrollLeft', index * book_details_width)
  }

  document.querySelector('.shelf_view--shelves').scrollLeft = 0;

  d3.select('.shelf_view--right_scroll_button').on('click', function() {
    d3.select('.shelf_view--shelves')
    .property('scrollLeft', function() {
        return this.scrollLeft + book_details_width;
    });
  });

  d3.select('.shelf_view--left_scroll_button').on('click', function() {
    d3.select('.shelf_view--shelves')
    .property('scrollLeft', function() {
        return this.scrollLeft - book_details_width;
    });
  });
}


function addInfoCard(bookcase_id){
    const card = d3.select(".shelf_view--shelves").append("div")
    card.attr("class", "book_details--invisible")
        .attr("id", `book_details_${bookcase_id}`)
    const header = card.append("div")
        .attr("class","info_card--header")
    header.append("h3").attr("class", "info_card--title")
    header.append("img")
        .attr("src", "src/res/Font-Awesome/times-circle.svg")
        .attr("class","inline-icon")
        .on('click',function() {
          d3.selectAll(".book_details--visible")
          .attr("class", "book_details--invisible")
          d3.selectAll(".shelf--book").classed("dimmed", false).classed("highlighted",false);
        })
    card.append("div").attr("class","info_card--details")
    const misc = card.append("div").attr("class","info_card--misc")
    const QR_holder = misc.append("div")
        .attr("class", "info_card--QR_holder")
        .text("Scan to see more:")
    QR_holder.append("img")
    const location_details = misc.append("div")
        .attr("class", "info_card--location_details")

    location_details.append("div").attr("class", "info_card--location_details--text")
    location_details.append("div")
                    .attr("class", "info_card--location_details--button")
                    .html('<b>See location</b>&emsp;<img src="src/res/Font-Awesome/arrow-circle-right.svg" class="inline-icon">')                         
}


function fillInfoCard(info_card, OCLC){
    const book_info = workshop_data.filter(book => book.OCLC === OCLC)[0];
    info_card.select(".info_card--title").text(book_info.title)

    const details_html = buildDetailsHTML(book_info)
    info_card.select(".info_card--details").html(details_html)

    const worldcat_url = `https://tudelft.on.worldcat.org/oclc/${OCLC}`

    const qr_code = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(worldcat_url)}&size=150x150&color=131-143-240&margin=10`
    info_card.select(".info_card--QR_holder")
      .select("img")
      .attr("src", qr_code)

    const location_text = `Code: <b>${book_info.std_call_number}</b><br>Floor: <b>${book_info.floor}</b>` 
    info_card.select(".info_card--location_details--text").html(location_text)

    //Add onclick w/ current book info
    const locationDetails = info_card.
      select(".info_card--location_details")
      .on('click', () => {
        openDirectionsScreen(OCLC)
      })

}


function buildDetailsHTML(book_info){
  let base_string = `Author: ${book_info.authors}`
  base_string = `${base_string}<br>Year: ${book_info.year}`
  if (book_info.description != "") {
    base_string = `${base_string}<br><br>Description:<br>${book_info.description}`
  }
  return base_string
}

