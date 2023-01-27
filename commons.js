function logOut() {
  let allCookies = document.cookie.split(';');

  // The "expire" attribute of every cookie is 
  // Set to "Thu, 01 Jan 1970 00:00:00 GMT"
  for (let i = 0; i < allCookies.length; i++) {
    document.cookie = allCookies[i] + "= ;  path=/; expires = " + new Date(0).toUTCString();
  }
  window.location.href = '../login.html';
}

function logIn() {
  window.location.href = '../login.html';
}

function logInOutButton(btn) {
  if (getCookie("Authentication") == null) {
    btn.innerHTML = "Login";
    btn.setAttribute('onclick', 'logIn()');
  }
}

function setCookie(name, value) {
  document.cookie = name + "=" + encodeURIComponent(value);
}

function getCookie(name) {
  var cookieArr = document.cookie.split(";");

  for (var i = 0; i < cookieArr.length; i++) {
    var cookiePair = cookieArr[i].split("=");

    if (name == cookiePair[0].trim()) {
      return decodeURIComponent(cookiePair[1]);
    }
  }

  // Return null if not found
  return null;
}

function changePassword() {
  if (document.getElementById("newPassword").value != document.getElementById("newPasswordCheck").value) {
    return alert("Nieuwe wachtwoorden komen niet overeen");
  }
  fetch('http://localhost:8080/user/changepassword', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authentication': getCookie('Authentication')
    },
    body: JSON.stringify(
      {
        currentPassword: document.getElementById("currentPassword").value,
        newPassword: document.getElementById("newPassword").value
      }
    )
  }).then(response => response.json()).then(data => {
    if (data) {
      return alert("Wachtwoord aangepast");
    } else {
      return alert("Er is iets fout gegaan");
    }
  })
}

function createReservation(clickedId) {

  let idstr = clickedId.split("reserve");
  let idnum = parseInt(idstr[1]);
  fetch('http://localhost:8080/book/' + idnum + '/createreservation', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(
      {
        token: getCookie('Authentication')
      }
    )
  })
    // Nadat de backend de reservering heeft geprobeerd aan te maken, geeft het terug of het is gelukt, en zo nee of de gebruiker
    // al een reservering op dat boek open heeft staan
    .then(response => response.json()).then(data => {
      if (data.success) {
        return alert("Reservering gemaakt");
      }
      else if (data.duplicate) {
        return alert("Je hebt dit boek al gereserveerd!");
      } else {
        return alert("Er is iets mis gegaan.");
      }
    })
}

