import { capitalizeFirstLetterOfEachWord } from '../utils/helpers.js'

export function recommendationTopicDivider(selector, themeName) {

    var theme_info = recommendation_topics.filter(item => item.theme === themeName);
    var kw = theme_info[0].keywords
    kw = kw.join(" | ") + "."

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
        .html(capitalizeFirstLetterOfEachWord(themeName)) 

    const right = textContainer
        .append("div")
        .attr("class", "recommendationTopicDivider-right")
    
    const keywords = right
        .append("div")
        .attr("class", "recommendationTopicDivider-keywords")
        .text(kw) 
    
    dividerFrame
        .append("div")
        .attr("class", "recommendationTopicDivider-arrows")
    }