import { backButton } from "../components/backButton.js"
import { openDirectionsScreen } from "./directionsScreen.js"
import { subtopicDivider } from "../components/subtopicDivider.js";
import { recommendationTopicDivider } from "../components/recommendationTopicDivider.js";
import { recommenderDivider } from "../components/recommenderDivider.js";
import { cleanBookTitle } from "../utils/helpers.js";


export function initShelvesScreen() {
    backButton("#shelf-view--header")
}

export function populateShelfView({ topic_name, topicId, bookCaseCurrentTopic}){

    var numberOfBookcases = bookCaseCurrentTopic.length
    var uniqueSubtopics = [...new Set(bookCaseCurrentTopic.map (item => item.sub_topic))]
    var topic_holder = d3.select(".shelf_view--topic_holder")
    var subtopic_holder = d3.select(".shelf_view--subtopic_holder")
    var shelf_view_attr = (d3.select(".shelf_view--shelves").node().getBoundingClientRect())
    const book_details_width = shelf_view_attr.width * 0.333333 
    
    d3.select(".shelf_view--shelves").selectAll("*").remove()
    subtopic_holder.selectAll(".shelves_subtopics").remove()
    topic_holder.text(topic_name)

    if (topicId !== "search_results"){
        subtopic_holder
            .selectAll(".shelves_subtopics")
            .data(uniqueSubtopics)
            .enter()
            .append("div")
            .attr("class", "shelves_subtopics")
            .attr("id",d => d)
            .text(d => d)
            .on('click',function() {
                navigateToSubtopic(bookCaseCurrentTopic,this.getAttribute('id'))
            })
    } else {
        subtopic_holder
        .selectAll(".shelves_subtopics")
        .remove()
    }


    populateBookCases(numberOfBookcases, bookCaseCurrentTopic, topicId, book_details_width)


    d3.select('.shelf_view--right_scroll_button').on('click', function() {
        d3.select('.shelf_view--shelves')
            .property('scrollLeft', function() {
            return this.scrollLeft + book_details_width;
        })
        closeInfoCard()
    });

    d3.select('.shelf_view--left_scroll_button').on('click', function() {
        d3.select('.shelf_view--shelves')
            .property('scrollLeft', function() {
            return this.scrollLeft - book_details_width;
        })
        closeInfoCard
    });
    }


