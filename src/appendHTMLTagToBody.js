export default function appendHTMLTagToBody(tag, attributes) {
    return new Promise((resolve, reject) => {
        const el = document.createElement(tag);

        for (const a in attributes) {
            el.setAttribute(a, attributes[a])
        }
        document.body.appendChild(el);
        // success event 
        el.addEventListener("load", () => {
            resolve(el)
        });
        // error event
        el.addEventListener("error", (e) => {
            reject(e)
        });
    })
}

