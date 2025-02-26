import { typeText } from "../utils/helpers.js"


export function factCard(containerSelector) {
    const container = d3.select(containerSelector)

    const introText = "Did you know?"

    const factIntro = container
        .append("div")
        .attr("class", "did-u-know")
        .text(introText)
    const fact1 = container.
        append("div").
        attr("class", "fact")
        .text(".")
    const fact2 = container.
        append("div").
        attr("class", "fact")
        .text(".")

    const factText1 = "The Collection Wall is home to over 24.000 books"
    const factText2 = "spanning 130 years of technical literature"
    const delay = 100
    typeText(fact1, factText1, 600, delay)
    typeText(fact2, factText2, delay * (factText1.length + 1), 100)

}