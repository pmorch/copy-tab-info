// This page is "heavily inspired" by
// https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/functional-samples/cookbook.offscreen-clipboard-write/offscreen.js
// Copyright 2023 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//

// Once the message has been posted from the service worker, checks are made to
// confirm the message type and target before proceeding. This is so that the
// module can easily be adapted into existing workflows where secondary uses for
// the document (or alternate offscreen documents) might be implemented.

// Registering this listener when the script is first executed ensures that the
// offscreen document will be able to receive messages when the promise returned
// by `offscreen.createDocument()` resolves.
chrome.runtime.onMessage.addListener(handleMessages);

// This function performs basic filtering and error checking on messages before
// dispatching the
// message to a more specific message handler.
async function handleMessages(message) {
    // Return early if this message isn't meant for the offscreen document.
    if (message.target !== 'offscreen-doc') {
        return;
    }

    // Dispatch the message to an appropriate handler.
    switch (message.type) {
        case 'copy-data-to-clipboard':
            handleClipboardWrite(message.data);
            break;
        default:
            console.warn(`Unexpected message type received: '${message.type}'.`);
    }
}

// We use a <textarea> element for two main reasons:
//  1. preserve the formatting of multiline text,
//  2. select the node's content using this element's `.select()` method.
const textEl = document.querySelector('#text');

function copyToClipboard(text, HTML) {
    // const textArea = document.createElement('textarea');
    const textArea = textEl;
    textArea.addEventListener('copy', function (e) {
        e.clipboardData.setData('text/plain', text);
        if (HTML) e.clipboardData.setData('text/html', HTML);
        e.preventDefault();
    }, {
        once: true
    });
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    // document.body.removeChild(textArea);
    // console.log(`Copyied to clipboard: ${text}, ${html}`);
}

// Use the offscreen document's `document` interface to write a new value to the
// system clipboard.
//
// At the time this demo was created (Jan 2023) the `navigator.clipboard` API
// requires that the window is focused, but offscreen documents cannot be
// focused. As such, we have to fall back to `document.execCommand()`.
async function handleClipboardWrite(data) {
    try {
        // Error if we received the wrong kind of data.
        if (typeof data !== 'object') {
            throw new TypeError(
                `data must be an 'object', got '${typeof data}'.`
            );
        }
        if (typeof data.text !== 'string') {
            throw new TypeError(
                `data.text must a 'string', got '${typeof data}'.`
            );
        }
        if (typeof data.HTML !== 'undefined' && typeof data.HTML !== 'string') {
            throw new TypeError(
                `data.html must be undef or a 'string', got '${typeof data}'.`
            );
        }
        copyToClipboard(data.text, data.HTML);
    } finally {
        // Job's done! Close the offscreen document.
        window.close();
    }
}