function createLoanTableCurrent() {
    fetch('http://localhost:8080/loan/dto/user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'token': getCookie('Authentication')
    }}).then(response => response.json()).then(data => {
      data = data.sort((a, b) => {
        return new Date(b.dateLoaned) - new Date(a.dateLoaned);
      });
      let rows = '';
      data.forEach(element => {
        let authorNames = "";
        for (let i = 0; i < element.authors.length; i++) {
          authorNames += element.authors[i].firstName + " " + element.authors[i].lastName;
          if (i < element.authors.length - 1) {
            authorNames += ", ";
          }
        }
        //do not want to see null but empty space
        let dateReturned = "";
        if (element.dateReturned == null) {
          let dateLoaned = new Date(element.dateLoaned).toLocaleString('nl-NL', { dateStyle: 'medium', timeStyle: 'short' });
          rows +=
          "<tr><td>" + element.bookTitle + "</td>" +
          "<td>" + element.bookCopyNr + "</td>" +
          "<td>" + element.bookIsbn + "</td>" +
          "<td>" + authorNames + "</td>" +
          "<td>" + element.bookCopyStatus + "</td>" +
          "<td>" + dateLoaned + "</td>";
        } 
        // else {
        //   dateReturned = new Date(element.dateReturned).toLocaleString('nl-NL', { dateStyle: 'medium', timeStyle: 'short' });
        // }
        
        
      });
      document.getElementById('loans-row-current').innerHTML = rows;
    });
  }

  function createLoanTableHistory() {
    fetch('http://localhost:8080/loan/dto/user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'token': getCookie('Authentication')
    }}).then(response => response.json()).then(data => {
      data = data.sort((a, b) => {
        return new Date(a.dateLoaned) - new Date(b.dateLoaned);
      });
      let rows = '';
      data.forEach(element => {
        let authorNames = "";
        for (let i = 0; i < element.authors.length; i++) {
          authorNames += element.authors[i].firstName + " " + element.authors[i].lastName;
          if (i < element.authors.length - 1) {
            authorNames += ", ";
          }
        }
        //do not want to see null but empty space
        let dateReturned = "";
        if (element.dateReturned != null) {
          dateReturned = new Date(element.dateReturned).toLocaleString('nl-NL', { dateStyle: 'medium', timeStyle: 'short' });
          let dateLoaned = new Date(element.dateLoaned).toLocaleString('nl-NL', { dateStyle: 'medium', timeStyle: 'short' });
          rows +=
          "<tr><td>" + element.bookTitle + "</td>" +
          "<td>" + element.bookCopyNr + "</td>" +
          "<td>" + element.bookIsbn + "</td>" +
          "<td>" + authorNames + "</td>" +
          "<td>" + element.bookCopyStatus + "</td>" +
          "<td>" + dateLoaned + "</td>" +
          "<td>" + dateReturned + "</td>";
        } 
        // else {
        //   dateReturned = new Date(element.dateReturned).toLocaleString('nl-NL', { dateStyle: 'medium', timeStyle: 'short' });
        // }
        
        
      });
      document.getElementById('loans-row-history').innerHTML = rows;
    });
  }

  function createReservationTable() {
    fetch('http://localhost:8080/reservation/dto/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': getCookie('Authentication')
      }
    }).then(response => response.json()).then(data => {
      data = data.sort((a, b) => {
        return new Date(b.dateLoaned) - new Date(a.dateLoaned);
      });
      let rows = '';
      data.forEach(element => {
        let auths = '';
        for (let i = 0; i < element.authors.length; i++) {
          auths += element.authors[i].firstName + " " + element.authors[i].lastName
          if (i < element.authors.length - 1) {
            auths += ", "
          }
        }
        let dateReserved = new Date(element.reservationDate).toLocaleString('nl-NL', { dateStyle: 'medium', timeStyle: 'short' });
        rows += "</tr><td>" +
          element.bookTitle + "</td><td>" +
          auths + "</td><td>" +
          dateReserved + "</td><td>" +
          '<button class="btn btn-outline-success" type="button" onclick="cancel(this.id)" id="cancel' + element.id + '">Annuleer</button></td></tr>';

      });

      document.getElementById('reservations-row').innerHTML = rows;
    });
  }

  function searchReservations() {
    let keyword = document.getElementById('searchField1').value;
    if (!keyword) {
      return createReservationTable();
    }
    fetch('http://localhost:8080/reservation/user/personal/search/' + keyword, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'token': getCookie('Authentication')
    }
  }).then(response => response.json()).then(data => {
      let rows = '';
      data.forEach(element => {
        let auths = '';
        if (element.book.authors) {
          for (let i = 0; i < element.book.authors.length; i++) {
            auths += element.book.authors[i].firstName + " " + element.book.authors[i].lastName
            if (i < element.book.authors.length - 1) {
              auths += ", "
            }
          }
        }
        let dateReserved = new Date(element.dateReserved).toLocaleString('nl-NL', { dateStyle: 'medium', timeStyle: 'short' });
        rows += "</tr><td>" +
          element.book.title + "</td><td>" +
          auths + "</td><td>" +
          dateReserved + "</td><td>" +
          '<button class="btn btn-outline-success" type="button" onclick="cancel(this.id)" id="cancel' + element.id + '">Annuleer</button></td></tr>';
      });
      document.getElementById('reservations-row').innerHTML = rows;
      });
  }

function InitializePage(userPage, adminPage) {
  let user = 0;
  let admin = 1;
  fetch('http://localhost:8080/user/usertype', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Authentication': getCookie("Authentication")
    }
  }).then(response => response.json())
    .then(data => {
      if (data == admin) {
        if (adminPage != "") {
          window.location.href = adminPage
        }
      }
      else if (data == user) {
        if (userPage != "") {
          window.location.href = userPage
        }
      }
      else {
        window.location.href = "../login.html"
      }
    });
}

