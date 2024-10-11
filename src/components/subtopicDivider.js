import { capitalizeFirstLetterOfEachWord } from '../utils/helpers.js'
import { recommenderDivider } from './recommenderDivider.js'


export function subtopicDivider(selector, subtopicName, topicId) {

if (topicId == "recommended_books") { 
    const filteredData = recommender_data.filter(item => item.name_lastname === subtopicName)[0];
    recommenderDivider(selector, filteredData);
} else {
    selector
        .append("div")
        .attr("class", "subtopic_separator")
        .text(capitalizeFirstLetterOfEachWord(subtopicName))   
    }
}