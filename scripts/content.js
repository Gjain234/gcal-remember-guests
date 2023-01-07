const MEETING_CHECKS = ['<>', '|', 'sync', 'chat', ':', 'meeting'] //identifiers of a meeting
errorMsgContainer = document.createElement('div')
errorMsgContainer.className = 'reminder-error'

// text bit
errorMsg = document.createElement('span')
errorMsg.innerText = 'Remember to include other people when scheduling a meeting.'

// icon
errorIcon = document.createElement('i')
errorIcon.innerText = 'warning'
errorIcon.className = 'google-material-icons meh4fc hggPq GyffFb'

// appending the icon and text to the main error container
errorMsgContainer.appendChild(errorIcon)
errorMsgContainer.appendChild(errorMsg)

// hiding the error to start with
errorMsgContainer.style.display = 'none'
errorMsgContainer.style.opacity = 0

// re-perform meeting check on the event every time event is edited
var observer = new MutationObserver(function(mutations, observer) {
    for (var i = 0; i < mutations.length; i++) {
        if (mutations[i].addedNodes.length>0 && (mutations[i].target.innerHTML.includes("Add title") || mutations[i].target.innerHTML.includes("Title"))){
            isEventPage = document.URL.includes("eventedit");
            isEventPage ? initializeEventEditPage() : initializeEventEditDialog()
            handleEventEdit();
            if (eventNameInput!=null){
                eventNameInput.oninput = handleEventEdit;
            }
        }
        if (mutations[i]?.target?.ariaLabel == "Guests invited to this event."){
            handleEventEdit();
       }
    }
});
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// check if current event should have guests or not, and add error message if guests are needed.
function handleEventEdit() {
    //check if the meeting name has any of the signals that it is not a single person meeting
    eventNameInput = isEventPage ? document.querySelector('[aria-label="Title"]') : document.querySelector('[aria-label="Add title"]');
    if (eventNameInput==null){
        return;
    }
    isMeetingWithSomeone = MEETING_CHECKS.some(identifier => eventNameInput.value.toLowerCase().includes(identifier));
    guestList = document.querySelector('[aria-label="Guests invited to this event."]');
    peopleInvitedCount = guestList?.childElementCount;
    //depending on our guess, show/hide the error
    if (isMeetingWithSomeone && peopleInvitedCount != null && peopleInvitedCount == 0) {
        errorMsgContainer.style.opacity = 1
        errorMsgContainer.style.display = 'inline-flex'
    } else {
        errorMsgContainer.style.opacity = 0
        errorMsgContainer.style.display = 'none'
    }
}

// initialize styling for error message depending on whether it is on dialog or new page
function initializeEventEditPage() {
    errorMsgContainer.classList.add('reminder-error-create-page');
    guestInput = document.querySelector('[aria-label="Guests"]');
    guestSection = getParentNode(guestInput, 5);
    guestSection.classList.add("guest-section-override");
    guestSection.appendChild(errorMsgContainer);
    eventNameInput = document.querySelector('[aria-label="Title"]');
}
function initializeEventEditDialog() {
    errorMsgContainer.classList.remove('reminder-error-create-page')
    document.querySelector('[role="tabpanel"]').parentElement.appendChild(errorMsgContainer);
    eventNameInput = document.querySelector('[aria-label="Add title"]');
}

// extra helper functions
function getParentNode(element, level = 1) { // 1 - default value (if no 'level' parameter is passed to the function)
    if (!element) return null
    while (level-- > 0) {
        element = element.parentNode;
        if (!element) return null; // to avoid a possible "TypeError: Cannot read property 'parentNode' of null" if the requested level is higher than document
    }
    return element;
}