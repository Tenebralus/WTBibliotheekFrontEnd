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
        let dateReserved = new Date(element.reservationDate).toLocaleString('nl-NL', { dateStyle: 'medium', timeStyle: 'short' });
        rows += "</tr><td>" +
          element.book.title + "</td><td>" +
          auths + "</td><td>" +
          dateReserved + "</td><td>" +
          '<button class="btn btn-outline-success" type="button" onclick="cancel(this.id)" id="cancel' + element.id + '">Annuleer</button></td></tr>';
      });
      document.getElementById('reservations-row').innerHTML = rows;
    });
  }

  // function searchLoans() {
  //   let keyword = document.getElementById('searchField').value;
  //   if (!keyword) {
  //     return createReservationTable();
  //   }
  //   fetch('http://localhost:8080/loan/search/user/' + keyword, {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'token': getCookie('Authentication')
  //   }
  // }).then(response => response.json()).then(data => {
  //     let rows = '';
  //     data.forEach(element => {
  //       let authorNames = "";
  //         if (element.authors) {
  //           for (let i = 0; i < element.authors.length; i++) {
  //             authorNames += element.authors[i].firstName + " " + element.authors[i].lastName;
  //             if (i < element.authors.length - 1) {
  //               authorNames += ", ";
  //             }
  //           }
  //         }
  //         //do not want to see null but empty space
  //         let dateLoaned = new Date(element.dateLoaned).toLocaleString('nl-NL', { dateStyle: 'medium', timeStyle: 'short' });
  //         let extra = ''
  //         if (element.bookCopyStatus == "loaned") {
  //           extra = '<button class="btn btn-outline-success" type="button" id="Inleveren' + element.id + '" onclick="returnBookCopy(' + element.bookCopyId + ', ' + element.id + ')">' + "Inleveren" + "</button>";
  //         } else {
  //           extra = '';
  //         }
  //         dateReturned = "";
  //         if (element.dateReturned == null) {
  //           dateReturned = extra;
  //         } else {
  //           dateReturned = new Date(element.dateReturned).toLocaleString('nl-NL', { dateStyle: 'medium', timeStyle: 'short' });
  //         }
  //         rows +=
  //           "<tr><td>" + element.bookTitle + "</td>" +
  //           "<td>" + element.bookCopyNr + "</td>" +
  //           "<td>" + element.bookIsbn + "</td>" +
  //           "<td>" + authorNames + "</td>" +
  //           "<td>" + element.bookCopyStatus + "</td>" +
  //           "<td>" + dateLoaned + "</td>" +
  //           "<td>" + dateReturned + "</td></tr>";
  //     });
  //     document.getElementById('loans-row-current').innerHTML = rows;
  //   });
  // }

