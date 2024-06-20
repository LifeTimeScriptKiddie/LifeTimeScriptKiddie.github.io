document.getElementById('readmeLink').addEventListener('click', function() {
    fetchContent('https://raw.githubusercontent.com/LifeTimeScriptKiddie/LifeTimeScriptKiddie.github.io/main/README.md', 'mainText');
});
document.getElementById('note1Link').addEventListener('click', function() {
    fetchContent('https://raw.githubusercontent.com/LifeTimeScriptKiddie/LifeTimeScriptKiddie.github.io/main/notes/scanner.md', 'mainText');
});
document.getElementById('note2Link').addEventListener('click', function() {
    fetchContent('https://raw.githubusercontent.com/LifeTimeScriptKiddie/LifeTimeScriptKiddie.github.io/main/notes/SOP%20and%20CORS.md', 'mainText');
});
document.getElementById('note3Link').addEventListener('click', function() {
    fetchContent('https://raw.githubusercontent.com/LifeTimeScriptKiddie/LifeTimeScriptKiddie.github.io/main/Prototype/Reference%20-%20Prototype%20pollution.md', 'mainText');
});

function fetchContent(url, textId) {
    console.log(`Fetching content from: ${url}`);
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById(textId).innerHTML = marked.parse(data);
            console.log(`Fetched and displayed content for: ${textId}`);
        })
        .catch(error => {
            console.error('Error loading content:', error);
            document.getElementById(textId).textContent = 'Error loading content';
        });
}

// Load README.md on page load
document.addEventListener('DOMContentLoaded', function() {
    fetchContent('https://raw.githubusercontent.com/LifeTimeScriptKiddie/LifeTimeScriptKiddie.github.io/main/README.md', 'mainText');
});

