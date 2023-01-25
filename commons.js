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
      });
  }