/** Holds the default boolean value of checkbox 1 */
let checked1 = false;

/** Holds the default boolean value of checkbox 2 */
let checked2 = false;

/** Holds the default boolean value of checkbox 3 */
let checked3 = false;

/** Holds an array of the items */
let items = [];

/** Holds an array of the items' stock */
let stock = [];

/** Holds the image url that users have uploaded */
let imgUrl;

/** Hold an array of items' references  */
let itemIDs = [];

/** Holds the current timestamp */
let curTime;

/** Holds the timestamp in date and time format*/
let dateAndTime;

/** Holds the post id references */
let postId;

/** Holds the array of  the user's posts */
let userPost = [];

/** Holds the store id reference */
var storeId;

/** Holds the instant time */
const TIME = 500;

/** Holds the increment exp */
const incrementEXP = firebase.firestore.FieldValue.increment(50);

/** Holds the id fileButton */
var fileButton = document.getElementById('fileButton');

/** Holds the user document id on database */
let userId;

/** Holds the user name on database */
let userName;

/** Slider input */
let slider = document.getElementById("sliderRange");

/** Slider Value Text */
let output = document.getElementById("valueText");

/** Slider input */
var slider2 = document.getElementById("sliderRange2");

/** Slider Value Text */
var output2 = document.getElementById("valueText2");

/** Slider input  */
var slider3 = document.getElementById("sliderRange3");

/** Slider Value Text */
var output3 = document.getElementById("valueText3");

/** Holds the setTimeout */
var refresh;

/**
 * Get user id and user name;
 */
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        userId = db.collection("users/").doc(user.uid);
        console.log(userId);
        userName = user.displayName;
    }
});
/** Invoke functions */

setInterval(function () {
    checkbox();
}, TIME);

/** Firestore Posts Collection Reference */
let postsCollec = db.collection("posts");

/** Firestore Items Collection Reference */
let itemsCollec = db.collection("items");

/** Firestore Stores Collection Reference */
let storesCollec = db.collection("stores");

/**
 * Check if the check box is checked or not to hide the quantity slider
 */
function checkbox() {

    if (document.querySelector('#customCheck1:checked')) {
        checked1 = true;
        document.querySelector('#sliderContainer1').style.display = "inline";
    } else {
        checked1 = false;
        document.querySelector('#sliderContainer1').style.display = "none";
    }

    if (document.querySelector('#customCheck2:checked')) {
        checked2 = true;
        document.querySelector('#sliderContainer2').style.display = "inline";
    } else {
        checked2 = false;
        document.querySelector('#sliderContainer2').style.display = "none";
    }

    if (document.querySelector('#customCheck3:checked')) {
        checked3 = true;
        document.querySelector('#sliderContainer3').style.display = "inline";
    } else {
        checked3 = false;
        document.querySelector('#sliderContainer3').style.display = "none";
    }
}

/**
 * Hide the quantity input box.
 */
function removeQuantity() {
    document.querySelector('#quantity').style.display = "none";
}

/**
 * Add the data from user's input to severals collection on database.
 * 
 * I found the code for add new document to collection on https://firebase.google.com
 * @see https://firebase.google.com/docs/firestore/manage-data/add-data
 */
function setDataPost() {
    let locate = document.getElementById("address").value + ", " +
        document.getElementById("province").value +
        ", " + document.getElementById("zip").value;

    //iterate over each item in the items array and add them to the database
    for (let i = 0; i < items.length; i++) {
        db.collection("items").add({
            category: items[i],
            item_name: items[i],
            stock_number: stock[i]
        }).then(function (docRef) {
            let itemId = db.collection("items/").doc(docRef.id);
            console.log(itemId);
            itemIDs.push(itemId);
            // add the store and post once the last item has been pushed to itemIDs array
            if (i == items.length - 1) {
                db.collection("stores").add({
                    location: locate,
                    store_items: itemIDs,
                    store_name: document.getElementById("nameStore").value
                }).then(function (docRef) {
                    storeId = db.collection("stores/").doc(docRef.id);
                    console.log(storeId);
                    db.collection("posts").add({
                        post_image: imgUrl,
                        post_date: dateAndTime,
                        timestamp: curTime,
                        post_name: document.getElementById("nameStore").value,
                        post_items: itemIDs,
                        post_store: storeId,
                        user_id: userId
                    }).then(function (docRef) {
                        postId = db.collection("posts/").doc(docRef.id);
                    }).catch(function (error) {
                        console.log("Error adding document: ", error);
                    });
                });
            }
        });
    }
}

/**
 * Get the item information if the item checkbox is checked.
 */
function getItemInfo() {
    if (document.querySelector('#customCheck1:checked')) {
        items.push(document.getElementById("customCheck1").value);
        let numValue = document.getElementById("sliderRange").value;
        console.log(numValue);
        convertSliderValue(numValue);
    }

    if (document.querySelector('#customCheck2:checked')) {
        items.push(document.getElementById("customCheck2").value);
        let numValue = document.getElementById("sliderRange2").value;
        convertSliderValue(numValue);
    }

    if (document.querySelector('#customCheck3:checked')) {
        items.push(document.getElementById("customCheck3").value);
        let numValue = document.getElementById("sliderRange3").value;
        convertSliderValue(numValue);
    }
}

/**
 * Save information that users entered and update it to database.
 */
function save() {
    console.log("inside save()");
    let promise = new Promise(function (req, res) {
        getItemInfo();
    });
    console.log("begin promise chain");
    promise
        .then(getTimeStamp())
        .then(getAllPost())
        .then(setDataPost())
        .then(updateUser())
        .then(move());
    console.log("end promise chain");
    console.log("end of save()");
        refresh = setTimeout(function () {
        window.location.href = "./post.html";
    }, TIME * 3);
}

