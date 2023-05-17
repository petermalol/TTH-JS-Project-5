//variable to easily change amount of users being displayed
let numberOfDisplayedUsers = 12;
let userAPI = "https://randomuser.me/api/?results=" + numberOfDisplayedUsers


//list to localy save the loaded users
let userList = []


//fetches users, sets data to json and then returns the data
const fetchRandomUsers = fetch(userAPI)
    .then(response => response.json())
    .then(data => {
        return data;
    })
    .catch(err => console.error(err));

//gets data from fetchRandomUsers, saves the users to the userList and then calls displaygallery
Promise.all([fetchRandomUsers])
    .then(data => {
        userList = data[0].results
        const gallery = document.getElementById("gallery");
        displayGallery()
        
    })


//creates a card and an eventlistener for each user ("item") in the userList
function displayGallery (){
    const galleryContent = userList.map(item => {
        let cardHTML = `
        <div class="card">
                <div class="card-img-container">
                    <img class="card-img" src="${item.picture.medium}" alt="profile picture">
                </div>
                <div class="card-info-container">
                    <h3 id="name" class="card-name cap">${item.name.first} ${item.name.last}</h3>
                    <p class="card-text">${item.email}</p>
                    <p class="card-text cap">${item.location.city}, ${item.location.state}</p>
                </div>
            </div>
        `
        gallery.insertAdjacentHTML("beforeend", cardHTML)
        gallery.lastElementChild.addEventListener("click", () => modalWindowPopUp(item))
    })
}


//creates a modal window when a card is clicked with that specific cards info, also adds prev/next buttons appropriately and tries to give those buttons onclick events
function modalWindowPopUp(item){

    //saves the index of the current card/modal window to cardIndex
    let cardIndex = userList.findIndex(function(element) {return element.id.value === item.id.value})

    //creates opening tag for the buttons
    let modalBtns = `<div class="modal-btn-container">`
    //adds prev button unless current card is the first
    if(cardIndex !== 0){
        let prevBtn = `<button type="button" id="modal-prev" class="modal-prev btn">Prev</button>`
        modalBtns += prevBtn
    }
    //adds next button unless current card is the last
    if(cardIndex !== numberOfDisplayedUsers - 1){
        let nextBtn = `<button type="button" id="modal-next" class="modal-next btn">Next</button>`
        modalBtns += nextBtn
    }
    //adds closing tag for buttons
    modalBtns += `</div>`

    //sets dob to a date instance for proper display format
    let dateOfBirth = new Date(item.dob.date);

    //IMPORTANT!!!!! NEED TO format phone number correctly

    //template literal for the modal card
    let modalCard = `
    <div class="modal-container">
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${item.picture.large}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${item.name.first} ${item.name.last}</h3>
                <p class="modal-text">${item.email}</p>
                <p class="modal-text cap">${item.location.city}</p>
                <hr>
                <p class="modal-text">${item.cell}</p>
                <p class="modal-text">${item.location.street.number} ${item.location.street.name}, ${item.location.city}, ${item.location.state} ${item.location.postcode}</p>
                <p class="modal-text">Birthday: ${dateOfBirth.getMonth()+1}/${dateOfBirth.getDate()}/${dateOfBirth.getFullYear()}</p>
            </div>
        </div>
        ${modalBtns}
    </div>`

    //adds all the html to the end of body
    document.body.insertAdjacentHTML("beforeend", modalCard);

    //if the card is not the first allow the existing "prev" button to call changeModalWindow to a card with an index 1 lower than the current card
    if(cardIndex !== 0){
        document.getElementById("modal-prev").onclick = () => {
            changeModalWindow(cardIndex - 1)
        }
    }

    //if the card is not the last allow the existing "next" button to call changeModalWindow to a card with an index 1 higher than the current card
    if(cardIndex !== numberOfDisplayedUsers - 1){
        document.getElementById("modal-next").onclick = () => {
            changeModalWindow(cardIndex + 1)
        }
    }
    //evenlistener for the "X" button that removes the modal window from the DOM
    document.getElementById("modal-close-btn").addEventListener("click", () => {
        document.body.lastElementChild.remove();
    })
}

//removes current window before calling modalWindowPopUp to display another one with the given index (1 higher or 1 lower than the one closed before)
function changeModalWindow(index){
    document.body.lastElementChild.remove();
    modalWindowPopUp(userList[index])
}