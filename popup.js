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

function addInterest() {

    const value = input.value.trim();

    if (value === "") return;

    const chip = document.createElement("span");

    chip.classList.add("chip");
    chip.innerText = value;

    container.appendChild(chip);

    input.value = "";

    // Hide input and save button
    editor.style.display = "none";
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