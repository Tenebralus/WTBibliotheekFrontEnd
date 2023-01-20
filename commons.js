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