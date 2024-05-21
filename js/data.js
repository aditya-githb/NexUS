class Chatroom {
    constructor(room, username) {
        this.room = room;
        this.username = username;
        this.chats = db.collection("chats");
        this.unsub;
    }
    //adding new chat to the database
    async addChat(message) {
        const date = new Date();
        const chat = {
            message,
            room: this.room,
            username: this.username,
            createdAt: firebase.firestore.Timestamp.fromDate(date)
        };
        //save the chat to the database
        const response = await this.chats.add(chat);
        return response;
    }
    //setting up a real time listener to get new chats
    getChats(callback) {
        this.unsub = this.chats
            .where("room", "==", this.room)
            .orderBy("createdAt")
            .onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    if (change.type === "added") {
                        callback(change.doc.data());
                    }
                });
            });
    }
    updateRoom(room) {
        this.room = room;
        if (this.unsub) { 
            this.unsub();
        }
    }

}
