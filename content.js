console.log("FocusTube Loaded");

chrome.storage.local.get(
    ["focusEnabled","interests"],
    (result)=>{

        const enabled =
            result.focusEnabled || false;

        const interests =
            result.interests || [];

        if(!enabled) return;

        if(interests.length===0) return;

        showNotification("FocusTube Active");

        startFocusMode(interests);

    

        

    }
);

function showNotification(message) {

    if (
        document.getElementById(
            "focusTubeBanner"
        )
    ) return;

    const banner =
        document.createElement("div");

    banner.id = "focusTubeBanner";

    banner.innerText = message;

    banner.style.position = "fixed";
    banner.style.top = "20px";
    banner.style.right = "20px";
    banner.style.zIndex = "99999";
    banner.style.padding = "12px";
    banner.style.background = "#ef4444";
    banner.style.color = "white";
    banner.style.borderRadius = "8px";
    banner.style.fontWeight = "600";

    document.body.appendChild(banner);

    setTimeout(() => {

        banner.remove();

    }, 3000);

}

function startFocusMode(interests){

    document.getElementById("focusTubeOverlay")?.remove();
    document.getElementById("focusSearchOverlay")?.remove();

    hideShorts();
    hideRecommendations();
    hideComments();

    // HOME PAGE
    if(
        window.location.pathname === "/" ||
        window.location.pathname === ""
    ){

       setTimeout(() => {

        hideHomeFeed();
        showHomeOverlay(interests);

        }, 300);

        return;
    }

// SEARCH PAGE
if(
    window.location.href.includes(
        "results?search_query="
    )
){

    const query =
        getSearchQuery();

    const allowed =
        interests.some(interest=>

            query.includes(
                interest.toLowerCase()
            )

        );

    if(allowed){

        filterVideos(interests);

    }
    else{

        hideSearchResults();

        blockSearchOverlay(
            interests,
            query
        );

    }

    return;

}


    // WATCH PAGE
    if(
        window.location.href.includes("watch?v=")
    ){

        hideRecommendations();
        hideComments();

    }

}

function hideShorts(){

    document.querySelectorAll(
        "ytd-reel-shelf-renderer, ytd-rich-shelf-renderer"
    ).forEach(section => {

        section.remove();

    });

}

function hideRecommendations(){

    const secondary =
        document.querySelector("#secondary");

    if(secondary){

        secondary.style.display = "none";

    }

}

function hideComments(){

    const comments =
        document.querySelector("ytd-comments");

    if(comments){

        comments.style.display = "none";

    }

}

function hideHomeFeed(){

    const feed =
        document.querySelector(
            "ytd-rich-grid-renderer"
        );

    if(feed){

        feed.style.display = "none";

    }

}

function showHomeOverlay(interests){

    const oldOverlay =
    document.getElementById("focusTubeOverlay");

    if(oldOverlay){

    oldOverlay.remove();

}

    const overlay =
        document.createElement("div");

    overlay.id = "focusTubeOverlay";

    overlay.innerHTML = `
<div id="focusBox">

    

    <h1 style="margin-top:10px; font-size:28px;">
        Focus Mode
    </h1>
    <br>


    <p style="opacity:.85;font-style:italic; font-size:12px;">
        Your YouTube home feed is hidden.
    </p>
    <br>

    <p style="opacity:.65; font-size:12px;">
        Pick an interest or use the search bar.
    </p>

    <div id="focusButtons"></div>

</div>
`;
    overlay.style.position = "fixed";
    overlay.style.top = "56px";          /* YouTube header */
    overlay.style.left = "240px";        /* Expanded sidebar */
    overlay.style.width = "calc(100vw - 240px)";
    overlay.style.height = "calc(100vh - 56px)";
   
    overlay.style.right = "0";
    overlay.style.bottom = "0";
    overlay.style.background = "#0f0f0f";
    overlay.style.zIndex = "999999";

    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";

    document.body.appendChild(overlay);

    const box =
        document.getElementById("focusBox");

    box.style.textAlign = "center";
    box.style.color = "white";
    box.style.fontFamily = "Arial";

    const buttons =
        document.getElementById("focusButtons");

    interests.forEach(interest=>{

        const btn =
            document.createElement("button");

        btn.innerText = interest;

        buttons.style.marginTop = "30px";

buttons.style.display = "flex";

buttons.style.flexWrap = "wrap";

buttons.style.justifyContent = "center";

buttons.style.gap = "12px";

btn.style.padding = "12px 22px";

btn.style.border = "1px solid #880b0b";

btn.style.borderRadius = "999px";

btn.style.background = "#3ea5ff00";

btn.style.color = "white";

btn.style.fontWeight = "600";

btn.style.cursor = "pointer";

btn.style.transition =
"all .25s";

btn.onmouseenter = () => {
    btn.style.background = "#000000";
    btn.style.transform = "scale(1.05)";
};

btn.onmouseleave = () => {
    btn.style.background = "#191a1b";
    btn.style.transform = "scale(1)";
};

        btn.onclick = ()=>{

            window.location.href =
                `https://www.youtube.com/results?search_query=${encodeURIComponent(interest + " tutorial")}`;

        };

        buttons.appendChild(btn);

    });

}

