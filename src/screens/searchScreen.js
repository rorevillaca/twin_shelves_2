import { backButton } from "../components/backButton.js"

export function initSearchScreen() {    
    backButton("#search-screen-header")
    
    d3
        .select(".search_container")
        .on('click',function() {
            console.log("AAAA")
            d3.select(".search-screen").style("display", "grid");
        })

    d3
        .select(".searchButton")
        .on('click',function() {
            search()
        })
}


function search() {
    const query = d3.select('.searchInput').property('value'); // Use property to get the value of an input field
            
    fetch('http://127.0.0.1:5000/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query })
    })
    .then(response => response.json())
    .then(data => {
        const results = d3.select('.keyboard_container').node(); // Get the underlying DOM node
        results.innerHTML = ''; // Clear previous results
        data.results.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            results.appendChild(li);
        });
    })
    .catch(error => console.error('Error:', error));
}