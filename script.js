document.getElementById('readmeLink').addEventListener('click', function() {
    fetchContent('https://raw.githubusercontent.com/LifeTimeScriptKiddie/LifeTimeScriptKiddie.github.io/main/README.md', 'mainText');
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
            highlightCodeBlocks();  // Function to highlight code blocks
            console.log(`Fetched and displayed content for: ${textId}`);
        })
        .catch(error => {
            console.error('Error loading content:', error);
            document.getElementById(textId).textContent = 'Error loading content';
        });
}

function highlightCodeBlocks() {
    document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightBlock(block);
    });
}

// Load README.md on page load
document.addEventListener('DOMContentLoaded', function() {
    fetchContent('https://raw.githubusercontent.com/LifeTimeScriptKiddie/LifeTimeScriptKiddie.github.io/main/README.md', 'mainText');
});