function pageSelector(data) {
  document.getElementById("current-page").innerHTML = '<p>' + currentPage + '</p>';

  let totalElements = data.length;
  let elementsPerPage = 20;
  let numPages = Math.ceil(totalElements / elementsPerPage);

  if (currentPage > 1) {
    document.getElementById("previous-page").innerHTML = '<button class="btn-success" onclick="previousPage()"><-</button>';
  } else {
    document.getElementById("previous-page").innerHTML = '';
  }
  if (numPages > currentPage) {
    document.getElementById("next-page").innerHTML = '<button class="btn-success" onclick="nextPage()">-></button>';
  } else {
    document.getElementById("next-page").innerHTML = '';
  }
  
  let sliceStart = 0 + ((currentPage - 1) * elementsPerPage);
  let lastEntry;
  if (sliceStart + 1 + elementsPerPage > totalElements) {
    lastEntry = totalElements;
  } else {
    lastEntry = sliceStart + elementsPerPage;
  }
  document.getElementById("page-info").innerHTML = '<p>Pagina ' + currentPage + ' van ' + numPages
    + ', resultaten ' + (sliceStart + 1) + ' - ' + lastEntry + ' van ' + totalElements + '</p>';

  let pageData = data.slice(sliceStart, sliceStart + elementsPerPage);

  return pageData;
}

function searchLoansCurrent() {
    let keyword = document.getElementById('searchField').value;
    if (!keyword) {
      return createLoanTableCurrent();
    }
    fetch('http://localhost:8080/loan/search/user/' + keyword, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'token': getCookie('Authentication')
    }
  }).then(response => response.json()).then(data => {
      let rows = '';
      data.forEach(element => {
        let authorNames = "";
          if (element.authors) {
            for (let i = 0; i < element.authors.length; i++) {
              authorNames += element.authors[i].firstName + " " + element.authors[i].lastName;
              if (i < element.authors.length - 1) {
                authorNames += ", ";
              }
            }
          }
          //do not want to see null but empty space
          let dateLoaned = new Date(element.dateLoaned).toLocaleString('nl-NL', { dateStyle: 'medium', timeStyle: 'short' });
          let extra = ''
          // if (element.bookCopyStatus == "loaned") {
          //   extra = '<button class="btn btn-outline-success" type="button" id="Inleveren' + element.id + '" onclick="returnBookCopy(' + element.bookCopyId + ', ' + element.id + ')">' + "Inleveren" + "</button>";
          // } else {
          //   extra = '';
          // }
          // dateReturned = "";
          if (element.dateReturned == null) {
            // dateReturned = extra;
            rows +=
            "<tr><td>" + element.bookTitle + "</td>" +
            "<td>" + element.bookCopyNr + "</td>" +
            "<td>" + element.bookIsbn + "</td>" +
            "<td>" + authorNames + "</td>" +
            "<td>" + element.bookCopyStatus + "</td>" +
            "<td>" + dateLoaned + "</td></tr>";
          } 
          // else {
          //   dateReturned = new Date(element.dateReturned).toLocaleString('nl-NL', { dateStyle: 'medium', timeStyle: 'short' });
          // }
          // rows +=
          //   "<tr><td>" + element.bookTitle + "</td>" +
          //   "<td>" + element.bookCopyNr + "</td>" +
          //   "<td>" + element.bookIsbn + "</td>" +
          //   "<td>" + authorNames + "</td>" +
          //   "<td>" + element.bookCopyStatus + "</td>" +
          //   "<td>" + dateLoaned + "</td>" +
          //   "<td>" + dateReturned + "</td></tr>";
      });
      document.getElementById('loans-row-current').innerHTML = rows;
    });
  }

  function searchLoansHistory() {
    let keyword = document.getElementById('searchField3').value;
    if (!keyword) {
      return createLoanTableHistory();
    }
    fetch('http://localhost:8080/loan/search/user/' + keyword, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'token': getCookie('Authentication')
    }
  }).then(response => response.json()).then(data => {
      let rows = '';
      data.forEach(element => {
        let authorNames = "";
          if (element.authors) {
            for (let i = 0; i < element.authors.length; i++) {
              authorNames += element.authors[i].firstName + " " + element.authors[i].lastName;
              if (i < element.authors.length - 1) {
                authorNames += ", ";
              }
            }
          }
          //do not want to see null but empty space
          let dateLoaned = new Date(element.dateLoaned).toLocaleString('nl-NL', { dateStyle: 'medium', timeStyle: 'short' });
          dateReturned = "";
          if (element.dateReturned != null) {
            dateReturned = new Date(element.dateReturned).toLocaleString('nl-NL', { dateStyle: 'medium', timeStyle: 'short' });
            rows +=
            "<tr><td>" + element.bookTitle + "</td>" +
            "<td>" + element.bookCopyNr + "</td>" +
            "<td>" + element.bookIsbn + "</td>" +
            "<td>" + authorNames + "</td>" +
            "<td>" + element.bookCopyStatus + "</td>" +
            "<td>" + dateLoaned + "</td>" +
            "<td>" + dateReturned + "</td></tr>";
          } 
          // else {
          //   dateReturned = new Date(element.dateReturned).toLocaleString('nl-NL', { dateStyle: 'medium', timeStyle: 'short' });
          // }
          // rows +=
          //   "<tr><td>" + element.bookTitle + "</td>" +
          //   "<td>" + element.bookCopyNr + "</td>" +
          //   "<td>" + element.bookIsbn + "</td>" +
          //   "<td>" + authorNames + "</td>" +
          //   "<td>" + element.bookCopyStatus + "</td>" +
          //   "<td>" + dateLoaned + "</td>" +
          //   "<td>" + dateReturned + "</td></tr>";
      });
      document.getElementById('loans-row-history').innerHTML = rows;
    });
  }
  
