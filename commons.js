function logOut(){
    //document.cookie= "Authentication" + ";max-age=0" ;  
    console.log("sd")
    document.cookie = "Authentication= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
    console.log(getCookie("Authentication"));
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