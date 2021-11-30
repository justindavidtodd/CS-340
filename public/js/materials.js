// materials.js

// Client-side javascript for manipulating the DOM and making http requests from the loans page

// Pre-populate the update form when patronID is selected
let materialSelector =document.getElementById('update-id');

materialSelector.addEventListener('change', function(){
    selectedID = materialSelector.value;
    
    // get the existing data from relevant table cells 
    selectedTitle = document.getElementById(`${selectedID}title`).innerText;
    selectedAuthor = document.getElementById(`${selectedID}author`).innerText;
    selectedMedium = document.getElementById(`${selectedID}medium`).innerText;
    selectedGenre = document.getElementById(`${selectedID}genre`).innerText;
    selectedAvailableCopies = document.getElementById(`${selectedID}availableCopies`).innerText;
    selectedTotalCopies = document.getElementById(`${selectedID}totalCopies`).innerText;
    selectedRestricted = document.getElementById(`${selectedID}restricted`).innerText;

    // get the form inputs
    titleCell = document.getElementById('update-title');
    authorCell = document.getElementById('update-author');
    mediumCell = document.getElementById('update-medium');
    genreCell = document.getElementById('update-genre');
    availableCopiesCell = document.getElementById('update-availableCopies');
    totalCopiesCell = document.getElementById('update-totalCopies');
    restrictedCell = document.getElementById('update-restricted');

    // pre-populate the form with existing data
    titleCell.value = selectedTitle;
    authorCell.value = selectedAuthor;
    mediumCell.value = selectedMedium;
    genreCell.value = selectedGenre;
    availableCopiesCell.value = selectedAvailableCopies;
    totalCopiesCell.value = selectedTotalCopies;
    restrictedCell.checked = (selectedRestricted == '1') ? true : false;

});


// Updating a material
let updateMaterialForm = document.getElementById('updateMaterialForm');

updateMaterialForm.addEventListener("submit", function(e) {
    e.preventDefault();

    // Form inputs
    let inputID = document.getElementById('update-id');
    let inputTitle = document.getElementById('update-title');
    let inputAuthor = document.getElementById('update-author');
    let inputMedium = document.getElementById('update-medium');
    let inputGenre = document.getElementById('update-genre');
    let inputAvailableCopies = document.getElementById('update-availableCopies');
    let inputTotalCopies = document.getElementById('update-totalCopies');
    let inputRestricted = document.getElementById('update-restricted');


    // Input values
    let inputIDValue = inputID.value;
    let titleValue = inputTitle.value;
    let authorValue = inputAuthor.value;
    let mediumValue = inputMedium.value;
    let genreValue = inputGenre.value;
    let availableCopiesValue = inputAvailableCopies.value;
    let totalCopiesValue = inputTotalCopies.value;
    // The checkboxes don't have a value, they just have a 'checked' property
    let restrictedValue = inputRestricted.checked ? 1 : 0;

    // Create object
    let data = {
        id : inputIDValue,
        title: titleValue,
        author: authorValue,
        medium: mediumValue,
        genre: genreValue,
        availableCopies: availableCopiesValue,
        totalCopies: totalCopiesValue,
        restricted: restrictedValue
    };

    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", `/materials/${inputIDValue}`, true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell ajax request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Update existing row in table
            updateTableRow(xhttp.response);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send request and wait for response
    xhttp.send(JSON.stringify(data));
})

updateTableRow = (data) => {
    
    let updatedRow = JSON.parse(data)[0];               // Get updated results from db
    

    idCell = document.getElementById(`${updatedRow.materialID}ID`);
    titleCell = document.getElementById(`${updatedRow.materialID}title`);
    authorCell = document.getElementById(`${updatedRow.materialID}author`);
    mediumCell = document.getElementById(`${updatedRow.materialID}medium`);
    availableCopiesCell = document.getElementById(`${updatedRow.materialID}availableCopies`);
    totalCopiesCell = document.getElementById(`${updatedRow.materialID}totalCopies`);
    genreCell = document.getElementById(`${updatedRow.materialID}genre`);
    restrictedCell = document.getElementById(`${updatedRow.materialID}restricted`);

    // Fill cells with data
    idCell.innerText = updatedRow.patronID;
    titleCell.innerText = updatedRow.title;
    authorCell.innerText = updatedRow.author;
    mediumCell.innerText = updatedRow.medium;
    genreCell.innerText = updatedRow.genre;
    availableCopiesCell.innerText = updatedRow.availableCopies;
    totalCopiesCell.innerText = updatedRow.totalCopies;
    restrictedCell.innerText = updatedRow.restricted;
}

/* 

ADD ROW FUNCTIONALITY

*/

// Make a post request and add row when addHoldFrom is submitted
let addMaterialForm = document.getElementById('addMaterialForm');

addMaterialForm.addEventListener("submit", function(e) {

    // Prevent the submission and refreshing of the page
    e.preventDefault();

    // Form inputs
    let inputTitle = document.getElementById("addTitle");
    let inputAuthor = document.getElementById("addAuthor");
    let inputMedium = document.getElementById("addMedium");
    let inputGenre = document.getElementById("addGenre");
    let inputCopies = document.getElementById("addTotalCopies");
    let inputRestricted = document.getElementById("addRestricted")

    // Input values
    let titleValue = inputTitle.value;
    let authorValue = inputAuthor.value;
    let mediumValue = inputMedium.value;
    let genreValue = inputGenre.value;
    let copiesValue = inputCopies.value;
    let restrictedValue = inputRestricted.checked;

    // Create object
    let data = {
        title: titleValue,
        author: authorValue,
        medium: mediumValue,
        genre: genreValue,
        copies: copiesValue,
        restricted : restrictedValue
    };

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/materials", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell ajax request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add new row to table
            addRowToTable(xhttp.response);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send request and wait for response
    xhttp.send(JSON.stringify(data));

})


// Add row to table in front-end
// I think this can be a common js function that we can use use in all files if we create a loop to deal with the data
addRowToTable = (data) => {
    
    let currentTable = document.getElementById("materialsTableBody");   // Get the current table body
    let parsedData = JSON.parse(data);                              
    let newRow = parsedData[parsedData.length - 1];                 // Gets the last row of the current dataset
    
    // Create a row with six cells
    let row = document.createElement("tr");
    let idCell = document.createElement("td");
    let authorCell = document.createElement("td");
    let titleCell = document.createElement("td");
    let mediumCell = document.createElement("td");
    let restrictedCell = document.createElement("td");
    let availableCopiesCell = document.createElement("td");
    let totalCopiesCell = document.createElement("td");
    let genreCell = document.createElement("td");    

    row.id = newRow.holdID;

    // Fill cells with data
    idCell.innerText = newRow.materialID;
    authorCell.innerText = newRow.author;
    titleCell.innerText = newRow.title;
    mediumCell.innerText = newRow.medium;
    restrictedCell.innerText = newRow.restricted;
    availableCopiesCell.innerText = newRow.availableCopies;
    totalCopiesCell.innerText = newRow.totalCopies;
    genreCell.innerText = newRow.genre;
    
    // Add the cells to the row in the DOM
    row.appendChild(idCell);
    row.appendChild(authorCell);
    row.appendChild(titleCell);
    row.appendChild(mediumCell);
    row.appendChild(restrictedCell);
    row.appendChild(availableCopiesCell);
    row.appendChild(totalCopiesCell);
    row.appendChild(genreCell);

    // Add row to table in DOM
    currentTable.appendChild(row);
}