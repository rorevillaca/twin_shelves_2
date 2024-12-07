import { backButton } from "../components/backButton.js"

export function initSearchScreen() {    
    backButton("#search-screen-header")
    d3
        .select(".search_container")
        .on('click',function() {
            console.log("AAAA")
            d3.select(".search-screen").style("display", "grid");
        })
}