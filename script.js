document.getElementById('githubPageLink').addEventListener('click', function() {
    displayContent('githubPageContent');
});
document.getElementById('note1Link').addEventListener('click', function() {
    fetchContent('https://raw.githubusercontent.com/LifeTimeScriptKiddie/LifeTimeScriptKiddie.github.io/main/notes/scanner.md', 'note1Content', 'note1Text');
});
document.getElementById('note2Link').addEventListener('click', function() {
    fetchContent('https://raw.githubusercontent.com/LifeTimeScriptKiddie/LifeTimeScriptKiddie.github.io/main/notes/SOP%20and%20CORS.md', 'note2Content', 'note2Text');
});

function displayContent(contentId) {
    var contents = document.querySelectorAll('.content-section');
    contents.forEach(function(content) {
        content.style.display = 'none';
    });
    document.getElementById(contentId).style.display = 'block';
    console.log(`Displayed content: ${contentId}`);
}

function fetchContent(url, contentId, textId) {
    console.log(`Fetching content from: ${url}`);
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById(textId).innerHTML = marked(data);
            displayContent(contentId);
            console.log(`Fetched and displayed content for: ${textId}`);
        })
        .catch(error => {
            console.error('Error loading content:', error);
            document.getElementById(textId).textContent = 'Error loading content';
        });
}

// Load README.md on page load
document.addEventListener('DOMContentLoaded', function() {
    fetchContent('https://raw.githubusercontent.com/LifeTimeScriptKiddie/LifeTimeScriptKiddie.github.io/main/README.md', 'note1Content', 'note1Text');
});

