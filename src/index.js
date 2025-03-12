import { shuffle, typeText, colorsArray } from './utils/helpers.js'
import { addWall, addBooks, removeBooks, wallContainer, addBackgroundBooks } from "./screens/mainScreen.js"
import { initShelvesScreen, populateShelfView } from "./screens/shelvesScreen.js"
import { ParsePolygons } from "./utils/data.js"
import { initDirectionsScreen } from "./screens/directionsScreen.js"
import { topicButton } from './components/topicButton.js'
import { exhibitionButton } from "./components/exhibitionButton.js"
import { initStudentWork } from "./screens/studentWorkScreen.js"
import { initHeritageObjects } from "./screens/heritageObjectsScreen.js"
import { initSearchScreen, enableSearch, disableSearch } from "./screens/searchScreen.js"
import { closeAllSecondaryScreens } from './components/backButton.js'
import { runFacts, factCardTimer } from './components/factCard.js'

let currentlySelectedSection = ""
let animationRunning = false;
export let isIdle = false
let currFact = 1

export const wallContainerAttrs = (d3.select(".wall_container").node().getBoundingClientRect())
export const wallWidth = wallContainerAttrs.width * 0.95
const wallRatio = 0.2250 //from inkscape (height / width)
export const wallHeight = wallWidth * wallRatio
const parsed_polygons = ParsePolygons(topic_polygons, wallContainerAttrs, wallWidth, wallHeight);

addWall()
initShelvesScreen()
initDirectionsScreen()
initStudentWork()
initHeritageObjects()
initSearchScreen()
addTopicButtons()
makeButtonsVisible()
addPolygons()
addBooks()


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


function scrambleObjects(topic) {
  let objectsCurrentPrototype = background_objects.filter(object => object.prototype === topic);
  let objectHeight = 10
  let objectWidth = objectHeight * 1.2
  let objectHeightExpanded = objectHeight * 2.5
  let objectWidthExpanded = objectWidth * 2.5

  if (topic == "heritage_objects") {
    objectsCurrentPrototype.forEach((item, index) => {
      item.photo = heritage_data[index].photo
    })

    wallContainer.selectAll("defs").remove()
    const defs = wallContainer.append("defs");

    objectsCurrentPrototype.forEach((d, i) => {
        defs.append("pattern")
            .attr("id", `pattern-${i}`)
            .attr("width", 1)
            .attr("height", 1)
            .attr("patternUnits", "objectBoundingBox")
            .append("image")
            .attr("xlink:href", `src/res/photos/heritage_objects/${d.photo}`)
            .attr("height", objectHeightExpanded)
            .attr("width", objectWidthExpanded)
            .attr("preserveAspectRatio", "xMidYMid slice");

    })
  }


  console.log(console.log(JSON.stringify(objectsCurrentPrototype)))

  const objectsEnter = wallContainer
    .selectAll(".book")
    .data(objectsCurrentPrototype, d => d.id)
    .enter()
    .append("rect")
    .attr("class", "book")
    .attr("fill", d => d.fill ? d.fill : "white")
    .attr("fill", (d,i) => d.photo ? `url(#pattern-${i})` : "white")
    .attr("x", d => d.x_perc * wallWidth - objectWidth / 2)
    .attr("y", d => d.y_perc * wallHeight + (wallContainerAttrs.height - wallHeight) / 2 - objectHeight / 2)
    .attr("height", objectHeight)
    .attr("width", objectWidth)
    .transition()

  objectsCurrentPrototype = shuffle(objectsCurrentPrototype)

  wallContainer
    .selectAll(".book")
    .data(objectsCurrentPrototype, d => d.id)
    .transition()
    .delay((d, i) => i * 100)
    .duration(700)
    .attr("x", d => d.x_end_perc ? d.x_end_perc * wallWidth - objectWidth / 2 : d.x_perc * wallWidth - objectWidth / 2)
    .attr("y", d => d.y_end_perc ? d.y_end_perc * wallHeight + (wallContainerAttrs.height - wallHeight) / 2 - objectHeight / 2 : d.y_perc * wallHeight + (wallContainerAttrs.height - wallHeight) / 2 - objectHeight / 2)
    .attr("height", objectHeightExpanded)
    .attr("width", objectWidthExpanded)

  wallContainer
    .selectAll(".book")
    .data(objectsCurrentPrototype, d => d.id)
    .transition()
    .delay((d, i) => 2000 + i * 100)
    .duration(700)
    .attr("x", d => d.x_perc * wallWidth - objectWidth / 2)
    .attr("y", d => d.y_perc * wallHeight + (wallContainerAttrs.height - wallHeight) / 2 - objectHeight / 2)
    // .attr("fill", d => d.fill ? d.fill : "white")
    .attr("height", objectHeight)
    .attr("width", objectWidth)
}


