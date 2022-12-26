var readyStateCheckInterval = setInterval(function () {
    if (document.readyState === "complete") {
        clearInterval(readyStateCheckInterval);

        // call events on key press
        window.addEventListener("keydown", handleEvent, false);
        window.addEventListener("click", handleEvent, false);
        function handleEvent(e) {
            const people_invited_count = document.getElementById("xGstLst").children[0].childElementCount;
            const title_value = document.getElementById("xTiIn").value.toLowerCase();
            const guestTab = document.getElementById("xGstTab");
            if ((title_value.includes("<>") || title_value.includes("|") || title_value.includes("sync") || title_value.includes("meeting") || title_value.includes("chat")) && people_invited_count == 0) {
                guestTab.style.backgroundColor = "red";
            }
            else {
                guestTab.style.backgroundColor = "transparent";
            }
        };
    }
}, 10);