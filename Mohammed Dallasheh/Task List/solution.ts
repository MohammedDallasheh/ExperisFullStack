
let taskArr: Array<Task> = [];
let id: number = 0;
let isThereTaskToEdit: boolean = false

class Task {
    public id: number = 0;
    public text: string;
    public done: boolean = false;
    constructor(text: string, done: boolean = false) {
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
    toObj(): object {
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
            </div>`
    }

}

const taskInput = <HTMLInputElement>document.getElementById('todo-item');
const taskSaveBtn = <HTMLInputElement>document.getElementById('todo-save');
const todoList = <HTMLInputElement>document.getElementById('todo-list');
const todoDelall = <HTMLInputElement>document.getElementById('todo-delall');
const todoDelcom = <HTMLInputElement>document.getElementById('todo-delcom')

todoDelall.addEventListener('click', deleteAll);
todoDelcom.addEventListener('click', deleteCompleted);

taskSaveBtn.addEventListener('click', (e: MouseEvent): void => {
    e.preventDefault();
    if (!taskInput.value) return
    const newTask: Task = new Task(taskInput.value);
    taskArr.push(newTask);
    addTaskToDom(newTask);
    saveToStorge();
    taskInput.value = '';
});


(() => {
    taskArr = JSON.parse((localStorage.getItem('tasks') || "[]"))
        .map(({ text, done }): Task => new Task(text, done));
    taskArr.forEach((task: Task): void => addTaskToDom(task));
})();

function addTaskToDom(task: Task): void {
    todoList.innerHTML += task.toHtml()
}

function saveToStorge(): void {
    const taskObjArr: object[] =
        taskArr.map((task: Task): object => task.toObj());
    localStorage.setItem('tasks', JSON.stringify(taskObjArr));
}
function deleteAll(): void {
    if (!confirmAlert('delete all ?')) return
    taskArr = [];
    localStorage.setItem('tasks', '');
    todoList.innerHTML = '';
}

function deleteCompleted(): void {
    if (!confirmAlert('delete completed ?')) return
    taskArr = taskArr.filter((task: Task) => (
        !task.done || document.getElementById(`${task.id}`).remove()
    ));
    saveToStorge();
}
function editTaskStart(taskId: number): void {
    isThereTaskToEdit = true
    const taskRow = <HTMLInputElement>document.getElementById(`${taskId}`)
    const taskItem = <HTMLInputElement>taskRow.children[1]
    taskRow.innerHTML = `
            <input type="text" 
                onblur="editTaskEnd(this)" 
                onkeypress="if(event.key=='Enter'){this.blur()}"
                value="${taskItem.innerHTML.trim()}"/>`;

    (<HTMLInputElement>taskRow.children[0]).focus()
}

function editTaskEnd({ value, parentElement }) {
    const task = taskArr.find((task: Task): boolean =>
        (task.id == parentElement.id)
    );
    task.text = value;
    saveToStorge();
    parentElement.remove()
    addTaskToDom(task)
}

function toggleTask(taskId: number): void {
    const task =
        taskArr.find((task: Task): boolean => task.id == taskId)

    task.done = !task.done;
    const taskItem = document.getElementById(`${taskId}`).children[1];
    if (task.done)
        taskItem.classList.add('done');
    else
        taskItem.classList.remove('done');

    saveToStorge();
}
function confirmAlert(str: string = 'Are you sure?'): boolean {
    return confirm(str)
}
const body = <HTMLInputElement>document.getElementsByTagName('BODY')[0]
body.addEventListener('keydown', ({ key }): void => {
    if (isThereTaskToEdit) return
    switch (key) {
        case 'Escape':
            taskInput.value = ''
            taskInput.blur()
            break;
        case 'Delete':
            todoDelcom.click();
            break;
        default:
            taskInput.focus()
    }
})
