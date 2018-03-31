document.addEventListener("DOMContentLoaded", function() {
    /*
    document.getElementById('add-current-tab-url').onclick = function () {
        //chrome.storage;
    }
    */
    document.getElementById("add-url").onclick = function() {
        // do we need a check for good url?
        // need checking for repetitions

        let url = document.getElementById("url").value;

        chrome.storage.sync.get("URLs", function(urlsObject) {
            if (urlsObject !== undefined) {
                if (urlsObject["URLs"].indexOf(url) === -1) {
                    urlsObject["URLs"].push(url);
                } else {
                    alert("URL already added!");
                }
            } else {
                urlsObject = {
                    URLs: [url]
                };
            }

            chrome.storage.sync.set(urlsObject);
        });
    };
});
