let taskArr = [];
let id = 0;
let isThereTaskToEdit = false;
class Task {
    constructor(text, done = false) {
        this.id = 0;
        this.done = false;
        this.text = text;
        this.id = id;
        this.done = done;
        id++;
    }
    // get id() { return this._id; }
    // get text() { return this._text; }
    // get done() { return this._done; }
    // set id(id) { this._id = id; }
    // set text(txt) { this._text = txt; }
    // set done(d) { this._done = d; }
    toObj() {
        return {
            id: this.id,
            text: this.text,
            done: this.done,
        };
    }
    toHtml() {
        return `
            <div class="todo-row " id = "${this.id}"  >
                <input type = "button" class="todo-cx"
                    style="background: #FFAD33;border: 2px solid #FFAD33"
                    onclick="editTaskStart(${this.id})"
                    value= "&#9998;"/>
                <div class="todo-item ${this.done ? 'done' : ''}"
                    ondblclick="toggleTask(${this.id})" > 
                    ${this.text} 
                </div>
                <input type = "button" class="todo-ok" 
                    onclick="toggleTask(${this.id})" 
                    value= "&#10003;"/>
            </div>`;
    }
}
const taskInput = document.getElementById('todo-item');
const taskSaveBtn = document.getElementById('todo-save');
const todoList = document.getElementById('todo-list');
const todoDelall = document.getElementById('todo-delall');
const todoDelcom = document.getElementById('todo-delcom');
todoDelall.addEventListener('click', deleteAll);
todoDelcom.addEventListener('click', deleteCompleted);
taskSaveBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (!taskInput.value)
        return;
    const newTask = new Task(taskInput.value);
    taskArr.push(newTask);
    addTaskToDom(newTask);
    saveToStorge();
    taskInput.value = '';
});
(() => {
    taskArr = JSON.parse((localStorage.getItem('tasks') || "[]"))
        .map(({ text, done }) => new Task(text, done));
    taskArr.forEach((task) => addTaskToDom(task));
})();
function addTaskToDom(task) {
    todoList.innerHTML += task.toHtml();
}
function saveToStorge() {
    const taskObjArr = taskArr.map((task) => task.toObj());
    localStorage.setItem('tasks', JSON.stringify(taskObjArr));
}
function deleteAll() {
    if (!confirmAlert('delete all ?'))
        return;
    taskArr = [];
    localStorage.setItem('tasks', '');
    todoList.innerHTML = '';
}
function deleteCompleted() {
    if (!confirmAlert('delete completed ?'))
        return;
    taskArr = taskArr.filter((task) => (!task.done || document.getElementById(`${task.id}`).remove()));
    saveToStorge();
}
function editTaskStart(taskId) {
    isThereTaskToEdit = true;
    const taskRow = document.getElementById(`${taskId}`);
    const taskItem = taskRow.children[1];
    taskRow.innerHTML = `
            <input type="text" 
                onblur="editTaskEnd(this)" 
                onkeypress="if(event.key=='Enter'){this.blur()}"
                value="${taskItem.innerHTML.trim()}"/>`;
    taskRow.children[0].focus();
}
function editTaskEnd({ value, parentElement }) {
    const task = taskArr.find((task) => (task.id == parentElement.id));
    task.text = value;
    saveToStorge();
    parentElement.remove();
    addTaskToDom(task);
}
function toggleTask(taskId) {
    const task = taskArr.find((task) => task.id == taskId);
    task.done = !task.done;
    const taskItem = document.getElementById(`${taskId}`).children[1];
    if (task.done)
        taskItem.classList.add('done');
    else
        taskItem.classList.remove('done');
    saveToStorge();
}
function confirmAlert(str = 'Are you sure?') {
    return confirm(str);
}
const body = document.getElementsByTagName('BODY')[0];
body.addEventListener('keydown', ({ key }) => {
    if (isThereTaskToEdit)
        return;
    switch (key) {
        case 'Escape':
            taskInput.value = '';
            taskInput.blur();
            break;
        case 'Delete':
            todoDelcom.click();
            break;
        default:
            taskInput.focus();
    }
});
