import { capitalizeFirstLetterOfEachWord } from '../utils/helpers.js'

export function recommendationTopicDivider(selector, subtopicName) {

    const dividerFrame = selector
        .append("div")
        .attr("class", "recommendationTopicDivider")

    const textContainer = dividerFrame
        .append("div")
        .attr("class", "recommendationTopicDivider-text")
        
    const left = textContainer
        .append("div")
        .attr("class", "recommendationTopicDivider-left")
                
    const title = left
        .append("div")
        .attr("class", "recommendationTopicDivider-title")
        .html(capitalizeFirstLetterOfEachWord(subtopicName)) 

    const right = textContainer
        .append("div")
        .attr("class", "recommendationTopicDivider-right")
    
    const keywords = right
        .append("div")
        .attr("class", "recommendationTopicDivider-keywords")
        .text("keyword1 | keyword2 | keyword3 | keyword4") 
    
    dividerFrame
        .append("div")
        .attr("class", "recommendationTopicDivider-arrows")
    }