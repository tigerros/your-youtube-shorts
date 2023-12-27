"use strict";

/** @type {string} */
const SHORTS_PATH = "/shorts";
/** @type {string} */
const WATCH_PATH = "/watch";
/** @type {boolean} */
const DEFAULT_SHOULD_REDIRECT_SHORTS = true;
/** @type {boolean} */
const DEFAULT_SHOULD_REMOVE_SHORTS = true;

if (DEFAULT_SHOULD_REMOVE_SHORTS) {
    browser.scripting.registerContentScripts([{
        id: "remove-shorts",
        js: ["remove-shorts.js"],
        matches: ["https://www.youtube.com/"],
    }]).catch(function (err) {
        console.error("[No YouTube Shorts] Failed to register content script that removes shorts. Error: " + err);
    });
}

/**
 * @param {string} url
 * @returns {string | null}
 */
function redirectShorts(url) {
    const urlParsed = new URL(url);

    // If it's a short, redirect to the "watch" URL (regular video player).
    if (urlParsed.pathname.startsWith(SHORTS_PATH)) {
        urlParsed.pathname = WATCH_PATH + urlParsed.pathname.substring(SHORTS_PATH.length);

        return urlParsed.toString();
    } else {
        return null;
    }
}

/**
 * @param {browser.webRequest._OnBeforeSendHeadersDetails} request
 * @returns {browser.webRequest.BlockingResponse | Promise<browser.webRequest.BlockingResponse>}
 */
function interceptShorts(request) {
    // We only want to redirect the shorts if the short is the entire page,
    // rather than redirecting the short previews in the default youtube.com page.
    if (request.type !== "main_frame") {
        return {};
    }

    let shouldRedirectShorts = DEFAULT_SHOULD_REDIRECT_SHORTS;

    return browser.storage.sync.get("redirectShorts").then(
        function (result) {
            if (result.redirectShorts !== undefined) {
                shouldRedirectShorts = result.redirectShorts;
            }

            if (shouldRedirectShorts) {
                const redirected = redirectShorts(request.url);

                if (redirected === null || redirected === request.url) {
                    return {};
                } else {
                    return { redirectUrl: redirected, };
                }
            } else {
                return {};
            }
        },
        function (err) {
            console.error("[No YouTube Shorts] An error occurred when retrieving settings. Not redirecting. Error: " + err);
            return {};
        }
    );
}

browser.webRequest.onBeforeSendHeaders.addListener(
    interceptShorts,
    { urls: ["https://www.youtube.com" + SHORTS_PATH + "/*"] },
    ["blocking", "requestHeaders"]
);