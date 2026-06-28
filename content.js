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
        window.location.href.includes("results?search_query=")
    ){

        filterVideos(interests);
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

            <h1>🎯 Focus Mode</h1>

            <p>
                Home feed is hidden.
            </p>

            <p>
                Search using the YouTube search bar
                or click an interest below.
            </p>

            <div id="focusButtons"></div>

        </div>
    `;

    overlay.style.position = "fixed";
    overlay.style.top = "56px";
    overlay.style.left = "240px";
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

        btn.style.margin = "10px";
        btn.style.padding = "12px 24px";
        btn.style.borderRadius = "20px";
        btn.style.cursor = "pointer";
        btn.style.fontSize = "16px";

        btn.onclick = ()=>{

            window.location.href =
                `https://www.youtube.com/results?search_query=${encodeURIComponent(interest + " tutorial")}`;

        };

        buttons.appendChild(btn);

    });

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

let currentPath = location.pathname;

setInterval(() => {

    if (location.pathname !== currentPath) {

        currentPath = location.pathname;

        chrome.storage.local.get(
            ["focusEnabled", "interests"],
            (result) => {

                if (!result.focusEnabled) return;

                startFocusMode(result.interests || []);

            }
        );

    }

}, 500);