/** Declares and initializes an empty string items */
let items = "";

/** Declares and initializes an array that holds the post id */
let postlists = [];

/**  Declares and initializes report_index */
let report_index = 0;

/** Declares a variable that holds button value */
let butval;

/**
 * Displays every posts started from the recent one by read data from post collection on database.
 */
db.collection("posts").orderBy("timestamp", "desc").get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
        let contain = document.createElement("div");
        contain.setAttribute("class", "card");
        let text = document.createElement("div");
        let p1 = document.createElement("div");
        let p2 = document.createElement("img");
        let p3 = document.createElement("p");
        let p4 = document.createElement("p");
        let p5 = document.createElement("p");
        let p6 = document.createElement("div");
        let btn = document.createElement("img");
        let btnDiv = document.createElement("div");
        btn.setAttribute("data-toggle", "modal");
        btn.setAttribute("data-target", "#basicExampleModal");
        // btn.setAttribute("id", report_index);
        btn.setAttribute("value", report_index);
        btn.setAttribute("src","./images/exclamation.png");
        btn.setAttribute("width","40px");
        btn.setAttribute("height","40px");
        btn.setAttribute("id","reportBtn");
        btn.onclick = function () {
            butval = parseInt(btn.value);
            $(".mess").click(function () {
                var reason = $(this).val();
                localStorage.setItem(0, reason);
                console.log(reason);
            });
        }

        setStyle(contain, p1, p6, btn);

        p4.setAttribute("id", "itemName");

        var storageRef = firebase.storage().ref().child("store_logos");
        let storeLogo;
        switch (doc.data().post_name) {
            case "Walmart":
                storeLogo = storageRef.child("walmart.png");
                break;
            case "Superstore":
                storeLogo = storageRef.child("superstore.png");
                break;
            case "Save-on-Foods":
                storeLogo = storageRef.child("saveonfoods.png");
                break;
            case "Costco":
                storeLogo = storageRef.child("costco.png");
                break;
            default:
                storeLogo = storageRef.child("superstore.png");
                break;
        }

        storeLogo.getDownloadURL().then(function (url) {
            p1.innerHTML = "<b>" + doc.data().post_name + "</b>";
            //p1.innerHTML = `<img src="` + url + `" width="150px" height="40px">`;
            console.log(url);
        }).catch(function (error) {
            console.log(error);
        })

        //need to change it back when slider is fix and have new post.
        // p5.innerHTML = "Posted by " + doc.get(user_post) + "@" + doc.get("post_date");
        p5.innerHTML = "Posted: " + doc.get("post_date");
        btn.innerHTML = "Report";
        var storeInfo = doc.get("post_store");
        getStoreInfo(storeInfo, p3, p4);

        // p6.appendChild(btn);
        text.appendChild(p1);
        text.appendChild(p2);
        text.appendChild(p4);
        text.appendChild(p3);
        text.appendChild(p5);
        // text.appendChild(p6);
        btnDiv.appendChild(btn);
        contain.appendChild(btnDiv);
        contain.appendChild(text);
        document.querySelector("#theContainer").appendChild(contain);

        postlists.push(doc.id);
        console.log(report_index + ": " + doc.id);
        report_index++;
    })
})

// console.log(postlists);

/**
 * Get store information from store reference in specific post document and display it.
 * @param {*} storeInfo 
 * @param {*} p3 
 * @param {*} p4 
 */
function getStoreInfo(storeInfo, p3, p4) {
    storeInfo.get().then(function (doc) {
        p3.innerHTML = doc.get("location");
        let storeItems = doc.data().store_items;
        console.log(storeItems);
        getItemInfo(storeItems, p4);
    })
}

/**
 * Get item information from item reference in specific store document
 * @param {*} storeItems 
 * @param {*} p4 
 */
function getItemInfo(storeItems, p4) {
    for (let i = 0; i < storeItems.length; i++) {
        var name;
        var stock;
        storeItems[i].get().then(function (doc) {
            name = doc.get("item_name");
            stock = doc.get("stock_number");
            var list = document.createElement("li");
            var imageItem;
            if (name == "Face masks") {
                imageItem = "./images/icon_mask.png";
            } else if (name == "Toilet papers") {
                imageItem = "./images/icon_toiletpaper.png";
            } else {
                imageItem = "./images/icon_handsantizer.png";
            }

            // list.innerHTML = items + name + ": " + stock;

            list.innerHTML = `<img src ="` + imageItem + `" style = "width: 70px; height: 70px">`
                    + `<span id="stockQuantity">` + stock + `</span>`;
            list.style.listStyleType = "none";
            list.style.display = "flex";
            list.style.justifyContent = "space-around";
            list.style.alignItems = "center";


            p4.appendChild(list);
        })
    }
}

/**
 * Set the style for the post elements to display posts.
 * @param {*} contain
 * @param {*} p1
 * @param {*} p6
 * @param {*} btn
 */
function setStyle(contain, p1, p6, btn) {
    contain.style.textAlign = "center";
    // contain.style.backgroundColor = "#D6EFFF";
    contain.style.margin = "15px";
    contain.style.padding = "10px";
    contain.style.borderRadius = "10px";
    p1.style.margin = "-25px";
    //p1.style.fontWeight = "bold";
    // p6.style.textAlign = "center";
    // btn.style.backgroundColor = "tomato";
    // btn.style.color = "white";
    // btn.style.borderRadius = "7px";
}

/**
 * Set the style for some elements,
 * and add data to report collection when the report button is clicked.
 */
$(document).ready(function () {
    $(".container").css({"margin-top":"100px" , "margin-bottom":"70px"});
    $("#newPost").css({
        "display": "flex",
        "justify-content": "flex-end",
        "padding": "15px"
    });

    $("#submitButton").click(function () {

        if (document.querySelector('#termsConditions:checked')) {
            db.collection("reports").add({
                report_post: db.collection("posts/").doc(postlists[butval]),
                report_reason: localStorage.getItem(0),
                // report_user: "user.uid"
            }).then(function (docRef) {
                let reportId = db.collection("reports/").doc(docRef.id);
                console.log(reportId);
                db.collection("posts/").doc(postlists[butval]).update({
                    reported: reportId
                })
            }).catch(function (error) {
                console.log("Error adding document: ", error);
            })

            console.log(butval);
            console.log(localStorage.getItem(0));
            console.log(postlists[butval]);
        }

    });
});