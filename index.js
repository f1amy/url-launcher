document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("open-urls-button").onclick = function() {
        chrome.storage.sync.get("URLs", function(urlsObject) {
            if (urlsObject !== undefined) {
                urlsObject["URLs"].forEach(function(currentUrl) {
                    chrome.tabs.create({url: currentUrl});
                });
            } else {
                alert('No URLs! Please add at least one in "Add URL" menu.');
                return;
            }
        });
    };
});
