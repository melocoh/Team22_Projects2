// display user name
function showName() {
    firebase.auth().onAuthStateChanged(function (user) {
        console.log(user.displayName);
        document.getElementById("welcome").innerHTML = "Let's get started " + user.displayName + "!";
    })
}

// invoke display showName function
showName();

/**
 * Performs smooth responsive animation on top navbar
 * which toggles on scroll
 * 
 * @author
 * @see https://www.w3schools.com/w3css/
 * 
 */

 // Change style of navbar on scroll
 window.onscroll = function () { myFunction() };
 function myFunction() {
     var navbar = document.getElementById("myNavbar");
     if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
         navbar.className = "w3-bar" + " w3-card" + " w3-animate-top" + " w3-white";
     } else {
         navbar.className = navbar.className.replace(" w3-card w3-animate-top w3-white", "");
     }
 }

 // Used to toggle the menu on small screens when clicking on the menu button
 function toggleFunction() {
     var x = document.getElementById("navDemo");
     if (x.className.indexOf("w3-show") == -1) {
         x.className += " w3-show";
     } else {
         x.className = x.className.replace(" w3-show", "");
     }
 }