
export function recommenderDivider(containerSelector, recommenderData) {

    // Image
    // Name
    // Role
    // Phrase
    // QR
    // Color

    const dividerContainer = d3.select(containerSelector);
    const divider = dividerContainer
        .append('div')
        .attr("class","divider")
    
    const profilePicture = divider.append("div")
        .attr("class", "dividerProfilePicture")
        .style("background-image", "url('./src/res/recommenders/profile_pictures/recommender_22.png')")

    const name = divider.append("div")
        .attr("class", "dividerName")
        .text("Recommendations by Dr. A. Wandl")

    const role = divider.append("div")
        .attr("class", "dividerRole")
        .html("Professor </br> Architecture and the Built Environment | ABE")
    
    const phrase = divider.append("div")
        .attr("class", "dividerPhrase")
        .text("The following collection of books brings together an overview of how")
    
    const QR = divider.append("div")
        .attr("class", "dividerQR")
        .append("img")
        .attr("src","./src/res/recommenders/qrs/recommender_22.png")

    const scanLegend = divider.append("div")
        .attr("class",'dividerScanLegend')
        .html("Scan the QR to see </br> the full list of books")

}