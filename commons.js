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

function createLoanTable() {
  fetch('http://localhost:8080/loan/dto/user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Email': getCookie('Email')
    }
  }).then(response => response.json()).then(data => {
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
        dateReturned = '';
      } else {
        dateReturned = new Date(element.dateReturned).toLocaleString('nl-NL', { dateStyle: 'medium', timeStyle: 'short' });
      }
      let dateLoaned = new Date(element.dateLoaned).toLocaleString('nl-NL', { dateStyle: 'medium', timeStyle: 'short' });
      rows +=
        "<tr><td>" + element.bookTitle + "</td>" +
        "<td>" + element.bookCopyNr + "</td>" +
        "<td>" + element.bookIsbn + "</td>" +
        "<td>" + authorNames + "</td>" +
        "<td>" + element.bookCopyStatus + "</td>" +
        "<td>" + dateLoaned + "</td>" +
        "<td>" + dateReturned + "</td>";
    });
    document.getElementById('loans-row').innerHTML = rows;
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

function createIndexTable(page) {
  fetch('http://localhost:8080/book/all').then(response => response.json()).then(data => {
    let rows = '';

    let pageData = pageSelector(data);

    pageData.forEach(element => {
      let urlImage = '<img src=' + element.urlImage + ' style="width: 45px; height: 60px"/>';
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
    let urlImage = '<img src=' + data.urlImage + ' style="width: 45px; height: 60px"/>';
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
        '<img src=' + urlImage + ' style="width: 45px; height: 60px"/>' + "</tr><td>" +
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
