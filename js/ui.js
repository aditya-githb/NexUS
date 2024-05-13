class ChatUI {
    constructor(list) {
        this.key = "h7HGxKF9J7gJ1znKznjriIVr6rvmSdPb5KBRIlgTD975zekw0D";
        this.list = list;
    }
    render(data) {
        const when = dateFns.distanceInWordsToNow(
            data.createdAt.toDate(),
            { addSuffix: true }
        );
        const html = `
            <li class="list-group-item mb-1">
                <span class="username font-weight-bold bg-dark text-light border">${data.username}</span>
                <span class="message">${this.decrypt(data.message,this.key).toString(CryptoJS.enc.Utf8)}</span>
                <div class="date text-muted">${when}</div>
            </li>`;

        this.list.innerHTML += html;
    }
    clear() {
        this.list.innerHTML = "";
    }
    // Decryption
decrypt(transitmessage, pass) {
    var salt = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32));
    var iv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32))
    var encrypted = transitmessage.substring(64);

    var key = CryptoJS.PBKDF2(pass, salt, {
        keySize: keySize / 32,
        iterations: iterations
    });

    var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC

    })
    return decrypted;
}
}