/**
 * Get the timestamp when the user posts.
 * 
 * We got this code on https://www.toptal.com/software/definitive-guide-to-datetime-manipulation
 * @author Punit Jajodia
 * @see https://www.toptal.com/software/definitive-guide-to-datetime-manipulation
 */
function getTimeStamp() {

    // creates new date, formatted "Wed May 06 2020 15:23:38 GMT-0700 (Pacific Daylight Time)""
    var curDate = new Date();

    // extracts the date
    var date = curDate.getDate();

    // extracts the month
    var month = curDate.getMonth();

    // extracts the year
    var year = curDate.getFullYear();

    // ensures that digits are always 2
    function pad(n) {
        return n < 10 ? '0' + n : n
    }

    // formats date to "month/day/year" 
    var monthDateYear = (month + 1) + "/" + date + "/" + year;

    // grabs current timestamp
    curTime = curDate.getTime();

    // formats timestamp to local time
    var newTime = curDate.toLocaleTimeString()

    // formats date and time together
    dateAndTime = curDate.toLocaleString(undefined, {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

/**
 * Gets all the posts that the user has posted and stores it into an array.
 */
function getAllPost() {
    firebase.auth().onAuthStateChanged(function (user) {
        db.collection("/users/").doc(user.uid).get().then(function (user) {
            let uPostExists = user.get("user_posts");
            console.log("user_posts exists: " + uPostExists);
            if (uPostExists !== undefined) {
                userPost = user.data().user_posts;
                console.log("set userPost to user.data().user_posts");
            } else {
                userPost = [];
                console.log("made blank userPost array");
            }
        })
    });
}

/**
 * Update user posts in users collection on database when users post. 
 */
function updateUser() {
    firebase.auth().onAuthStateChanged(function (user) {
        db.collection("/users/").doc(user.uid).update({
            user_posts: userPost
        });
    });
}

/**
 * Increase the point every time the user posts and update points into database.
 */
function move() {

    var user = firebase.auth().currentUser;
    let doc = db.collection('/users/').doc(user.uid);

    doc.update({
        points: incrementEXP
    }); // increments points
    updateExp();

    console.log("pressed");
}

/**
 * Update the level when users reach new level and resets the point to 0,
 * and show congratulation message to users.
 */
function updateExp() {
    var user = firebase.auth().currentUser;


    let doc = db.collection('/users/').doc(user.uid).onSnapshot(function (snap) {
        let exp = snap.data().points;

        if (exp >= 100) {
            clearTimeout(refresh);
            let level = snap.data().level;

            db.collection('/users/').doc(user.uid).update({
                points: 0
            });
            db.collection('/users/').doc(user.uid).update({
                level: level + 1
            }); 
            // increments level
            $("#lv").html("Level: " + level);
            $("#levelReached").html(level + 1);
            $("#congratulation").modal("show");
        }

    });
}

/**
 * Shows the slider value.
 * @param {*} a 
 * @param {*} output 
 */
function showSliderValue(a,output){
    if (a == 0){
        output.innerHTML = "none";
    } else if (a == 1){
        output.innerHTML = "few";
    } else if (a ==2){
        output.innerHTML = "some"
    } else if (a ==3){
        output.innerHTML = "many"
    } else if (a == 4){
        output.innerHTML = "plenty";
    }
}

/**
 * Convert the slider value to the word.
 * @param {*} a 
 * @param {*} b 
 */
function convertSliderValue(a){
    if (a == 0){
        stock.push("none");
    } else if (a == 1){
        stock.push("few");
    } else if (a == 2){
        stock.push("some");
    } else if (a == 3){
        stock.push("many");
    } else if (a == 4){
        stock.push("plenty");
    }
}

/**
 * Calls the function slider.
 */
slider.oninput = function(){
    showSliderValue(this.value, output)
};
slider2.oninput = function(){
    showSliderValue(this.value, output2)
};
slider3.oninput = function(){
    showSliderValue(this.value, output3)
};

/** Sets the default value */
output.innerHTML = "none";
output2.innerHTML = "none";
output3.innerHTML = "none";

/**
 * Store the image that user has uploaded to firebase storage and gets the reference.
 * 
 * I found the codes through tutorial on youtube.com
 * @author David East
 * @see https://www.youtube.com/watch?v=SpxHVrpfGgU
 */
$(document).ready(function () {
    console.log("current window location: " + window.location.href);
    if (window.location.href.includes("/posting.html")) {
        console.log("window location TRUE");

        fileButton.addEventListener('change', function (e) {
            var file = e.target.files[0];
            //create a storage ref
            var storageRef = firebase.storage().ref().child('Image/' + file.name);
            console.log("post storageRef: " + storageRef);

            var task = storageRef.put(file);

            storageRef.getDownloadURL().then(function (url) {
                console.log("storageRef downloadURL: " + url);
                imgUrl = url;
            });

            //update progress bar
            task.on('state_changed',
                function error(err) {
                    // A full list of error codes is available at
                    // https://firebase.google.com/docs/storage/web/handle-errors
                    switch (error.code) {
                        case 'storage/unauthorized':
                            // User doesn't have permission to access the object
                            break;
                        case 'storage/canceled':
                            // User canceled the upload
                            break;
                        case 'storage/unknown':
                            // Unknown error occurred, inspect error.serverResponse
                            break;
                    }
                },
                function complete() {
                    storageRef.getDownloadURL().then(function (url) {
                        console.log("downloadURL: " + url);
                        imgUrl = url;
                    });
                }
            );
        });

        /**
         * Invoke save() when button is clicked.
         */
        document.getElementById("postButton").onclick = function () {
            save();
        };
    }
});