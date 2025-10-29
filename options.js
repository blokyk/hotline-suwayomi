function reportFormError(msg) {
    let errorEl = document.querySelector("#form_err");

    if (errorEl == null) {
        errorEl = document.createElement("p");
        errorEl.style = "color: red";
        errorEl.id = "form_err";

        let formEl = document.querySelector("form");
        formEl.append(errorEl);
    }

    errorEl.textContent = msg;
}

function cleanError() {
    document.querySelector("#form_err")?.remove();
}

async function saveOptions(e) {
    e.preventDefault();

    let rawUrl = document.querySelector("#suwayomi_url").value;
    let url = URL.parse(rawUrl);

    if (url == null) {
        reportFormError("Not a valid URL. Make sure it starts with 'http://' or similar.");
        return;
    }

    await browser.storage.sync.set({
        suwayomi_url: url.toString()
    });

    cleanError();
    console.log("Saved preferences");
}

async function restoreOptions() {
    res = await browser.storage.sync.get('suwayomi_url');
    document.querySelector("#suwayomi_url").value = res.suwayomi_url || 'https://example.org/suwayomi';
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);