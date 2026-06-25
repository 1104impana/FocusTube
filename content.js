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

    const currentURL =
        window.location.href;

    const searchQuery =
        interests.join(" ") + " tutorial";

    if(
        currentURL.includes("results?search_query=")
    ){

        filterVideos(interests);

        return;
    }

    window.location.href =
        `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;

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