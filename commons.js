function logOut(){
    document.cookie = "Authentication= ; path=/; expires = Thu, 01 Jan 1970 00:00:00 GMT"
    window.location.href = '/login.html';
}

function logIn(){
  window.location.href = '../login.html';
}

function logInOutButton(btn){
  if(getCookie("Authentication") == null){
    btn.innerHTML = "Login";
    btn.setAttribute('onclick','logIn()');
  }
}

function setCookie(name, value) {
        document.cookie = name + "=" + encodeURIComponent(value);
}

function getCookie(name) {
    var cookieArr = document.cookie.split(";");
    
    for(var i = 0; i < cookieArr.length; i++) {
        var cookiePair = cookieArr[i].split("=");
        
        if(name == cookiePair[0].trim()) {
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

  function createLoanTable() {
    fetch('http://localhost:8080/loan/dto/user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Email': getCookie('Email')
    }}).then(response => response.json()).then(data => {
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