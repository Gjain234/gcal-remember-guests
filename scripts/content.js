// keep checking URL
var oldURL = ""
function checkUrlChange() {
    newURL = document.URL;
    if (newURL !== oldURL && newURL != null) {
        if (newURL.includes("eventedit")) {
            errorMsgContainer.classList.add('reminder-error-create-page')
            eventEditPage();
        }
        else {
            errorMsgContainer.classList.remove('reminder-error-create-page')
            eventEditDialog();
        }
        oldURL = newURL;
    }
};

const createBtn = document.querySelector('[aria-label="Create"]') //get the Create event button
const meetingChecks = ['<>', '|', 'sync', 'chat', ':', 'meeting'] //identifiers of a meeting
errorMsgContainer = document.createElement('div')
errorMsgContainer.className = 'reminder-error'

//text bit
errorMsg = document.createElement('span')
errorMsg.innerText = 'Remember to include other people when scheduling a meeting.'

//icon
errorIcon = document.createElement('i')
errorIcon.innerText = 'warning'
errorIcon.className = 'google-material-icons meh4fc hggPq GyffFb'

//appending the icon and text to the main error container
errorMsgContainer.appendChild(errorIcon)
errorMsgContainer.appendChild(errorMsg)

//hiding the error to start with
errorMsgContainer.style.display = 'none'
errorMsgContainer.style.opacity = 0

var urlChangeHandler = window.setInterval(checkUrlChange, 10);

// js for event edit page vs dialog

function eventEditPage() {
    let readyStateCheckInterval = setInterval(function () {
        guest_input = document.querySelector('[aria-label="Guests"]');
        guest_section = getParentNode(guest_input, 5);
        guest_list = document.getElementById("xGstLst")?.children[0];
        title_element = document.getElementById("xTiIn");
        if (document.readyState === "complete" && guest_section != null && title_element != null && guest_input != null && guest_list != null) {
            clearInterval(readyStateCheckInterval);
            guest_section.classList.add("guest-section-override");
            guest_section.appendChild(errorMsgContainer);
            function handleEvent() {
                people_invited_count = guest_list.childElementCount;
                title_value = title_element.value.toLowerCase();
                if (meetingChecks.some(identifier => title_value.includes(identifier)) && people_invited_count == 0) {
                    errorMsgContainer.style.opacity = 1
                    errorMsgContainer.style.display = 'inline-flex'
                }
                else {
                    errorMsgContainer.style.opacity = 0
                    errorMsgContainer.style.display = 'none'
                }
            };
            function addGuests() {
                setTimeout(handleEvent, 2000);
            };
            // call events on title change / click
            title_element.oninput = handleEvent;
            window.addEventListener("click", addGuests, false);
        }
    }, 10);
}
function eventEditDialog() {
    createBtn.onclick = function () {
        let readyStateCheckInterval = setInterval(function () {
            const eventNameInput = document.querySelector('[aria-label="Add title"]')
            guest_input = document.querySelector('[aria-label="Guests"]');
            event_list = document.querySelector('[aria-label="Guests invited to this event."]');
            //check if the pop-up dialog has been created
            if (eventNameInput != null && event_list != null) {
                document.querySelector('[role="tabpanel"]').parentElement.appendChild(errorMsgContainer)
                //listen for inpiut
                let isMeetingWithSomeone
                function handleEvent() {
                    //check if the meeting name has any of the signals that it is not a single person meeting
                    isMeetingWithSomeone = meetingChecks.some(identifier => eventNameInput.value.toLowerCase().includes(identifier));
                    people_invited_count = event_list?.childElementCount;
                    //depending on our guess, show/hide the error
                    if (isMeetingWithSomeone && people_invited_count != null && people_invited_count == 0) {
                        errorMsgContainer.style.opacity = 1
                        errorMsgContainer.style.display = 'inline-flex'
                    } else {
                        errorMsgContainer.style.opacity = 0
                        errorMsgContainer.style.display = 'none'
                    }
                }
                function addGuests() {
                    setTimeout(handleEvent, 2000);
                }
                eventNameInput.oninput = handleEvent;
                window.addEventListener("click", addGuests, false);
                //stop the timer
                clearInterval(readyStateCheckInterval);

                //also hide the error once the dialog is closed
                errorMsgContainer.style.display = 'none'
                errorMsgContainer.style.opacity = 0
            }
        }, 10);
    }
}

// helper functions
function getParentNode(element, level = 1) { // 1 - default value (if no 'level' parameter is passed to the function)
    if (!element) return null
    while (level-- > 0) {
        element = element.parentNode;
        if (!element) return null; // to avoid a possible "TypeError: Cannot read property 'parentNode' of null" if the requested level is higher than document
    }
    return element;
}