function createIndexTable(page) {
  fetch('http://localhost:8080/book/all').then(response => response.json()).then(data => {
    let rows = '';

    let pageData = pageSelector(data);

    pageData.forEach(element => {
      let urlImage = '<img src= https://covers.openlibrary.org/b/isbn/' + element.isbn + '.jpg style="width: 45px; height: 60px"/>';//'<img src=' + element.urlImage + ' style="width: 45px; height: 60px"/>';
      // Url = "https://covers.openlibrary.org/b/isbn/" + element.isbn + "-M.jpg"
      // let urlImage = '<img src=' + Url + ' style="width: 45px; height: 60px"/>';
      let auths = '';
      for (let i = 0; i < element.authors.length; i++) {
        auths += element.authors[i].firstName + " " + element.authors[i].lastName
        if (i < element.authors.length - 1) {
          auths += ", "
        }
      }
      let tagName = '';
      for (let i = 0; i < element.tags.length; i++) {
        tagName += element.tags[i].name
        if (i < element.tags.length - 1) {
          tagName += ", "
        }
      }
      let copiesAvailable = 0;
      element.bookcopies.forEach(copy => {
        if (copy.status == "available") {
          copiesAvailable++
        }
      })
      rows += "</tr><td>" +
        urlImage + "</td><td>" +
        element.title + "</td><td>" +
        element.isbn + "</td><td>" +
        auths + "</td><td>" +
        tagName + "</td><td>" +
        copiesAvailable + "</td><td>" +
        '<button class="btn btn-outline-success" type="button" onclick="createReservation(this.id)" id="reserve' + element.id + '">Reserveer</button></td></tr>';
    });
    document.getElementById('book-row').innerHTML = rows;
  });
}

function searchIndex() {
  let keyword = document.getElementById('searchField').value;
  if (!keyword) {
    return createIndexTable(1);
  }
  fetch('http://localhost:8080/book/search/' + keyword).then(response => response.json()).then(data => {
    let rows = '';
    let urlImage = '<img src= https://covers.openlibrary.org/b/isbn/' + data.isbn + '.jpg style="width: 45px; height: 60px"/>';//'<img src=' + data.urlImage + ' style="width: 45px; height: 60px"/>';
    data.forEach(element => {
      let auths = '';
      for (let i = 0; i < element.authors.length; i++) {
        auths += element.authors[i].firstName + " " + element.authors[i].lastName
        if (i < element.authors.length - 1) {
          auths += ", "
        }
      }
      let tagName = '';
      for (let i = 0; i < element.tags.length; i++) {
        tagName += element.tags[i].name
        if (i < element.tags.length - 1) {
          tagName += ", "
        }
      }
      let copiesAvailable = 0;
      element.bookcopies.forEach(copy => {
        if (copy.status == "available") {
          copiesAvailable++
        }
      })
      rows += "</tr><td>" +
        urlImage + "</tr><td>" +
        element.title + "</td><td>" +
        element.isbn + "</td><td>" +
        auths + "</td><td>" +
        tagName + "</td><td>" +
        copiesAvailable + "</td><td>" +
        '<button class="btn btn-outline-success" type="button" onclick="createReservation(this.id)" id="reserve' + element.id + '">Reserveer</button></td></tr>';
    });
    document.getElementById('book-row').innerHTML = rows;
  });
}