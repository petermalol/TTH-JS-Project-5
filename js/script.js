//variable to easily change amount of users being displayed
let numberOfRequestedUsers = 12;
let userAPI = "https://randomuser.me/api/?results=" + numberOfRequestedUsers


//list to localy save the fetched users
let fetchedUsers = []
//holds all users to be displayed, initially set to all fetched when fetch is called and changed once the search is used
let usersToDisplay = []


//fetches users, sets data to json and then returns the data
const fetchRandomUsers = fetch(userAPI)
    .then(response => response.json())
    .then(data => {
        return data;
    })
    .catch(err => console.error(err));



//gets data from fetchRandomUsers, saves the users to the fetchedUsers and then calls displaygallery with it
Promise.all([fetchRandomUsers])
    .then(data => {
        fetchedUsers = data[0].results
        usersToDisplay = fetchedUsers
        const gallery = document.getElementById("gallery");
        displayGallery()
        displaySearchBar()
    })
    .catch(err => console.error(err));//writes the given error in the console if the promise is broken



//displays search-input, -button and adds event listener to the button
function displaySearchBar(){
    const searchBarHTML = `
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>`

    //adds the HTML to the search container
    document.getElementsByClassName("search-container")[0].insertAdjacentHTML("beforeend", searchBarHTML)

    //adds eventlistener
    const searchSubmit = document.getElementById("search-submit")
    searchSubmit.addEventListener("click", searchUser)
}

//changes usersToDisplayed so that it only includes those users whose names include the search query
function searchUser(){
    const searchInput = document.getElementById("search-input")
    let searchedUsers = []
    //checks against fetchedUsers as to include every initially fetched user
    fetchedUsers.forEach( user => {
        let userFullName = (user.name.first + " " + user.name.last).toLowerCase();
        if (userFullName.includes(searchInput.value.toLowerCase())){
            searchedUsers.push(user)
        }
    })
    gallery.innerHTML = "";
    usersToDisplay = searchedUsers
    displayGallery()
}


//creates a card and an eventlistener for each user in the fetchedUsers list
function displayGallery (){
    const galleryContent = usersToDisplay.map(user => {
        let cardHTML = `
        <div class="card">
                <div class="card-img-container">
                    <img class="card-img" src="${user.picture.medium}" alt="profile picture">
                </div>
                <div class="card-info-container">
                    <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
                    <p class="card-text">${user.email}</p>
                    <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
                </div>
            </div>
        `
        gallery.insertAdjacentHTML("beforeend", cardHTML)
        gallery.lastElementChild.addEventListener("click", () => modalWindowPopUp(user))
    })
}


//creates a modal window when a card is clicked with that specific cards info, also adds prev/next buttons appropriately and tries to give those buttons onclick events
function modalWindowPopUp(user){
    //declares number of users that will be displayed for the modal buttons
    let numberOfDisplayedUsers = usersToDisplay.length
    //saves the index of the current card/modal window to cardIndex using cell since id would cause a bug when null
    let cardIndex = usersToDisplay.findIndex(function(element) {return element.cell === user.cell})

    //declares modalbutton so that it exists even if the if statement doesn't run
    let modalBtns = ``

    //if there are more than 1 user displayed, adds modal buttons
    if (numberOfDisplayedUsers > 1){
        //creates opening tag for the buttons
        modalBtns = `<div class="modal-btn-container">`
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
    }
    //sets dob to a date instance for proper display format
    let dateOfBirth = new Date(user.dob.date);

    //formats phone numbers to proper format (123) 456-7890 and adapts last part to fit if number is 9 or 11 long
    let unformatedCell = user.cell.replace(/\D/g, "");
    let cellPart1 = unformatedCell.substring(0, 3)
    let cellPart2 = unformatedCell.substring(3, 6)
    let cellPart3 = unformatedCell.substring(6)
    let formatedCell = "(" + cellPart1 + ") " + cellPart2 + "-" + cellPart3

    //template literal for the modal card
    let modalCard = `
    <div class="modal-container">
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${user.picture.large}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
                <p class="modal-text">${user.email}</p>
                <p class="modal-text cap">${user.location.city}</p>
                <hr>
                <p class="modal-text">${formatedCell}</p>
                <p class="modal-text">${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.state} ${user.location.postcode}</p>
                <p class="modal-text">Birthday: ${dateOfBirth.getMonth()+1}/${dateOfBirth.getDate()}/${dateOfBirth.getFullYear()}</p>
            </div>
        </div>
        ${modalBtns}
    </div>`

    //adds all the modal-html to the end of body
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

//removes current window before calling modalWindowPopUp to display another one with the given index (1 higher or 1 lower than the one closed)
function changeModalWindow(index){
    document.body.lastElementChild.remove();
    modalWindowPopUp(usersToDisplay[index])
}