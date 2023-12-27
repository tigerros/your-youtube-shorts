"use strict";

/** @type {number} */
const MAX_REMOVED_SHELVES = 2;

/** @type {HTMLBodyElement} */
const targetNode = document.body;
/** @type {MutationObserverInit} */
const config = { childList: true, subtree: true };

/** @type {number} */
let removedShelvesCount = 0;
/** @type {MutationObserver} */
let observer;

/** @type {MutationCallback} */
const callback = function (mutationsList) {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            const addedNodes = mutation.addedNodes;

            for (const node of addedNodes) {
                if (node.nodeName.toLowerCase() === 'ytd-rich-shelf-renderer') {
                    node.parentElement.removeChild(node);
                    removedShelvesCount += 1;

                    // YouTube loads a ton of stuff and the DOM keeps changing, so disconnect the observer ASAP.
                    // Otherwise, it would slow down the page considerably.
                    // Shorts are only loaded once even if you scroll really far down, so this is okay.
                    if (removedShelvesCount === MAX_REMOVED_SHELVES) {
                        observer.disconnect();
                        break;
                    }
                }
            }
        }
    }
};

observer = new MutationObserver(callback);
observer.observe(targetNode, config);