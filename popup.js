document.addEventListener("DOMContentLoaded", function() {
    /*
    document.getElementById('add-current-tab-url').onclick = function () {
        chrome.storage;

    }
    */
    document.getElementById("add-url").onclick = function() {
        // do we need check for good url?

        let url = document.getElementById("url").value;

        console.log(url);

        //let urls = chrome.storage.sync.get(["URLs"], function(result) {});

        chrome.storage.sync.get("URLs", function(object) {
            let urls = object["URLs"];

            console.log(urls);

            if (urls !== undefined) {
                urls.push(url);
                
                urls = {
                    URLs: urls
                }
            } else {
                urls = {
                    URLs: [url]
                };
            }

            chrome.storage.sync.set(urls);
        });
    };
});
