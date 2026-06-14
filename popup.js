//add interests functionality
const editBtn = document.getElementById("editBtn");
const editor = document.getElementById("editor");
const saveBtn = document.getElementById("saveBtn");
const container = document.getElementById("interestContainer");
const input = document.getElementById("interestInput");

editBtn.addEventListener("click", () => {
    editor.style.display = "block";
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

    const chip = document.createElement("span");

    createChip(value);
    container.appendChild(chip);

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
    if(focusToggle.checked){
        status.innerHTML="● Active";
        status.style.color="#ef4444";

    }
    else{
        status.innerHTML="● Inactive";
        status.style.color="gray";
    }
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

editBtn.addEventListener("click", () => {

    editor.style.display = "flex";

    container.classList.toggle("editing");

    input.focus();

});