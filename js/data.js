//adding new chat documents
//setting up a real time listener to get new chats
//updating the user name
//updating the room

class Chatroom {
    constructor(room, username) {
        this.room     = room;
        this.username = username;
        this.chats    = db.collection("chats");
        this.unsub;
    }
    //adding new chat documents to the database
    async addChat(message) {
        //create chat objet
        const date = new Date();
        const chat = {
            message, // >> es6 and it is equal to (message: message)
            room:      this.room,
            username:  this.username,
            createdAt: firebase.firestore.Timestamp.fromDate(date)
        };
        //save the chat document to the database
        const response = await this.chats.add(chat);
        return response;
    }
    //setting up a real time listener to get new chats
    getChats(callback) {
        this.unsub = this.chats
            .where("room", "==", this.room) //complex query to get the specific room not all rooms
            .orderBy("createdAt") // order the data that come from firestore, by dates (timestamp), so the old chat messages will be at the top and the new chat messages will be at the bottom as usual in any chat app.
            .onSnapshot(snapshot => {
            //console.log(snapshot);
            snapshot.docChanges().forEach(change => {
                //console.log(change);
                 if(change.type === "added") {
                     //listen the (changes) UPDATES to the UI not injecting them to the DOM
                     callback(change.doc.data());
                 }
            });
        });
    }
    //updating the user name
    updateName(username) {
        this.username = username;
        //store the username to the locale storage
        localStorage.setItem("username", username);
    }
    //updating the room
    updateRoom(room) {
        this.room = room;
        if(this.unsub) { //check that the unsub() has been already set
            this.unsub(); //unsub the changes when updating the room to prevent listening to the initial default room.  
        }
        //console.log("room updated")
    }

}

/*const chatroom = new Chatroom("general", "shady");
//console.log(chatroom);
//chatroom.addChat("hello my friends");

chatroom.getChats(data => {
    console.log(data);
});

setTimeout(() => {
    chatroom.updateRoom("gaming");
    chatroom.updateName("nadien");
    chatroom.getChats((data) => { //recall the getChats() but this time afterr updating the room so it will use the new room name not the default room
        console.log(data);
    });

}, 3000);
*/