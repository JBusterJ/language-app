var uname;
var firebaseConfig = {
    apiKey: "AIzaSyAGAi2p52Xk8vgAQiDZmj4-GRF5rJ_4y-o",
    authDomain: "andromeda-2b-14196.firebaseapp.com",
    projectId: "andromeda-2b-14196",
    storageBucket: "andromeda-2b-14196.appspot.com",
    messagingSenderId: "793693836395",
    appId: "1:793693836395:web:6eede2d74b9fd912d18d2e"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebaseConfig = window.btoa(firebaseConfig);

const db = firebase.firestore();

// create new content in firebase collection called posts
function createPostInFirebase(title, time, content, author) {
    db.collection("posts").add({
        postName: title,
        createdAt: time,
        postContent: content,
        author: author,
        id: "",
    }).then(function(docRef) {
        console.log("Document created:", docRef.id);
        getPosts();
    });
}

function getDataUrl(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            document.getElementById("blah").src = e.target.result;
        }

        reader.readAsDataURL(input.files[0]);
        console(reader.readAsDataURL(input.files[0]));
    }
}

var today;
var time = "";

function getCurrentDateTime() {
    today = new Date();
    time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    var ampm = "AM";

    if (today.getMinutes() < 10) {
        time = today.getHours() + ":0" + today.getMinutes() + ":" + today.getSeconds();
        ampm = "AM";
    }
    if (today.getHours() > 12) {
        time = today.getHours() - 12 + ":" + time.split(":")[1] + ":" + today.getSeconds();
        ampm = "PM";
    }

    today = dd + '/' + mm + '/' + yyyy;
    return today + " at " + time + ampm;
}

// Account Functions

var cont = false;
var loggedIn = false;

function validate() {
    var username = document.getElementById("uname");
    var password = document.getElementById("pwd");
    var confirmPassword = document.getElementById("confPwd");
    var email = document.getElementById("email");

    if (password.value.length < 8) {
        password.style.border = "1px solid red";
        password.focus();
        console.log("1");
        return false;
    }
    if (username == "" || password == "" || confirmPassword == "" || email == "") {
        console.log("1");
        return false;
    }
    if (confirmPassword.value.length < 8) {
        confirmPassword.style.border = "1px solid red";
        confirmPassword.focus();
        console.log("1");
        return false;
    }

    if (password.value != confirmPassword.value) {
        confirmPassword.style.border = "1px solid red";
        confirmPassword.focus();
        console.log("1");
        return false;
    }
    if (username.value.length < 3) {
        username.style.border = "1px solid red";
        username.focus();
        console.log("1");
        return false;
    }
    if (username.value.length > 20) {
        username.style.border = "1px solid red";
        username.focus();
        console.log("1");
        return false;
    }
    if (username.value.match(/[^a-zA-Z0-9-_]/g)) {
        username.style.border = "1px solid red";
        username.focus();
        console.log("1");
        return false;
    }
    if (document.getElementById("avatar").value == "") {
        console.log("1");
        return false;
    }
    var emailvalidator = db.collection("users").where('email', '==', email.value);
    emailvalidator.get().then(function(querySnapshot) {
        if (querySnapshot.size > 0) {
            email.style.border = "1px solid red";
            email.focus();
            return false;
        }
        if (querySnapshot.size == 0) {
            cont = true;
        }
    });
    return true;
}

function createAccount() {
    validate();
    if (cont == true) {
        console.log("valid");
        var uname = document.getElementById("uname").value;
        var pwd = document.getElementById("pwd").value;
        var email = document.getElementById("email").value;
        var pfp = document.getElementById("blah").src;
        var confirmPwd = document.getElementById("confPwd").value;
        var prefLan = document.getElementById("prefLan").value;

        db.collection("users").add({
            username: uname,
            email: email,
            pwd: pwd,
            avatar: pfp,
            isNew: true,
            prefferedLanguage: prefLan,
            language: []
        }).then(function(docRef) {
            console.log("Account created:", docRef.id);
        });
        cont = true;
        login(false, uname, email, pwd);
        document.getElementById("signupdiv").style.visibility = 'hidden';
    } else if (validate() == undefined || validate() == false) {
        console.log("Account will not be created.");
    }
}