function getSearchQuery(){

    const params =
        new URLSearchParams(
            window.location.search
        );

    return (
        params.get("search_query") || ""
    ).toLowerCase();

}

function hideSearchResults(){

    const results =
        document.querySelector(
            "ytd-two-column-search-results-renderer"
        );

    if(results){

        results.style.display = "none";

    }

}

function blockSearchOverlay(interests,query){

    if(
        document.getElementById(
            "focusSearchOverlay"
        )
    ) return;

    const overlay =
        document.createElement("div");

    overlay.id =
        "focusSearchOverlay";

    overlay.style.position="fixed";
    overlay.style.top="56px";
    overlay.style.left="0";
    overlay.style.right="0";
    overlay.style.bottom="0";
    overlay.style.background="#0f0f0f";
    overlay.style.zIndex="999999";

    overlay.style.display="flex";
    overlay.style.justifyContent="center";
    overlay.style.alignItems="center";

    overlay.innerHTML=`

        <div style="
            width:500px;
            padding:35px;
            background:#1f1f1f;
            border-radius:18px;
            text-align:center;
            color:white;
        ">

            <h2>
                🚫 Stay Focused
            </h2>

            <p style="margin-top:15px;">

                "${query}"

                isn't one of your interests.

            </p>

            <div
                id="interestBtns"
                style="margin-top:20px;"
            ></div>

            <button
                id="disableBtn"
                style="
                    margin-top:25px;
                    padding:10px 22px;
                    cursor:pointer;
                "
            >

                Turn Off Focus Mode

            </button>

        </div>

    `;

    document.body.appendChild(
        overlay
    );

    const container=
        document.getElementById(
            "interestBtns"
        );

    interests.forEach(interest=>{

        const btn=
            document.createElement(
                "button"
            );

        btn.innerText=interest;

        btn.style.margin="8px";
        btn.style.padding="10px 18px";

        btn.onclick=()=>{

            window.location.href=
            `https://www.youtube.com/results?search_query=${interest}`;

        };

        container.appendChild(btn);

    });

    document
    .getElementById("disableBtn")
    .onclick=()=>{

        chrome.storage.local.set({

            focusEnabled:false

        },()=>{

            location.reload();

        });

    };

}





function filterVideos(interests) {

    const videos = document.querySelectorAll(
        "ytd-rich-item-renderer, ytd-video-renderer"
    );

    console.log(
        "Videos Found:",
        videos.length
    );

    videos.forEach(video => {

        const title =
        video.querySelector("#video-title")
            ?.innerText
            ?.toLowerCase() || "";

        const match =
            interests.some(
                interest =>
                title.includes(
                    interest.toLowerCase()
                )
            );

        if (match) {

            video.style.display = "";

        } else {

            video.remove();

        }

    });

}

let lastPath = location.pathname;

document.addEventListener("yt-navigate-finish", () => {

    if (location.pathname === lastPath) return;

    lastPath = location.pathname;

    chrome.storage.local.get(
        ["focusEnabled", "interests"],
        (result) => {

            if (!result.focusEnabled) return;

            startFocusMode(result.interests || []);

        }
    );

});