function populateBookCases(numberOfBookcases, bookCaseCurrentTopic, topicId, book_details_width){    
    
    const bookcases = Array.from({length: numberOfBookcases}, (v, i) => (i + 1));

    bookcases.forEach((bookcase_id) => {
        const bookcase_content =  bookCaseCurrentTopic[bookcase_id - 1]
        const subtopicName = bookcase_content.sub_topic

        var bookcaseHolder = d3.select(".shelf_view--shelves")

        if (topicId !== "recommended_books"){
            
            bookcaseHolder = d3
            .select(".shelf_view--shelves")
            .append("div")
            .attr("class", "bookcase_holder")

            if (bookcase_content.virtual_shelf_temp === 1){
                subtopicDivider(bookcaseHolder, subtopicName)
            }

        } else { //For recommended books, the divider is independent of the bookcases

            const shelves_container = d3
                .select(".shelf_view--shelves")
            
            if (bookcase_content.virtual_shelf_temp === 1){
                recommendationTopicDivider(shelves_container,subtopicName)
            }  

            const recommenderData = recommender_data.filter(item => item.name_lastname === bookcase_content.recommender)[0];
            recommenderDivider(shelves_container, recommenderData) 

            bookcaseHolder = shelves_container
                .append("div")
                .attr("class", "bookcase_holder")

        }

        const bookcase = bookcaseHolder
        .append("div")
        .attr("class", "bookcase")

        addInfoCard(bookcase_id)

        for (let i = 1; i <= bookcase_content.books_in_bookcase; i++) {

            var coverFilename = bookcase_content.books[i-1].cover_file
            var OCLC = bookcase_content.books[i-1].OCLC
            
            const book = bookcase.append("div")
                .attr("class", "shelf--book")
                .attr("bookcase_id",bookcase_id)
                .attr("id",OCLC)


            if (topicId === "recommended_books"){
                book.style("min-width", "31%")
                book.style("max-width", "31%")
                book.style("min-height", "23%")
                book.style("max-height", "23%")
            
            } else {
                book.style("min-height", "18%")
                book.style("max-height", "18%")
                if  (bookcase_content.virtual_shelf_temp === 1){
                    book.style("min-width", "23%")
                    book.style("max-width", "23%")
                } else {
                    book.style("min-width", "18%")
                    book.style("max-width", "18%")
                }
                
            }

                console.log(coverFilename)
                if (coverFilename === "NA" || coverFilename === "_dissertations/cover_diss.webp") {
                    const book_info = workshop_data.filter(book => book.OCLC === OCLC)[0];
                    const title  = book_info.title
                    const bookBackgroundColor =  bookcase_content.books[i-1].color ? "#" + bookcase_content.books[i-1].color : "#595959"
                    const bookTitleColor =  bookcase_content.books[i-1].color ? "white" : "black"
                    book.style("background-color", bookBackgroundColor);
                    book.style("color", "white");
                    book.text(cleanBookTitle(title))
                } else {
                    book.style("background-image", `url("src/res/resized_covers_struct/${coverFilename}")`)
                }

            book.on('click',function() {
                
                    let bookcase_id = this.getAttribute('bookcase_id')
                    if (topicId !== "recommended_books"){
                        d3.select('.shelf_view--shelves')
                        .property('scrollLeft', book_details_width * (bookcase_id - 1))
                    }
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
    document.querySelector('.shelf_view--shelves').scrollLeft = 0;
}



function navigateToSubtopic(bookcase_curr_topic,subtopic_name){

    var scrollAmount = 0
    
    if (bookcase_curr_topic[0]["topic"] == "Book Recommendations") {
        const container = d3.select(".shelf_view--shelves").node(); // Select the scrollable container
        const targetElement = d3.selectAll(".recommendationTopicDivider-title")
            .filter((_, i, nodes) => d3.select(nodes[i]).text() === subtopic_name)
            .node()
            ?.getBoundingClientRect();
        
        const scrollWindow = d3.select('.shelf_view--shelves')
        const currentScrollPosition = scrollWindow.property('scrollLeft')
        const scrollOffset = scrollWindow.node().getBoundingClientRect().x
        scrollAmount = currentScrollPosition + targetElement.x - scrollOffset - 50;

    } else {

        //This variable definition is duplicated; TODO: unify
        var shelf_view_attr = (d3.select(".shelf_view--shelves").node().getBoundingClientRect())
        const book_details_width = shelf_view_attr.width * 0.333333 
        const lowercase_name = subtopic_name.toLowerCase()
        const index = bookcase_curr_topic.findIndex(item => item.sub_topic.toLowerCase() === lowercase_name);
        scrollAmount = index * book_details_width
    }

    d3.selectAll(".book_details--visible")
        .attr("class", "book_details--invisible")
    d3.select('.shelf_view--shelves')
        .property('scrollLeft', scrollAmount)
}


function fillInfoCard(info_card, OCLC){
    const book_info = workshop_data.filter(book => book.OCLC === OCLC)[0];
    info_card.select(".info_card--title").text(book_info.title)

    const details_html = buildDetailsHTML(book_info)
    info_card.select(".info_card--details").html(details_html)

    const worldcat_url = `https://tudelft.on.worldcat.org/oclc/${OCLC}`

    const qr_code = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(worldcat_url)}&size=150x150&color=131-143-240&bgcolor=30-28-39`
    info_card.select(".info_card--QR_holder")
        .select("img")
        .attr("src", qr_code)

    const location_text = `Code: <b>${book_info.std_call_number}</b><br>Floor: <b>${book_info.floor}</b>` 
    info_card.select(".info_card--location_details--text").html(location_text)

    //Add onclick w/ current book info
    const locationDetails = info_card.
        select(".info_card--location_details")
        .on('click', () => {
            const bookInfo = workshop_data.filter(book => book.OCLC === OCLC)[0];
            openDirectionsScreen(bookInfo)
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
            closeInfoCard()
        })
    card.append("div").attr("class","info_card--details")
    const misc = card.append("div").attr("class","info_card--misc")
    const QR_holder = misc.append("div")
        .attr("class", "info_card--QR_holder")
    QR_holder.append("p").text("Scan to see more:")
    QR_holder.append("img")
    const location_details = misc.append("div")
        .attr("class", "info_card--location_details")

    location_details.append("div").attr("class", "info_card--location_details--text")
    location_details.append("div")
                    .attr("class", "info_card--location_details--button")
                    .html('<b>See location</b>&emsp;<img src="src/res/Font-Awesome/arrow-circle-right.svg" class="inline-icon">')                         
}

function closeInfoCard(){
    d3.selectAll(".book_details--visible")
        .attr("class", "book_details--invisible")
        d3.selectAll(".shelf--book").classed("dimmed", false).classed("highlighted",false);
}