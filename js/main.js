// Selecting elements
const rooms = document.querySelector(".rooms");
const chatList = document.querySelector(".chat-list");
const newChat = document.querySelector(".new-chat");
const newName = document.querySelector(".new-name");
const updateMsg = document.querySelector(".update-msg");
const options = document.querySelector("button.options");

let username = localStorage.getItem("username");

const auth = firebase.auth();

const signoutBtn = document.querySelector("#signoutbtn");

signoutBtn.addEventListener("click", () => {
    auth.signOut()
        .then(() => {
            console.log('User signed out successfully');
            localStorage.clear();
            location.href = "log.html";
        })
        .catch((error) => {
            alert('Error signing out: ', error);
        });
});

//username
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        const uid = user.uid;
        const firestore = firebase.firestore();
        const usersRef = firestore.collection("users").doc(uid);

        usersRef.get().then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                const usernameFromFirestore = data.username;
                console.log("Username from Firestore:", usernameFromFirestore);
                
                // Check if the username is already updated in local storage
                if (localStorage.getItem("username") !== usernameFromFirestore) {
                    // Update the username in local storage
                    localStorage.setItem("username", usernameFromFirestore);
                    // Assign the username to the variable
                    username = usernameFromFirestore;

                    // Refresh the page to update the username
                    location.reload();
                }
            } else {
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    } else {
        // User is signed out
        console.log("User is signed out");
        // Clear the username from local storage when the user signs out
        localStorage.removeItem("username");
    }
});


const chatroom = new Chatroom("general", username);
const chatUI = new ChatUI(chatList);

chatroom.getChats((data) => {
    chatUI.render(data);
});


newChat.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = newChat.message.value.trim();
    var encrypted = CryptoJS.AES.encrypt(message, "Secret Passphrase");
    console.log(encrypted);
    var decrypted = CryptoJS.AES.decrypt(encrypted, "Secret Passphrase");
    console.log(decrypted.toString(CryptoJS.enc.Utf8));
    chatroom.addChat(message)
        .then(() => newChat.reset())
        .catch((error) => console.log(error));
});


rooms.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
        // Clear the UI
        chatUI.clear();
        // Update the room
        chatroom.updateRoom(e.target.getAttribute("id"));

        chatroom.getChats((data) => chatUI.render(data));
        e.target.classList.add("active");
        for (let sibling of e.target.parentNode.children) {
            if (sibling !== e.target) {
                sibling.classList.remove('active');
                
            }
        }
    }
});

