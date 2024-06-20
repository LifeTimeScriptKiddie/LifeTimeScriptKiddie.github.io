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
            const parsedContent = marked.parse(data);
            const adjustedContent = adjustImagePaths(parsedContent);
            document.getElementById(textId).innerHTML = adjustedContent;
            highlightCodeBlocks();
            console.log(`Fetched and displayed content for: ${textId}`);
        })
        .catch(error => {
            console.error('Error loading content:', error);
            document.getElementById(textId).textContent = 'Error loading content';
        });
}

function adjustImagePaths(content) {
    const baseUrl = 'https://raw.githubusercontent.com/LifeTimeScriptKiddie/LifeTimeScriptKiddie.github.io/main/notes/';
    return content.replace(/!\[(.*?)\]\((.*?)\)/g, (match, p1, p2) => {
        const adjustedPath = baseUrl + p2;
        return `![${p1}](${adjustedPath})`;
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

