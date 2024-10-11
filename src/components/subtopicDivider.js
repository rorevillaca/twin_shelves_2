import { capitalizeFirstLetterOfEachWord } from '../utils/helpers.js'

export function subtopicDivider(selector, subtopicName) {
    selector
        .append("div")
        .attr("class", "subtopicDivider")
        .text(capitalizeFirstLetterOfEachWord(subtopicName))      
}