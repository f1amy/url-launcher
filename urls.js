document.addEventListener("DOMContentLoaded", function() {
    (function() {
        chrome.storage.sync.get("URLs", function(urlsObject) {
            if (
                urlsObject["URLs"] !== undefined &&
                urlsObject["URLs"].length > 0
            ) {
                urlsObject["URLs"].forEach(function(currentUrl) {
                    let li = document.createElement("li");

                    li.innerHTML = `<input type="checkbox"><a href="${currentUrl}" target="_blank">${currentUrl}</a>`;

                    document.getElementById("url-list").appendChild(li);

                    document.querySelector(
                        "#url-list li:last-child input"
                    ).onclick = function() {
                        let checkboxes = document.querySelectorAll(
                            "#url-list li input"
                        );

                        let oneChecked = false;

                        for (let i = 0; i < checkboxes.length; i++) {
                            if (checkboxes[i].checked === true) {
                                oneChecked = true;
                            }
                        }

                        if (oneChecked) {
                            document.getElementById(
                                "delete-urls-button"
                            ).disabled = false;
                        } else {
                            document.getElementById(
                                "delete-urls-button"
                            ).disabled = true;
                        }
                    };
                });
            } else {
                setTimeout(function() {
                    alert(
                        'No URLs! Please add at least one in "Add URL" menu.'
                    );
                }, 250);
                return;
            }
        });
    })();

    document.getElementById("delete-urls-button").onclick = function() {
        let checkedBoxes = document.querySelectorAll(
            "#url-list li input:checked"
        );

        checkedBoxes.forEach(function(currentBox) {
            chrome.storage.sync.get("URLs", function(urlsObject) {
                urlsObject["URLs"].splice(
                    urlsObject["URLs"].indexOf(
                        currentBox.nextElementSibling.href
                    ),
                    1
                );
                chrome.storage.sync.set(urlsObject);
            });

            currentBox.parentNode.remove();

            let checkboxes = document.querySelectorAll("#url-list li input");

            let oneChecked = false;

            for (let i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked === true) {
                    oneChecked = true;
                }
            }

            if (oneChecked) {
                document.getElementById("delete-urls-button").disabled = false;
            } else {
                document.getElementById("delete-urls-button").disabled = true;
            }
        });
    };
});
