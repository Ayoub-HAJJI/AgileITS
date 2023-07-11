/* global chrome */
document.addEventListener('DOMContentLoaded', function() {
  var redirectButton = document.getElementById('redirect-button');
  redirectButton.addEventListener('click', function() {
    // Ouvrir le lien dans une nouvelle fenêtre
    chrome.tabs.create({ url: 'http://localhost:3000/projects' });
  });
});

  