// holds.js

// Client-side javascript for manipulating the DOM and making http requests from the holds page


/* 

ADD ROW FUNCTIONALITY

*/

// Make a post request and add row when addHoldFrom is submitted
let addHoldForm = document.getElementById('addHoldForm');

addHoldForm.addEventListener("submit", function(e) {

    // Prevent the submission and refreshing of the page
    e.preventDefault();

    // Form inputs
    let inputMaterial = document.getElementById("addMaterialID");
    let inputPatron = document.getElementById("addPatronID");
    let inputEmployee = document.getElementById("addEmployeeID");

    // Input values
    let materialValue = inputMaterial.value;
    let patronValue = inputPatron.value;
    let employeeValue = inputEmployee.value;

    // Create object
    let data = {
        materialID: materialValue,
        patronID: patronValue,
        employeeID: employeeValue,
    }

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/holds", true);
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
    
    let currentTable = document.getElementById("holdsTableBody");   // Get the current table body
    let parsedData = JSON.parse(data);                              
    let newRow = parsedData[parsedData.length - 1];                 // Gets the last row of the current dataset
    
    // Create a row with six cells
    let row = document.createElement("tr");
    let idCell = document.createElement("td");
    let createdCell = document.createElement("td");
    let materialCell = document.createElement("td");
    let patronCell = document.createElement("td");
    let employeeCell = document.createElement("td");
    let deleteCell = document.createElement("td");
    
    row.id = newRow.holdID;

    // Create delete button
    let deleteButton = document.createElement("button");
    deleteButton.type="button";
    deleteButton.className = "btn btn-outline-danger";
    deleteButton.setAttribute("deleteId", newRow.holdID);
    deleteButton.innerText = "Delete";
    bindDeleteButton(deleteButton);

    // Fill cells with data
    idCell.innerText = newRow.holdID;
    createdCell.innerText = toLocalDateTime(newRow.created);
    materialCell.innerText = newRow.materialID;
    patronCell.innerText = newRow.patronID
    employeeCell.innerText = newRow.employeeID;
    deleteCell.className = "delete";
    deleteCell.appendChild(deleteButton);

    
    // Add the cells to the row in the DOM
    row.appendChild(idCell);
    row.appendChild(createdCell);
    row.appendChild(materialCell);
    row.appendChild(patronCell);
    row.appendChild(employeeCell);
    row.appendChild(deleteCell);

    // Add row to table in DOM
    currentTable.appendChild(row);
}



/*

DELETE ROW FUNCTIONALITY

*/

// Functions to bind all the delete buttons

document.addEventListener("DOMContentLoaded", bindDeletes);

function bindDeleteButton(deleteButton){
    // Bind the delete button after a new row is added or the DOM is reloaded
    deleteButton.addEventListener("click", function(){
        var deleteId = deleteButton.getAttribute("deleteId");
        var req = new XMLHttpRequest();
        var payload = {}
        payload.id = deleteId
        req.open('DELETE', `/holds/${deleteId}`, true)
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener('load',function(){
            if(req.status >= 200 && req.status < 400){
                deleteRow(deleteId)
            } else {
              console.log("Error in network request: " + req.statusText);
            }});
        req.send(JSON.stringify(payload));
    })
}

function bindDeletes() {
    document.querySelectorAll('.btn-outline-danger').forEach(item => {
    // Add event listener to make DELETE request on specific ID
        bindDeleteButton(item)
});
}

function deleteRow(deleteId) {
    let row = document.getElementById(deleteId)
    row.parentNode.removeChild(row);
}