function scrambleBooks(topic) {
  const enlargeFactor = 12
  var booksArray = shuffle(background_books);
  var bookCaseCurrentTopic = virtual_bookshelves.filter(book => book.topic_id === topic);
  var sampleBooksCurrentTopic = bookCaseCurrentTopic[0].books
  sampleBooksCurrentTopic = [...sampleBooksCurrentTopic, ...bookCaseCurrentTopic[1].books];
  sampleBooksCurrentTopic = [...sampleBooksCurrentTopic, ...bookCaseCurrentTopic[2].books];
  sampleBooksCurrentTopic = sampleBooksCurrentTopic.filter(book => book.cover_file !== "NA"); // Filter out books with cover_file === "NA"

  // Step 1: Create a new array with x_start and y_start renamed to x_end and y_end
  let newArray = booksArray.map(book => ({
    x_end: book.x_start,
    y_end: book.y_start,
    height_end: book.book_height,
    topic2: book.topic
  }));

  // Step 2: Shuffle the new array
  newArray = shuffle(newArray);

  // Step 3: Append the shuffled elements row-wise to the original array
  booksArray = booksArray.map((book, index) => ({
    ...book,
    ...newArray[index],
    cover_file: sampleBooksCurrentTopic[index % sampleBooksCurrentTopic.length].cover_file
  }));

  // Step 4: Create intermediate position
  booksArray = booksArray.map(book => ({
    ...book,
    x_mid: (book.x_end < 0.315) ? book.x_start : book.x_end, // avoid corner
    y_mid: (book.x_end < 0.315) ? book.y_end : book.y_start  // avoid corner
  }));

  // Add noise to the position (so it all looks less blocky)
  const getRandomOffset = () => (Math.random() * 0.2) - 0.1; // Generates a number between -0.1 and 0.1
  booksArray = booksArray.map(point => ({
    ...point,
    x_mid: point.x_mid + getRandomOffset(),
    hasImage: Math.random() < 0.2 ? 1 : 0
  }));

  booksArray = booksArray.filter(book => book.topic2 === topic);

  const defs = wallContainer.append("defs");

  booksArray.forEach((d, i) => {
    defs.append("pattern")
      .attr("id", `pattern-${i}`)
      .attr("width", 1)
      .attr("height", 1)
      .attr("patternUnits", "objectBoundingBox")
      .append("image")
      .attr("xlink:href", `src/res/resized_covers_struct/${d.cover_file}`)
      .attr("width", d.book_width * wallWidth * enlargeFactor)
      .attr("height", d.book_height * wallHeight * enlargeFactor * 0.6)
      .attr("preserveAspectRatio", "xMidYMid slice");
  });


  // Enter selection: Add new elements
  const booksEnter = wallContainer.selectAll(".book")
    .data(booksArray)
    .enter()
    .append("rect")
    .attr("class", "book")
    .attr("y", d => d.y_start * wallHeight + (wallContainerAttrs.height - wallHeight) / 2)
    .attr("width", d => d.book_width * wallWidth)
    .attr("height", d => d.book_height * wallHeight)
    .attr("x", d => d.x_start * wallWidth)
    .attr("fill", (d, i) => d.hasImage ? `url(#pattern-${i})` : colorsArray[Math.floor(Math.random() * colorsArray.length)])
    .style("opacity", 1)

  // Transition for entering elements
  booksEnter.transition()
    .duration(1000)
    .style("opacity", 1)
    .on('end', function () {
      // Apply the second transition (to change the fill color) to the merged selection
      d3.select(this)
        .transition()
        .delay(800 * Math.random())
        .attr("y", d => d.y_mid * wallHeight + (wallContainerAttrs.height - wallHeight) / 2)
        .attr("width", d => d.hasImage ? d.book_width * wallWidth * enlargeFactor : d.book_width * wallWidth)
        .attr("height", d => d.hasImage ? d.height_end * wallHeight * enlargeFactor : d.height_end * wallHeight)
        .style("opacity", d => d.hasImage ? 1 : 0)
        .attr("x", d => d.x_mid * wallWidth)
        .on('end', function () {
          // Apply the second transition (to change the fill color) to the merged selection
          d3.select(this)
            .transition()
            .delay(800 * Math.random())
            .attr("y", d => d.y_end * wallHeight + (wallContainerAttrs.height - wallHeight) / 2)
            .attr("width", d => d.book_width * wallWidth)
            .attr("height", d => d.height_end * wallHeight)
            .attr("x", d => d.x_end * wallWidth)
            .style("opacity", d => d.opacity_final)
        })
    })

}

