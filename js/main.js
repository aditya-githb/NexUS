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
            alert('User signed out successfully');
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
        // Clear the username from local storage when the user signs out
        localStorage.removeItem("username");
    }
});


const chatroom = new Chatroom("general", username);
const chatUI = new ChatUI(chatList);

chatroom.getChats((data) => {
    chatUI.render(data);
});

const key = "h7HGxKF9J7gJ1znKznjriIVr6rvmSdPb5KBRIlgTD975zekw0D";
var keySize = 256;
var ivSize = 128;
var iterations = 100;
// Encryption
function encrypt (msg, pass) {
  var salt = CryptoJS.lib.WordArray.random(128/8);
  
  var key = CryptoJS.PBKDF2(pass, salt, {
      keySize: keySize/32,
      iterations: iterations
    });

  var iv = CryptoJS.lib.WordArray.random(128/8);
  
  var encrypted = CryptoJS.AES.encrypt(msg, key, { 
    iv: iv, 
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
  });
  
  // salt, iv will be hex 32 in length
  // append them to the ciphertext for use  in decryption
  var transitmessage = salt.toString()+ iv.toString() + encrypted.toString();
  return transitmessage;
}

newChat.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = newChat.message.value.trim();
    var text = encrypt(message,key);
    chatroom.addChat(text)
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

