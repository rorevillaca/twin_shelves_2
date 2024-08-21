import { capitalizeFirstLetterOfEachWord } from '../utils/helpers.js'


export function subtopicDivider(selector, subtopicName, topicId) {

    const filteredData = recommender_data.filter(item => item.name_lastname === subtopicName)[0];

if (topicId == "recommended_books") { 
     recommenderDivider(selector, filteredData);
    } else {
    selector
        .append("div")
        .attr("class", "subtopic_separator")
        .text(capitalizeFirstLetterOfEachWord(subtopicName))   
    
    }
}


function recommenderDivider(dividerContainer, data) {

    //const dividerContainer = d3.select(containerSelector);
    const divider = dividerContainer
        .append('div')
        .attr("class","divider")
    
    const profilePicture = divider.append("div")
        .attr("class", "dividerProfilePicture")
        .style("background-image", `url('./src/res/recommenders/profile_pictures/recommender_${data.id}.png')`)

    const name = divider.append("div")
        .attr("class", "dividerName")
        .html(`Recommendations by </br> ${data.name}`)
        .style("background-color", `#${data.color}`)

    const role = divider.append("div")
        .attr("class", "dividerRole")
        .html(data.faculty)
    
    const phrase = divider.append("div")
        .attr("class", "dividerPhrase")
        .html(`<i>"${data.sentence}"</i>`)
        .style("background-color", `#${data.color}`)
    
    const QR = divider.append("div")
        .attr("class", "dividerQR")
        .style("background-color", `#${data.color}`)
        .append("img")
        .attr("src",`./src/res/recommenders/qrs/recommender_${data.id}.png`)

    const scanLegend = divider.append("div")
        .attr("class",'dividerScanLegend')
        .html("Scan the QR to see </br> the full list of books")
        .style("background-color", `#${data.color}`)

}