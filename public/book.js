function deleteBook(id) {
    callAjaxRequest(
        id,
        null,
        (res) => {},
        'DELETE',
        `/book/${id}`
    );
}

function changeBook(id) {
    let rawBook = {
        name: document.getElementById('nameInput').value,
        author: document.getElementById('authorInput').value,
        year: document.getElementById('yearInput').value,
    };
    let name = document.getElementById('name');
    let author = document.getElementById('author');
    let year = document.getElementById('year');

    callAjaxRequest(
        id,
        JSON.stringify(rawBook),
        (res) => {
            let book = JSON.parse(res);
            name.innerHTML = book.name;
            author.innerHTML = book.author;
            year.innerHTML = book.year;
        },
        'PUT',
        `/book/data/${id}`
    );
}

function changeReader(id){
    let rawBook = {
        reader: document.getElementById('inputReader').value,
        bookingDate: document.getElementById('inputBookingDate').value
    };

    let status = document.getElementById('status');
    let readerHeader = document.getElementById('readerHeader');
    let reader = document.getElementById('reader');
    let bookingDateHeader = document.getElementById('bookingDateHeader');
    let bookingDate = document.getElementById('bookingDate');
    let giveButtons = document.getElementsByClassName('give');
    let backButtons = document.getElementsByClassName('back');

    callAjaxRequest(
        id,
        JSON.stringify(rawBook),
        (res) => {
            let book = JSON.parse(res);
            status.innerHTML = (book.bookingDate === 0) ? "В наличии" : (book.bookingDate >= Date.now()) ? "Забронирована" : "Просрочена";
            reader.innerHTML = book.reader;
            bookingDate.innerHTML = new Date(book.bookingDate).toLocaleDateString("en-US");

            if (book.reader === '') {
                readerHeader.style.setProperty('display', 'none');
                reader.style.setProperty('display', 'none');
                bookingDateHeader.style.setProperty('display', 'none');
                bookingDate.style.setProperty('display', 'none');
                for(let button of backButtons)
                    button.setAttribute('disabled', 'disabled');
                for(let button of giveButtons)
                    button.removeAttribute('disabled');
            } else {
                readerHeader.style.removeProperty('display');
                reader.style.removeProperty('display');
                bookingDateHeader.style.removeProperty('display');
                bookingDate.style.removeProperty('display');
                for(let button of backButtons)
                    button.removeAttribute('disabled');
                for(let button of giveButtons)
                    button.setAttribute('disabled', 'disabled');
            }
        },
        'PUT',
        `/book/reader/${id}`
    );
}

function callAjaxRequest(id, data, callback, method, url) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200)
            callback(xhr.responseText);
    };
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(data);
}
