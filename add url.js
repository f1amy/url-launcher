document.addEventListener("DOMContentLoaded", function() {
    /*
    document.getElementById('add-current-tab-url').onclick = function () {
        //chrome.storage;
    }
    */
    document.getElementById("add-url").onclick = function() {
        // do we need a check for good url?

        let url = document.getElementById("url").value;

        chrome.storage.sync.get("URLs", function(urlsObject) {
            if (urlsObject["URLs"] !== undefined) {
                if (urlsObject["URLs"].indexOf(url) === -1) {
                    urlsObject["URLs"].push(url);
                    alert('Your URL has been added!');
                } else {
                    alert("URL has already been added!");
                    return;
                }
            } else {
                urlsObject = {
                    URLs: [url]
                };
            }

            chrome.storage.sync.set(urlsObject);

            document.getElementById('url').value = "https://";
        });
    };
});
