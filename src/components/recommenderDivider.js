export function recommenderDivider(dividerContainer, data) {

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

    const main = divider.append("div")
        .attr("class", "dividerMain")

    if (data.name !== "Studium Generale"){
        main.style("background-color", `#${data.color}`)
    } else {
        main.style("background", "linear-gradient(60deg, #ed6741, #ed6741, #ed6741, #666e9e)")
    }  

    const role = main.append("div")
        .attr("class", "dividerRole")
        .html(data.role)
        
    const phrase = main.append("div")
        .attr("class", "dividerPhrase")
        .html(`<i>"${data.sentence}"</i>`)
    
    const QR = main.append("div")
        .attr("class", "dividerQR")
        .style("background-image", `url('./src/res/recommenders/qrs/recommender_${data.id}.png')`)

    const scanLegend = main.append("div")
        .attr("class",'dividerScanLegend')
        .html("Scan the QR code to</br>see the full list")

}