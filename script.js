// Google API Key and Search Engine ID (Replace with your own)
const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY';
const CX = 'YOUR_SEARCH_ENGINE_ID';

// Option to toggle between Google and DuckDuckGo
let useGoogle = false; // Set to false to use DuckDuckGo instead of Google

async function fetchGoogleResults(query) {
    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}&cx=${CX}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.error('Error fetching Google search results:', error);
        return [];
    }
}

async function fetchDuckDuckGoResults(query) {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.RelatedTopics || [];
    } catch (error) {
        console.error('Error fetching DuckDuckGo search results:', error);
        return [];
    }
}

async function search() {
    const query = document.getElementById("search-input").value;
    const resultsContainer = document.getElementById("results");

    resultsContainer.innerHTML = ''; // Clear previous results
    let results;

    if (useGoogle) {
        results = await fetchGoogleResults(query);
        if (results.length > 0) {
            results.forEach(item => {
                const resultItem = document.createElement("div");
                resultItem.classList.add("result-item");
                resultItem.innerHTML = `<a href="${item.link}" target="_blank">${item.title}</a><p>${item.snippet}</p>`;
                resultsContainer.appendChild(resultItem);
            });
        } else {
            resultsContainer.innerHTML = '<p class="no-results">No results found</p>';
        }
    } else {
        results = await fetchDuckDuckGoResults(query);
        if (results.length > 0) {
            results.forEach(item => {
                if (item.Text && item.FirstURL) {  // DuckDuckGo includes multiple result types
                    const resultItem = document.createElement("div");
                    resultItem.classList.add("result-item");
                    resultItem.innerHTML = `<a href="${item.FirstURL}" target="_blank">${item.Text}</a>`;
                    resultsContainer.appendChild(resultItem);
                }
            });
        } else {
            resultsContainer.innerHTML = '<p class="no-results">No results found</p>';
        }
    }
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        search();
    }
}
