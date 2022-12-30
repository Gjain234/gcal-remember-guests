const createBtn = document.querySelector('[aria-label="Create"]') //get the Create event button
const meetingChecks = ['<>', '|', 'sync', 'chat', ':', 'meeting'] //identifiers of a meeting

//creating the error message
const errorMsgContainer = document.createElement('div')
errorMsgContainer.className = 'reminder-error'

//text bit
const errorMsg = document.createElement('span')
errorMsg.innerText = 'Seems like you are creating a meeting with someone else, please remember to add other people too.'

//icon
const errorIcon = document.createElement('i')
errorIcon.innerText = 'warning'
errorIcon.className = 'google-material-icons meh4fc hggPq GyffFb'

//appending the icon and text to the main error container
errorMsgContainer.appendChild(errorIcon)
errorMsgContainer.appendChild(errorMsg)

//hiding the error to start with
errorMsgContainer.style.display = 'none'
errorMsgContainer.style.opacity = 0

//every time, the button is clicked – start the timer and wait for the pop-up dialog to open
createBtn.onclick = function () {

    let readyStateCheckInterval = setInterval(function () {
        const eventNameInput = document.querySelector('[aria-label="Add title"]')
        //check if the pop-up dialog has been created
        if (eventNameInput != null) {

            document.querySelector('[role="tabpanel"]').parentElement.appendChild(errorMsgContainer)
            //listen for inpiut
            let isMeetingWithSomeone
            eventNameInput.oninput = () => {
                //check if the meeting name has any of the signals that it is not a single person meeting
                isMeetingWithSomeone = meetingChecks.some(identifier => eventNameInput.value.toLowerCase().includes(identifier));

                //depending on our guess, show/hide the error
                if (isMeetingWithSomeone) {
                    errorMsgContainer.style.opacity = 1
                    errorMsgContainer.style.display = 'inline-flex'
                } else {
                    errorMsgContainer.style.opacity = 0
                    errorMsgContainer.style.display = 'none'
                }
            }
            //stop the timer
            clearInterval(readyStateCheckInterval);
        }
    }, 10);
}
