//add interests functionality
const editBtn = document.getElementById("editBtn");
const editor = document.getElementById("editor");
const saveBtn = document.getElementById("saveBtn");
const container = document.getElementById("interestContainer");
const input = document.getElementById("interestInput");

editBtn.addEventListener("click", () => {

    editor.style.display = "flex";

    container.classList.toggle("editing");

    input.focus();

});


function createChip(interest){

    const chip = document.createElement("span");

    chip.classList.add("chip");

    chip.innerHTML = `
        ${interest}
        <span class="delete-chip">×</span>
    `;

    const deleteBtn =
        chip.querySelector(".delete-chip");

    deleteBtn.addEventListener("click", () => {

        chrome.storage.local.get(
            ["interests"],
            (result) => {

                let interests =
                    result.interests || [];

                interests =
                    interests.filter(
                        item =>
                        item !== interest.toLowerCase()
                    );

                chrome.storage.local.set({
                    interests: interests
                });

                chip.remove();
            }
        );

    });

    container.appendChild(chip);
}



function addInterest() {

    const value = input.value.trim();

    if (value === "") return;

    createChip(value);

    chrome.storage.local.get(["interests"],(result)=>{

        const interests = result.interests||[];

       const newInterests = value.toLowerCase();
       if(!interests.includes(newInterests)){
        interests.push(newInterests);
       }

        chrome.storage.local.set({
            interests: interests
        });

        console.log("Saved:", interests);
    });

    input.value = "";

    // Hide input and save button
    editor.style.display = "none";
    container.classList.remove("editing");
}

saveBtn.addEventListener("click", addInterest);

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        addInterest();
    }
});


//active and inactive status of focus mode
const focusToggle = document.getElementById("focusToggle");
const status = document.getElementById("status");

focusToggle.addEventListener("change", () => {

    const enabled = focusToggle.checked;

    chrome.storage.local.set({
        focusEnabled: enabled
    }, () => {

        status.innerHTML =
            enabled ? "● Active" : "● Inactive";

        status.style.color =
            enabled ? "#ef4444" : "gray";

        chrome.tabs.query(
            {
                active: true,
                currentWindow: true
            },
            (tabs) => {

                if (
                    tabs.length &&
                    tabs[0].url.includes("youtube.com")
                ) {

                    chrome.tabs.reload(tabs[0].id);

                }

            }
        );

    });

});
//focus and checklist
const tabs = document.querySelectorAll(".tab");

tabs.forEach(tab => {
    tab.addEventListener("click", () => {

        tabs.forEach(t =>
            t.classList.remove("active")
        );

        tab.classList.add("active");
    });
});

chrome.storage.local.get(["interests"], (result) => {

    const interests = result.interests || [];

    interests.forEach((interest) => {
    createChip(interest);
});

});

chrome.storage.local.get(
    ["focusEnabled"],
    (result) => {

        const enabled =
            result.focusEnabled || false;

        focusToggle.checked = enabled;

        status.innerHTML =
            enabled ? "● Active" : "● Inactive";

        status.style.color =
            enabled ? "#ef4444" : "gray";
    }
);