document.addEventListener("DOMContentLoaded", function() {
    (function() {
        chrome.storage.sync.get("URLs", function(urlsObject) {
            if (urlsObject !== undefined) {
                urlsObject["URLs"].forEach(function(currentUrl) {
                    let li = document.createElement("li");

                    li.innerHTML = `<input type="checkbox"><a href="${currentUrl}" target="_blank">${currentUrl}</a>`;

                    document.getElementById("url-list").appendChild(li);

                    document.querySelector(
                        "#url-list li:last-child input"
                    ).onclick = function() {
                        // выбрать все чекбоксы, проверить их на checked
                        // если хоть один checked то сделать кнопку delete-urls-button доступной
                        // иначе - сделать не доступной

                        let checkboxes = document.querySelectorAll(
                            "#url-list li:last-child input"
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
                alert('No URLs! Please add at least one in "Add URL" menu.');
                return;
            }
        });
    })();

    document.getElementById("delete-urls-button").onclick = function() {
        let checkedBoxes = document.querySelectorAll(
            "#url-list li:last-child input:checked"
        );

        checkedBoxes.forEach(function(currentBox) {
            chrome.storage.sync.get("URLs", function(urlsObject) {
                urlsObject["URLs"] = urlsObject["URLs"].filter(
                    e => e !== currentBox.nextElementSibling.href
                );
                chrome.storage.sync.set(urlsObject);
            });

            currentBox.parentNode.remove();
        });
    };
});
