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
    
    const profilePicture = divider
        .append("div")
        .style("background-image", `url('./src/res/recommenders/profile_pictures/recommender_${data.id}.png')`)

    if (data.name !== "Studium Generale"){
        profilePicture.attr("class", "dividerProfilePicture")
        
        profilePicture.append("div")
            .attr("class","dividerProfilePictureFilter")
            .style("background-color", `#${data.color}`)
    } else{
        profilePicture.attr("class", "dividerProfilePictureColor")
    }

    const name = divider.append("div")
        .attr("class", "dividerName")
        .html(`Recommendations by </br> ${data.name}`)

    const role = divider.append("div")
        .attr("class", "dividerRole")
        .html(data.role)
        .style("background-color", `#${data.color}`)
    
    const phrase = divider.append("div")
        .attr("class", "dividerPhrase")
        .html(`<i>"${data.sentence}"</i>`)
        .style("background-color", `#${data.color}`)
    
    const QR = divider.append("div")
        .attr("class", "dividerQR")
        .style("background-color", `#${data.color}`)
        .style("background-image", `url('./src/res/recommenders/qrs/recommender_${data.id}.png')`)

    const scanLegend = divider.append("div")
        .attr("class",'dividerScanLegend')
        .html("Scan the QR code to</br>see the full list")
        .style("background-color", `#${data.color}`)

}