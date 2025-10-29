let url = window.location;
let segments = url.pathname.split('/');
segments.shift(); // remove first empty element
let pageType = segments.at(0);

// if this is the "recently added page" (https://dynasty-scans.com/chapters/added)
if (segments.length == 2 && segments[0] == "chapters" && segments[1] == "added") {
    pageType = "recently-added";
}

function UnsupportedPageType(type) {
    return `Can't get Suwayomi link for the page '${window.location}': page type '${type}' not supported`;
}

function getSuwayomiLink(instanceUrl) {
    function deeplink(type, name) {
        let url = new URL(`/sources/all/search`, instanceUrl);
        url.searchParams.append("query", `deeplink:${type}:${name}`);
        return url;
    }

    switch (pageType) {
        case "issues":
        case "series":
        case "doujins":
        case "chapters":
        case "anthologies":
            return deeplink(pageType, segments.at(1));
        case "recently-added":
            return new URL("/sources/669095474988166464", instanceUrl);
        default:
            throw UnsupportedPageType(pageType);
    }
    throw UnsupportedPageType(pageType);
}

function getTitleElement() {
    switch (pageType) {
        case "issues":
        case "series":
        case "anthologies":
            return document.querySelector("h2.tag-title");
        case "doujins":
            return document.querySelector("h2");
        case "chapters":
            return document.querySelector("#chapter-title");
        case "recently-added":
            return document.querySelector("h2");
        default:
            throw UnsupportedPageType(pageType);
    }
}

async function addSuwayomiLinkElement() {
    let instanceUrl = URL.parse((await browser.storage.sync.get("suwayomi_url"))?.suwayomi_url);
    if (instanceUrl == null) {
        // todo: make this into a pop up/alert (when the button is clicked)
        throw "Please set the suwayomi instance URL in the add-on extension";
    }

    let link = getSuwayomiLink(instanceUrl);

    let titleElement = getTitleElement();

    var linkElement = document.createElement("a");
    linkElement.href = link.href;
    linkElement.textContent = "Open in Suwayomi";

    titleElement.after(linkElement);
};

addSuwayomiLinkElement();