function login(doDbStuff, uname, email, pwd, firstlogin) {
    db.collection("users").where("username", "==", uname).where("pwd", "==", pwd).where("email", "==", email).get().then(function(querySnapshot) {
        if (querySnapshot.size == 0) {
            console.log("Username or password is incorrect");
        } else {
            loggedIn = true;
            document.getElementById("blah").style.display = "initial";
            document.getElementById("notLoggedIn").style.display = "none";
            document.getElementById("blah").src = querySnapshot.docs[0].data().avatar;
            // document.getElementById("usernameHolder").innerHTML = querySnapshot.docs[0].data().username;

            if (doDbStuff == true) {
                // create new item in localstorage with expiration time
                const now = new Date()
                const sessionID = {
                    value: (Math.random() + 1).toString(36).substring(2),
                    expiry: now.getTime() + 432000000,
                }
                localStorage.setItem(window.btoa("lastSessionData"), JSON.stringify(sessionID));
                console.log(sessionID.value);
                // update the current document
                db.collection("users").doc(querySnapshot.docs[0].id).update({
                    sessionData: sessionID.value
                })
                if (firstlogin == true) {
                    window.location.reload();
                }
            }

            document.getElementById("signindiv").style.visibility = 'hidden';
            document.getElementById("signoutbutton").style.visibility = 'visible';
            document.getElementById("signupdiv").style.visibility = 'hidden';
            console.log("Login successful");
        }
        console.log(querySnapshot);
    });
}


function checkForLogin() {
    // look for sessionData in database where the value is the same as the one in localstorage
    db.collection("users").where("sessionData", "==", JSON.parse(localStorage.getItem(window.btoa("lastSessionData"))).value).get().then(function(querySnapshot) {
        login(true, querySnapshot.docs[0].data().username, querySnapshot.docs[0].data().email, querySnapshot.docs[0].data().pwd);
        uname = querySnapshot.docs[0].data().username;
    })
}

function signOut() {
    localStorage.removeItem(window.btoa("lastSessionData"));
    // refresh page
    window.location.reload();
}

var languageSelected = "none";

function checkLanguage() {
    db.collection("users").where("sessionData", "==", JSON.parse(localStorage.getItem(window.btoa("lastSessionData"))).value).get().then(function(querySnapshot) {
        if (querySnapshot.docs[0].data().isNew == true || querySnapshot.docs[0].data().isNew == null) {
            console.log("New user, show language choices");
            document.getElementById("languageChoices").style.display = "block";
        } else {
            for(i in querySnapshot.docs[0].data().language){
                if(querySnapshot.docs[0].data().language[i] != querySnapshot.docs[0].data().prefferedLanguage){
                    languageSelected = querySnapshot.docs[0].data().language[i];
                    var grammarButton = document.createElement("button");

                    grammarButton.innerHTML = "Grammar";
                    grammarButton.id = "grammarButton";

                    document.getElementById("info4").appendChild(grammarButton);

                    grammarButton.addEventListener("click", function (){
                        window.location = `${querySnapshot.docs[0].data().language[i]}grammar.html`;
                    });

                    grammarButton.classList.add("grammar");
                }
            };
        }
    })
}

function setLanguage(lan) {
    db.collection("users").where("sessionData", "==", JSON.parse(localStorage.getItem(window.btoa("lastSessionData"))).value).get().then(function(querySnapshot) {
        var dat = querySnapshot.docs[0].data().language;
        dat.push(lan);
        db.collection("users").doc(querySnapshot.docs[0].id).update({
            language: dat,
            isNew: false
        });
        document.getElementById("languageChoices").style.display = "none";
        languageSelected = lan;
    })
}


checkForLogin();
checkLanguage();
