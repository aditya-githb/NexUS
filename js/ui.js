class ChatUI {
    constructor(list) {
        this.list = list;
    }
    render(data) {
        const when = dateFns.distanceInWordsToNow(
            data.createdAt.toDate(),
            {addSuffix: true}
        );
        const html = `
            <li class="list-group-item mb-1">
                <span class="username font-weight-bold bg-dark text-light border">${data.username}</span>
                <span class="message">${data.message}</span>
                <div class="date text-muted">${when}</div>
            </li>`;

        //another solution to add the date in perfet shape instead of using the dateFns Library
        /* 
        const when  = new Date(data.createdAt.toDate()).toString();
        const slice = when.slice(0, -45);
        const html = `
            <li class="list-group-item mb-1">
                <span class="username font-weight-bold bg-dark text-light border">${data.username}</span>
                <span class="message">${data.message}</span>
                <div class="date text-muted">${slice}</div>
            </li>`;
        */

        this.list.innerHTML += html;
    }
    clear() {
        this.list.innerHTML = "";
    }
}