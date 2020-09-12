const bookList = document.querySelector("#book-list");
const form = document.querySelector("#add-book-form");

//*************************** create elements and render the library ***************************
function renderBook(doc){
    let li = document.createElement("li");
    let title = document.createElement("span");
    let author = document.createElement("span");
    let length = document.createElement("span");
    let status = document.createElement("span");
    let deleteBtn = document.createElement("div");
    let editBtn = document.createElement("div");
    
    // setting the unique ID on the DB to edit/delete on the DOM
    li.setAttribute("data-id", doc.id); 

    editBtn.classList.add("edit");

    title.textContent = doc.data().title;
    author.textContent = doc.data().author;
    length.textContent = `${doc.data().length} pages`;
    if (doc.data().status === true) {
        status.textContent = "read"
    } else status.textContent = "unread"
    deleteBtn.textContent = "x";
    editBtn.textContent = "e";

    li.appendChild(title);
    li.appendChild(author);
    li.appendChild(length);
    li.appendChild(status);
    li.appendChild(deleteBtn);
    li.appendChild(editBtn);

    bookList.appendChild(li);

    //*************************** deleting Data on the DB ***************************
    deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute("data-id");
        database.collection("books").doc(id).delete();
    })

    //*************************** editing and updating Data ***************************
    editBtn.addEventListener("click", updateBook)

    function updateBook(e){
        e.stopPropagation();
        let promptedStatus = confirm("Did you finish reading this book?")
        let id = e.target.parentElement.getAttribute("data-id");
        database.collection("books").doc(id).update({
            status: promptedStatus
        })
    } 

}//end of renderBook function

// //getting data from the DB
// database.collection("books").get().then((snapshot) => {
//     //console.log(snapshot.docs)
//     snapshot.docs.forEach(doc => {
//         //console.log(doc.data())
//         renderBook(doc);
//     })
// })

// *************************** Saving data on the DB ***************************
form.addEventListener("submit", (e) => {
    e.preventDefault();
    database.collection("books").add({
        title: form.title.value,
        author: form.author.value,
        length: form.length.value,
        status: form.read.checked,
    })
    form.title.value = "";
    form.author.value = "";
    form.length.value = "";
    form.read.checked = true;
})


// *************************** Real Time updates on the DB/DOM ***************************
database.collection("books").onSnapshot(snapshot => {
    let changes = snapshot.docChanges()
    changes.forEach(change => {
        if (change.type == "added") {
            renderBook(change.doc);
        } else if (change.type == "removed"){
            let li = document.querySelector(`[data-id = ${change.doc.id}]`);
            bookList.removeChild(li);
        } else if (change.type == "modified"){
            let li = document.querySelector(`[data-id = ${change.doc.id}]`);
            li.children[3].textContent = change.doc.data().status;
        }
    })
})

