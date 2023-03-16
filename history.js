//#################### SELECTORS ####################
const items = document.querySelector(".itemlist");

//#################### EVENTLISTENERS ####################
document.addEventListener('DOMContentLoaded', contentLoaded);

//#################### FUNCTIONS ####################

//Reassigns todo's from local storage that have been ticked to history
function contentLoaded(){
    let todos = getToDos();
    for(let i = 0; i < todos.length; i++){
        if(todos[i].column === "history")insertToColumn(todos[i]);
    }
}

function insertToColumn(todo){

    //Create div
    const toDoDiv = document.createElement("div");
    toDoDiv.classList.add("todoitem");

    //Add todo text
    const todoText = document.createElement("li");
    todoText.classList.add("todotext");
    todoText.innerText = todo.text;
    toDoDiv.appendChild(todoText);

    //Add date of completion
    const todoDate = document.createElement("li");
    todoDate.classList.add("tododate");
    todoDate.innerText = todo.date;
    toDoDiv.appendChild(todoDate);

    items.appendChild(toDoDiv);
}

//Gets the array of todos from local storage
function getToDos(){
    let todos;
    if(localStorage.getItem("todos") === null)todos = [];
    else{
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
}