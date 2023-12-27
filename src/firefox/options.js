"use strict";

/** @type {boolean} */
const DEFAULT_SHOULD_REDIRECT_SHORTS = true;
/** @type {boolean} */
const DEFAULT_SHOULD_REMOVE_SHORTS = true;
/** @type {browser.scripting.RegisteredContentScript} */
const REMOVE_SHORTS_CONTENT_SCRIPT = {
    id: "remove-shorts",
    js: ["remove-shorts.js"],
    matches: ["https://www.youtube.com/"],
};

/** @type {HTMLInputElement} */
let redirectShortsCheckbox;
/** @type {HTMLInputElement} */
let removeShortsCheckbox;

function restoreOptions() {
    const redirectShortsGet = browser.storage.sync.get("redirectShorts");

    redirectShortsGet.then(function (result) {
        if (result.redirectShorts === undefined) {
            redirectShortsCheckbox.checked = DEFAULT_SHOULD_REDIRECT_SHORTS;
        } else {
            redirectShortsCheckbox.checked = result.redirectShorts;
        }
    }, function (error) {
        console.error("[No YouTube Shorts] Couldn't restore \"redirectShorts\" option. Error: " + error);
    });

    const removeShortsGet = browser.storage.sync.get("removeShorts");

    removeShortsGet.then(function (result) {
        if (result.removeShorts === undefined) {
            removeShortsCheckbox.checked = DEFAULT_SHOULD_REMOVE_SHORTS;
        } else {
            removeShortsCheckbox.checked = result.removeShorts;
        }
    }, function (error) {
        console.error("[No YouTube Shorts] Couldn't restore \"removeShorts\" option. Error: " + error);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    redirectShortsCheckbox = document.getElementById("redirect-shorts");
    removeShortsCheckbox = document.getElementById("remove-shorts");

    redirectShortsCheckbox.addEventListener("change", function (e) {
        browser.storage.sync.set({
            redirectShorts: e.currentTarget.checked,
        }).catch(function (err) {
            console.error("[No YouTube Shorts] Failed to save \"redirectShorts\" value to storage. Error: " + err);
        });
    });

    removeShortsCheckbox.addEventListener("change", function (e) {
        if (e.currentTarget.checked === true) {
            browser.scripting.registerContentScripts([REMOVE_SHORTS_CONTENT_SCRIPT]).catch(function (err) {
                console.error("[No YouTube Shorts] Failed to register content script that removes shorts. Error: " + err);
            });
        } else if (e.currentTarget.checked === false) {
            browser.scripting.unregisterContentScripts({ids: [REMOVE_SHORTS_CONTENT_SCRIPT.id]}).catch(function (err) {
                console.error("[No YouTube Shorts] Failed to unregister content script that removes shorts. Error: " + err);
            });
        }

        browser.storage.sync.set({
            removeShorts: e.currentTarget.checked,
        }).catch(function (err) {
            console.error("[No YouTube Shorts] Failed to save \"removeShorts\" value to storage. Error: " + err);
        });
    });

    restoreOptions();
});