//#################### SELECTORS ####################
const input = document.querySelector(".add");
const addButton = document.querySelector(".addbutton");
const todoColumn = document.querySelector(".todocolumn");
const inprogressColumn = document.querySelector(".inprogresscolumn");
const doneColumn = document.querySelector(".donecolumn");
const items = document.querySelectorAll(".todoitem");
const columns = document.querySelectorAll(".column");
let dragItem = null;

//#################### EVENTLISTENERS ####################
    document.addEventListener('DOMContentLoaded', contentLoaded);
    addButton.addEventListener('click', addToDo);
    items.forEach(item => {
        item.addEventListener('click', buttonClick);
        item.addEventListener('mouseover', onhover);
        item.addEventListener('mouseout', onout);
        item.addEventListener('dragstart', dragStart);
        item.addEventListener('dragend', dragEnd);
    });
    columns.forEach(column =>{
        column.addEventListener('dragover', dragOver);
        column.addEventListener('drop', dragDrop);
    });

//#################### FUNCTIONS ####################

//Adds a todo element
function addToDo(event){
    event.preventDefault();

    let todos = getToDos();
    let deleteIndex = todos.findIndex(element => element.text === input.value && element.column !== "history");
    if(input.value != "" && deleteIndex == -1){

        //Create div & add todo text
        const toDoDiv = document.createElement("div");
        toDoDiv.classList.add("todoitem");
        toDoDiv.setAttribute("draggable", "true");
        toDoDiv.innerText = input.value;

        //Create buttons div
        const buttonsDiv = document.createElement("div");
        buttonsDiv.classList.add("buttons");

        //Create trash button
        const newButton = document.createElement("button");
        newButton.innerHTML = '<i class="fa-sharp fa-solid fa-trash-can"></i>';
        newButton.classList.add("trash");
        buttonsDiv.appendChild(newButton);
        toDoDiv.appendChild(buttonsDiv);

        //Add event listeners to new todo item
        toDoDiv.addEventListener('click', buttonClick);
        toDoDiv.addEventListener('mouseover', onhover);
        toDoDiv.addEventListener('mouseout', onout);
        toDoDiv.addEventListener('dragstart', dragStart);
        toDoDiv.addEventListener('dragend', dragEnd);

        //Add to todo list & to local storage
        todoColumn.appendChild(toDoDiv);
        saveToLocal(toDoDiv, "todocolumn");
    }
    input.value = "";
}

//Updates a todo element either by deleting it or by dragging it
function buttonClick(event){
    const item = event.target.parentElement.parentElement;

    if(event.target.classList[0] === 'trash'){
        deleteFromLocal(item.innerText);
        item.style.transition = 'all 0.3s ease';
        item.classList.add("fall");
        item.addEventListener("transitionend", function(){
            item.remove();
        });
    }else if (event.target.classList[0] === 'tick'){
        uploadToHistory(item.innerText);
        deleteFromLocal(item.innerText);
        item.style.transition = 'all 0.3s ease';
        item.classList.add("swipe");
        item.addEventListener("transitionend", function(){
            item.remove();
        });
    }
}

//Updates the style of the todo element when hovering over
function onhover(event){
    const item = event.target;

    if(item.classList[0] === "todoitem"){
        const tick = item.lastChild.childNodes[0];
        const trash = item.lastChild.lastChild;
        item.style.backgroundColor = "#d2e4f3";
        trash.style.backgroundColor = "#d2e4f3";
        trash.style.transition = 'none';
        tick.style.backgroundColor = "#d2e4f3";
        tick.style.transition = 'none';
    }else if(item.classList[0] === "trash"){
        item.style.backgroundColor = "#ff000099";
        item.style.color = "white";
    }else if(item.classList[0] === "tick"){
        item.style.backgroundColor = "#03c06299";
        item.style.color = "white";
    }
}

//Updates the style of the todo element when hovering out
function onout(event){
    const item = event.target;

    if(item.classList[0] === "todoitem"){
        const tick = item.lastChild.childNodes[0];
        const trash = item.lastChild.lastChild;
        item.style.backgroundColor = "white";
        trash.style.backgroundColor = "white";
        tick.style.backgroundColor = "white";
    }
    else if(item.classList[0] === "trash"){
        item.style.backgroundColor = "white";
        item.style.color = "#ff000099";
        item.style.transition = 'all 0.3s ease';
    }
    else if(item.classList[0] === "tick"){
        item.style.backgroundColor = "white";
        item.style.color = "#03c06299";
        item.style.transition = 'all 0.3s ease'
    }
}

//Start of the drag
function dragStart(event){
    dragItem = event.target;
    //setTimeout(() => event.target.className = 'invisible', 0)
}

//End of the drag
function dragEnd(){
    if(dragItem !== null){
        dragItem.className = "todoitem";
        dragItem.style.backgroundColor = "white";
        dragItem.lastChild.lastChild.style.backgroundColor = "white";
        if(dragItem.lastChild.childNodes.length === 2)dragItem.lastChild.firstChild.style.backgroundColor = "white";
        this.parentElement.appendChild(dragItem);
        dragItem = null;
    }
}

