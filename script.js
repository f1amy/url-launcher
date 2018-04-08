"use strict";

document.addEventListener("DOMContentLoaded", function() {
    // main-page.js

    document.getElementById("add-url-button").onclick = function() {
        clearAlerts();
        document.getElementById("main-page").style.display = "none";
        document.getElementById("add-url-page").style.display = "block";
    };

    document.getElementById("urls-button").onclick = function() {
        clearAlerts();
        document.getElementById("main-page").style.display = "none";
        document.getElementById("urls-page").style.display = "block";

        chrome.storage.sync.get("URLs", function(urlsObject) {
            if (
                urlsObject["URLs"] !== undefined &&
                urlsObject["URLs"].length > 0
            ) {
                // TODO: ^ check, refactor
                for (const currentUrl of urlsObject["URLs"]) {
                    if (
                        Array.from(
                            document.querySelectorAll(
                                "#urls-page #url-list li a"
                            )
                        ).every(a => a.href !== currentUrl)
                    ) {
                        let li = document.createElement("li");

                        li.innerHTML =
                            '<label><input type="checkbox">' +
                            `<a href="${currentUrl}" target="_blank">` +
                            `${currentUrl}</a> (click)</label>`;

                        document.getElementById("url-list").appendChild(li);

                        document.querySelector(
                            "#urls-page #url-list li:last-child input"
                        ).onclick = toggleDeleteButton;
                    }
                }
            } else {
                createAlert(
                    'No URLs! Please add at least one in "Add URL" menu.',
                    alertTypeEnum.WARNING
                );
                return;
            }
        });

        toggleDeleteButton();
    };

    document.getElementById("open-urls-button").onclick = function() {
        chrome.storage.sync.get("URLs", function(urlsObject) {
            if (
                urlsObject["URLs"] !== undefined &&
                urlsObject["URLs"].length > 0
            ) {
                // TODO: refactor ^
                for (const currentUrl of urlsObject["URLs"]) {
                    chrome.tabs.create({ url: currentUrl });
                }
            } else {
                createAlert(
                    'No URLs! Please add at least one in "Add URL" menu.',
                    alertTypeEnum.DANGER
                );
                return;
            }
        });
    };

    // add-url-page.js

    Array.from(document.getElementsByClassName("back-button")).forEach(function(
        button
    ) {
        button.onclick = function() {
            clearAlerts();
            getActivePage().style.display = "none";
            document.getElementById("main-page").style.display = "block";
        };
    });

    function addUrl(urlString) {
        let url;

        if (
            !urlString.startsWith("http://") &&
            !urlString.startsWith("https://")
        ) {
            urlString = `http://${urlString}`;
        }

        try {
            url = new URL(urlString);
        } catch (DOMException) {
            createAlert("Not valid URL!", alertTypeEnum.DANGER);
            return false;
        }

        chrome.storage.sync.get("URLs", function(urlsObject) {
            if (
                urlsObject["URLs"] !== undefined &&
                urlsObject["URLs"].length > 0
            ) {
                // TODO: refactor ^
                if (urlsObject["URLs"].indexOf(url.href) === -1) {
                    urlsObject["URLs"].push(url.href);
                    createAlert(
                        "URL was successfully added!",
                        alertTypeEnum.SUCCESS
                    );
                } else {
                    createAlert(
                        "URL has already been added!",
                        alertTypeEnum.DANGER
                    );
                    return;
                }
            } else {
                urlsObject = {
                    URLs: [url.href]
                };
            }

            chrome.storage.sync.set(urlsObject);
        });

        return true;
    }

    document.getElementById("add-url").onclick = function() {
        let urlInput = document.getElementById("url");

        if (addUrl(urlInput.value)) {
            urlInput.value = "";
        }
    };

    document.getElementById("add-current-tab-url").onclick = function() {
        chrome.tabs.query({ currentWindow: true, active: true }, function(
            tabs
        ) {
            addUrl(tabs[0].url);
        });
    };

    document.getElementById("url").onkeyup = function(event) {
        if (event.keyCode === 13) {
            document.getElementById("add-url").click();
        }
    };

    // urls-page.js

    function toggleDeleteButton() {
        const checkboxes = Array.from(
            document.querySelectorAll(
                "#urls-page #url-list li input[type='checkbox']"
            )
        );

        let deleteUrlsButton = document.getElementById("delete-urls-button");

        if (checkboxes.length > 0) {
            deleteUrlsButton.disabled = checkboxes.some(
                checkbox => checkbox.checked === true
            )
                ? false
                : true;
        } else {
            deleteUrlsButton.disabled = true;
        }
    }

    document.getElementById("delete-urls-button").onclick = function() {
        chrome.storage.sync.get("URLs", function(urlsObject) {
            const checkedBoxes = document.querySelectorAll(
                "#urls-page #url-list li input:checked"
            );

            for (const currentBox of checkedBoxes) {
                urlsObject["URLs"].splice(
                    urlsObject["URLs"].indexOf(
                        currentBox.nextElementSibling.href
                    ),
                    1
                );

                currentBox.parentNode.parentNode.remove();
            }

            chrome.storage.sync.set(urlsObject);

            toggleDeleteButton();

            createAlert(
                "URLs have been successfully deleted!",
                alertTypeEnum.SUCCESS
            );
        });
    };

    document.getElementById("select-all").onclick = function() {
        const checkboxes = document.querySelectorAll(
            "#urls-page #url-list li input[type='checkbox']"
        );

        /* Array.from(
            document.querySelectorAll(
                "#urls-page #url-list li input[type='checkbox']"
            )
        ).forEach(checkbox => (checkbox.checked = true)); */

        if (checkboxes.length > 0) {
            for (let checkbox of checkboxes) {
                checkbox.checked = true;
            }

            document.getElementById("delete-urls-button").disabled = false;
        } else {
            createAlert("There are no URLs to select!", alertTypeEnum.DANGER);
        }
    };

    const alertTypeEnum = Object.freeze({
        WARNING: 0,
        DANGER: 1,
        SUCCESS: 2
    });

    function createAlert(alertText, alertType) {
        let alert = document.createElement("div");

        switch (alertType) {
            case alertTypeEnum.WARNING:
                alert.className = "alert alert-warning";
                break;
            case alertTypeEnum.DANGER:
                alert.className = "alert alert-danger";
                break;
            case alertTypeEnum.SUCCESS:
                alert.className = "alert alert-success";
                break;
            default:
                alert.className = "alert";
                break;
        }

        alert.innerHTML =
            `<span class='alert-text'>${alertText}</span>` +
            '<span class="delete-alert-button">&times;</span>';

        alert.querySelector(".delete-alert-button").onclick = function() {
            this.parentElement.style.opacity = 0;
            setTimeout(function() {
                alert.remove();
            }, 600);
        };

        alert.onmouseover = function() {
            clearTimeout(alert.timeOutToVanish);
        };

        alert.onmouseout = function() {
            alert.timeOutToVanish = setTimeout(function() {
                alert.style.opacity = 0;
                setTimeout(function() {
                    alert.remove();
                }, 600);
            }, 5000);
        };

        getActivePage()
            .querySelector(".alert-list")
            .appendChild(alert);

        alert.timeOutToVanish = setTimeout(function() {
            alert.style.opacity = 0;
            setTimeout(function() {
                alert.remove();
            }, 600);
        }, 5000);
    }

    function clearAlerts() {
        getActivePage().querySelector(".alert-list").innerHTML = "";
    }

    function getActivePage() {
        return Array.from(document.getElementsByClassName("page")).filter(
            div => div.style.display === "block"
        )[0];
    }
});
