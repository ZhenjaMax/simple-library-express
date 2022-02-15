function getBooks(type) {
    let bookList = document.getElementById("bookList");
    callAjaxRequest(
        type,
        null,
        (response) => {
            let books = JSON.parse(response);
            bookList.innerHTML = getHTMLFromBookList(books.books);
        },
        "GET");
}

function getHTMLFromBookList(books){
    let cssW3colors = ["w3-indigo", "w3-pale-yellow", "w3-pale-red"];
    let statusValues = ["В наличии", "Забронирована", "Просрочена"];
    let htmlRaw = '';
    htmlRaw += `<table class="w3-table" id="bookList"><tbody>
    <tr>
        <th class="w3-center w3-xlarge">Название</th>
        <th class="w3-center w3-xlarge">Автор</th>
        <th class="w3-center w3-xlarge">Год</th>
        <th class="w3-center w3-xlarge">Статус</th>
    </tr>`;
    function getBookStatus(book){
        if(book.bookingDate === 0)
            return 0;
        if(book.bookingDate >= Date.now())
            return 1;
        return 2;
    }
    for(let book of books) {
        let status = getBookStatus(book);
        htmlRaw += `<tr class="${cssW3colors[status]} w3-hover-white w3-border-amber w3-border w3-border-bottom" onClick='window.location.href="/book/${book.id}"'>
           <td class="w3-center">${book.name}</td>
           <td class="w3-center">${book.author}</td>
           <td class="w3-center">${book.year}</td>
           <td class="w3-center">${statusValues[status]}</td>
       </tr>`
    }
    htmlRaw += `</tbody></table>`;
    return htmlRaw;
}

function addBook(){
    let rawBook = {
        name: document.getElementById('name').value,
        author: document.getElementById('author').value,
        year: document.getElementById('year').value
    };
    callAjaxRequest(
        null,
        JSON.stringify(rawBook),
        (res) => { getBooks("all") },
        'POST'
    );
}

function callAjaxRequest(id, data, callback, method) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200)
            callback(xhr.responseText);
    };
    xhr.open(
        method,
        (id !== null) ? `/books/${id}` : `/book`,
        true
    );
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(data);
}
