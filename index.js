initializeApp();

//Initializes app
function initializeApp() {
  var search = document.getElementById("SearchField");
  search.addEventListener("change", handleSearch);
  makeRequest();
}

//Search handler function
function handleSearch(event) {
  const searchTerm = event.target.value;
  var tableBody = document.getElementById("TableBody");
  var rows = tableBody.getElementsByTagName("tr");

  // Filters down visible data
  for (i = 0; i < rows.length; i++) {
    var cells = rows[i].getElementsByTagName("td");
    var matchesSearch = false;

    // Look at each cell in the current row and determine if at least one matches the criteria.
    for (j = 0; j < cells.length; j++) {
      var cell = cells[j];

      var txtValue = cell.textContent || cell.innerText;

      // Turn on the display if the search criteria matches, else turn display of the row off.
      if (txtValue.toUpperCase().indexOf(searchTerm.toUpperCase()) > -1) {
        rows[i].style.display = "";
        matchesSearch = true;
      } else if (!matchesSearch) {
        rows[i].style.display = "none";
      }
    }
  }
}

// Makes request and paints table with data
function makeRequest() {
  var request = new XMLHttpRequest();

  // Open Air Request
  request.open("GET", "https://api.openaq.org/v1/countries", true);

  request.onload = function() {
    var data = JSON.parse(this.response);

    if (request.status >= 200 && request.status < 400) {
      createTable(data);
    } else {
      console.error("API error status: ", request.status);
    }
  };

  request.send();
}

// Creates table and appends it to app body
function createTable(data) {
  var table = document.createElement("table");
  table.setAttribute("cellSpacing", "0");
  table.setAttribute("cellPadding", "0");
  var tableHeader = document.createElement("thead");
  var tableBody = document.createElement("tbody");
  tableBody.setAttribute("id", "TableBody");

  // Set app data
  var rowData = data.results;

  // Create column headers
  Object.keys(rowData[0]).map(columnId => {
    var cell = document.createElement("th");
    const capsId = columnId.charAt(0).toUpperCase() + columnId.substring(1);

    cell.appendChild(document.createTextNode(capsId));
    tableHeader.appendChild(cell);
  });

  // Create data rows
  rowData.forEach(country => {
    // Skip this entry if it has an errant data count
    if (Object.keys(country).length != 5) {
      return;
    }

    var row = document.createElement("tr");

    Object.values(country).forEach(cellData => {
      var cell = document.createElement("td");
      cell.appendChild(document.createTextNode(cellData));
      row.appendChild(cell);
    });

    tableBody.appendChild(row);
  });

  table.appendChild(tableHeader);
  table.appendChild(tableBody);
  document.getElementById("AppContainer").appendChild(table);
}

function setTableData() {
  return tableBody;
}
