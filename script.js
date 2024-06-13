const repoOwner = 'LifeTimeScriptKiddie';
const repoName = 'LifeTimeScriptKiddie.github.io';
const branch = 'main';

async function fetchFiles() {
    const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/git/trees/${branch}?recursive=1`);
    const data = await response.json();
    return data.tree.filter(file => file.path.endsWith('.js')); // Adjust the file extension as needed
}

async function fetchFileContent(url) {
    const response = await fetch(url);
    return response.text();
}

async function searchScripts() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    const files = await fetchFiles();
    for (const file of files) {
        const content = await fetchFileContent(file.url);
        if (content.toLowerCase().includes(searchTerm)) {
            const highlightedContent = content.replace(new RegExp(searchTerm, 'gi'), match => `<mark>${match}</mark>`);
            resultsDiv.innerHTML += `<pre>${highlightedContent}</pre>`;
        }
    }
}