//Dragging over a column preventing default
function dragOver(event) {
    event.preventDefault();
}

//Dropping the dragged element
function dragDrop() {
    dragItem.className = "todoitem";
    dragItem.style.backgroundColor = "white";
    dragItem.lastChild.lastChild.style.backgroundColor = "white";
    if(this.classList[0] === "donecolumn" && dragItem.childNodes.length === 2){
        //Create tick button & add it at the second position
        const tickButton = document.createElement("button");
        tickButton.innerHTML = '<i class="fa-sharp fa-solid fa-square-check"></i>';
        tickButton.classList.add("tick");
        dragItem.lastChild.insertBefore(tickButton, dragItem.lastChild.childNodes[0]);

    }else if(this.classList[0] !== "donecolumn" && dragItem.lastChild.childNodes.length === 2){
        dragItem.lastChild.childNodes[0].remove();
    }
    deleteFromLocal(dragItem.innerText);
    this.appendChild(dragItem);
    saveToLocal(dragItem, this.classList[0]);
    dragItem = null;
}

//Saves an element to local storage
function saveToLocal(todo, column){
    let todos = getToDos();
    let todoObj = {"text": todo.innerText, "column": column};
    todos.push(todoObj);

    localStorage.setItem("todos", JSON.stringify(todos));
}

//Deletes an element from local storage
function deleteFromLocal(todo){
    let todos = getToDos();

    let deleteIndex = todos.findIndex(element => element.text === todo && element.column !== "history"); 
    todos.splice(deleteIndex, 1);
    localStorage.setItem("todos", JSON.stringify(todos));
}

//Reassigns todo's from local storage to their respective columns
function contentLoaded(){
    let todos = getToDos();
    if(todos !== []){
        for(let i = 0; i < todos.length; i++){
            if(todos[i].column !== "history")insertToColumn(todos[i]);
        }
    }
}

//Inserts a todo to it's respective column
function insertToColumn(todo){

    //Create div with it's correspondent value
    const toDoDiv = document.createElement("div");
    toDoDiv.classList.add("todoitem");
    toDoDiv.setAttribute("draggable", "true");
    toDoDiv.innerText = todo.text;

    //Create buttons div
    const buttonsDiv = document.createElement("div");
    buttonsDiv.classList.add("buttons");

    //Create tick button
    const tickButton = document.createElement("button");
    tickButton.innerHTML = '<i class="fa-sharp fa-solid fa-square-check"></i>';
    tickButton.classList.add("tick");

    //Create trash button
    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fa-sharp fa-solid fa-trash-can"></i>';
    trashButton.classList.add("trash");

    //Add to appropriate list
    if(todo.column === "donecolumn"){
        buttonsDiv.appendChild(tickButton);
        buttonsDiv.appendChild(trashButton);
        toDoDiv.appendChild(buttonsDiv);
        toDoDiv.addEventListener('click', buttonClick);
        toDoDiv.addEventListener('mouseover', onhover);
        toDoDiv.addEventListener('mouseout', onout);
        toDoDiv.addEventListener('dragstart', dragStart);
        toDoDiv.addEventListener('dragend', dragEnd);
        doneColumn.appendChild(toDoDiv);
    }else if(todo.column === "inprogresscolumn"){
        buttonsDiv.appendChild(trashButton);
        toDoDiv.appendChild(buttonsDiv);
        toDoDiv.addEventListener('click', buttonClick);
        toDoDiv.addEventListener('mouseover', onhover);
        toDoDiv.addEventListener('mouseout', onout);
        toDoDiv.addEventListener('dragstart', dragStart);
        toDoDiv.addEventListener('dragend', dragEnd);
        inprogressColumn.appendChild(toDoDiv);
    }else if(todo.column === "todocolumn"){
        buttonsDiv.appendChild(trashButton);
        toDoDiv.appendChild(buttonsDiv)
        toDoDiv.addEventListener('click', buttonClick);
        toDoDiv.addEventListener('mouseover', onhover);
        toDoDiv.addEventListener('mouseout', onout);
        toDoDiv.addEventListener('dragstart', dragStart);
        toDoDiv.addEventListener('dragend', dragEnd);
        todoColumn.appendChild(toDoDiv);
    }
    
}

//Uploads an element in the completed column to history
function uploadToHistory(todo){
    let todos = getToDos();

    let today = new Date(); 
    let timestamp = ("0" + today.getDate()).slice(-2)+"/"+("0" + (today.getMonth()+1)).slice(-2)+"/"+("0" + today.getFullYear()).slice(-2)+" "+("0" + today.getHours()).slice(-2)+":"+("0" + today.getMinutes()).slice(-2)+":"+("0" + today.getSeconds()).slice(-2);
    let todoObj = {"text": todo, "date": timestamp, column:"history"};

    todos.push(todoObj);
    localStorage.setItem("todos", JSON.stringify(todos));
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