function addPolygons() {
  wallContainer
    .append("g")
    .attr("id", "topic-polygons")
    .selectAll("polygon")
    .remove()
    .data(parsed_polygons)
    .enter()
    .append("polygon")
    .attr("points", d => d.points)
    .attr("topic", d => d.topic)
    .attr("id", d => "polygon_" + d.topic)
    .attr("fill", "#838ef0")
    .attr("opacity", "0%")
    //.attr("stroke", "red")
    .attr("stroke-width", 1)
    .on('click', function (d) {
      if (animationRunning) return; // Prevent running if animation is already in progress
      animationRunning = true; // Set the flag to indicate the animation is running
      //Add missing books back
      if (currentlySelectedSection !== "") {
        addBackgroundBooks(currentlySelectedSection, wallContainer)
      }
      //Perform selection on books and tags
      selectSection(this.getAttribute('topic'))
      //Set state variable
      currentlySelectedSection = this.getAttribute('topic')
    });
}

function removePolygons() {
  wallContainer.selectAll("#topic-polygons").remove()
}

function magnifying_glass(topic) {

  // While the magnifying glass is on, we set timer for the selection screen
  resetTopicSelectionTimer()
  resetIdleTimer()
  document.removeEventListener('click', resetIdleTimer);
  document.addEventListener('click', resetTopicSelectionTimer);


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
      .attr("class", "magnifying_assets");
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
      .on('click', function (d) {
        resetIdleTimer()
        document.removeEventListener('click', resetTopicSelectionTimer);
        document.addEventListener('click', resetIdleTimer);
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
            populateShelfView({
              topic_name: topic_name,
              topicId: topic,
              bookCaseCurrentTopic: bookCaseCurrentTopic
            })
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
      .attr("xlink:href", "src/res/pointer_icon.svg")
      .attr("height", "20")
      .attr("width", "20")
      .attr("x", getCoordOfTopic(topic, "x_perc", "max") - 5)
      .attr("y", getCoordOfTopic(topic, "y_perc", "max") - 5)

    // Call the pulsing function after some idle time (e.g., 5 seconds)
    setTimeout(() => {
      startPulsing();
    }, 5000);

  }
}

function addTopicButtons() {
  const parentContainer = d3.select(".parent_container")

  parentContainer
    .append("div")
    .attr("class", "instructions_container")
  parentContainer
    .append("div")
    .attr("class", "topics_container")
  parentContainer
    .append("div")
    .attr("class", "instructions_container instructions_container2")
  parentContainer
    .append("div")
    .attr("class", "exhibitions_container")

  tag_info.forEach(d => {
    switch (d.tag_type) {
      case "book_collection":
        topicButton(".topics_container", d.name, d.topic, d.number_of_bars);
        break;
      case "exhibition":
        exhibitionButton(".exhibitions_container", d.name, d.topic)
        break;
    }
  })

  d3.selectAll(".topicButtonContainer, .exhibitionsButton")
    .on('click', function (d) {
      const section = this.getAttribute('id')
      if (animationRunning) return; // Prevent running if animation is already in progress
      animationRunning = true; // Set the flag to indicate the animation is running
      //Add missing books back
      if (currentlySelectedSection !== "") {
        addBackgroundBooks(currentlySelectedSection, wallContainer)
      }
      //Perform selection on books and tags
      selectSection(section)
      //Set state variable
      currentlySelectedSection = section
    });
}

function clearButtonsSection() {
  d3.select(".facts_container").remove()
  d3.select(".topics_container").remove()
  d3.select(".exhibitions_container").remove()
  d3.selectAll(".instructions_container").remove()
}


function makeButtonsVisible() {
  const buttons = d3.selectAll(".topicButtonContainer, .exhibitionsButton").nodes();

  const shuffledButtons = shuffle(buttons);
  const buttonLoadTime = 2000

  d3.selectAll(shuffledButtons)
    .style("opacity", 0)
    .style("transform", "scaleX(0)")  // Start with zero width
    .style("transform-origin", "left") // Ensure it scales from the left
    .transition()
    .duration(buttonLoadTime)
    .style("opacity", 1)
    .style("transform", "scaleX(1)");  // Expand to full size

  setTimeout(() => {
    d3.selectAll(".topicButtonName, .exhibitionsButton")
      .style("color", "white")
  }, buttonLoadTime);


  const intructions = d3
    .select(".instructions_container")
    .append("span")
  typeText(intructions, "Explore by topic:", 3500, 160)

  const intructions2 = d3
    .select(".instructions_container2")
    .append("span")
  typeText(intructions2, "Explore by category:", 3500, 160)
};



function selectSection(sectionId) {
  if (currentlySelectedSection !== "") {
    d3.select("#" + currentlySelectedSection).selectAll("div").style("background-color", "#2c2c6b")
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
    d3.select("#" + sectionId).selectAll("div").style("background-color", "#808ff7")
    var waitTime = 0

    if (sectionId == "heritage_objects" || sectionId == "student_work") {
      waitTime = 3000
      scrambleObjects(sectionId)
    } else {
      waitTime = 3000
      scrambleBooks(sectionId);
    }

    // Wait bfore running
    setTimeout(function () {
      //Add magnifying glass
      magnifying_glass(sectionId);
      animationRunning = false; // Set the flag to indicate the animation has finished
    }, waitTime)
  }

}

// Initialize a variable to hold the timeout ID
let topicSelectionTimerID
let idleTimeoutId


function resetIdleTimer() {
  console.log("Idle timer reset")
  clearTimeout(idleTimeoutId)
  idleTimeoutId = setTimeout(() => {
    enterIdleState()
  }, 20000) // Time for idle state to start

}

function resetTopicSelectionTimer() {
  console.log("Topic selection timer reset")
  clearTimeout(topicSelectionTimerID)
  topicSelectionTimerID = setTimeout(() => {
    clearSelectedSection()
  }, 15000);
}

export function clearSelectedSection() {
  //Add missing books back
  if (currentlySelectedSection !== "") {
    addBackgroundBooks(currentlySelectedSection, wallContainer)
  };
  selectSection("");
  currentlySelectedSection = "";
  //Undim background books
  d3.selectAll(".books_background").attr("opacity", 1)
  d3.selectAll("#wall_background").attr("opacity", 1)
  // Reset the timer after calling the function
  resetIdleTimer();
  document.removeEventListener('click', resetTopicSelectionTimer);
  document.addEventListener('click', resetIdleTimer);
}

function enterIdleState() {
  isIdle = true
  console.log("enter idle state")
  document.removeEventListener('click', resetIdleTimer)
  document.addEventListener('click', exitIdleState)
  clearButtonsSection()
  closeAllSecondaryScreens()
  removeBooks()
  removePolygons()
  disableSearch()
  currFact = runFacts(currFact)

  setTimeout(() => {
    isIdle ? exitIdleState() : null
  }, 45000) // Time in idle state
}

function exitIdleState() {
  isIdle = false
  console.log("exit idle state")
  document.removeEventListener('click', exitIdleState)
  document.addEventListener('click', resetIdleTimer);
  clearTimeout(factCardTimer)//Prevents animations from running outside of idle state
  wallContainer.selectAll(".book").interrupt()
  addBooks()
  addPolygons()
  enableSearch()
  resetIdleTimer();
  clearButtonsSection()
  addTopicButtons()
  makeButtonsVisible()
  d3.select(".facts_container").remove()
  removeBooks()
}

// Add event listener to the document to detect any click
document.addEventListener('click', resetIdleTimer);

// Set the initial 10-second timer when the script loads
resetIdleTimer();


const getCoordOfTopic = (topic, variable, min_or_max) => {

  const filteredData = topic_polygons.filter(item => item.topic === topic);
  const maxVar = filteredData.reduce((max, item) => item[variable] > max ? item[variable] : max, -Infinity);
  const minVar = filteredData.reduce((min, item) => item[variable] < min ? item[variable] : min, Infinity);

  if (variable === 'x_perc') {
    if (min_or_max === "min") {
      return minVar * wallWidth;
    } else {
      return maxVar * wallWidth;
    }
  } else if (variable === 'y_perc') {
    if (min_or_max === "min") {
      return minVar * wallHeight + (wallContainerAttrs.height - wallHeight) / 2;
    } else {
      return maxVar * wallHeight + (wallContainerAttrs.height - wallHeight) / 2;
    }
  }
};