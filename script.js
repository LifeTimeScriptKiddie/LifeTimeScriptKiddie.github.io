document.getElementById('githubPageLink').addEventListener('click', function() {
    displayContent('githubPageContent');
});
document.getElementById('note1Link').addEventListener('click', function() {
    fetchContent('https://raw.githubusercontent.com/LifeTimeScriptKiddie/LifeTimeScriptKiddie.github.io/main/scanner.py', 'note1Content', 'note1Text');
});
document.getElementById('note2Link').addEventListener('click', function() {
    fetchContent('https://raw.githubusercontent.com/LifeTimeScriptKiddie/LifeTimeScriptKiddie.github.io/main/scanner.py', 'note2Content', 'note2Text');
});

function displayContent(contentId) {
    var contents = document.querySelectorAll('.content-section');
    contents.forEach(function(content) {
        content.style.display = 'none';
    });
    document.getElementById(contentId).style.display = 'block';
}

function fetchContent(url, contentId, textId) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(textId).innerHTML = `<code>${data}</code>`;
            displayContent(contentId);
        })
        .catch(error => {
            document.getElementById(textId).textContent = 'Error loading content';
        });
}

// Load README.md on page load
document.addEventListener('DOMContentLoaded', function() {
    fetchContent('https://raw.githubusercontent.com/LifeTimeScriptKiddie/LifeTimeScriptKiddie.github.io/main/README.md', 'note1Content', 'note1Text');
});

