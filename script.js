const entry = document.querySelector('.entry form');
const list = document.querySelector('.list');
const taskList = document.querySelector('.task_list');
const fallback = document.querySelector('.fallback');

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', "Aug", 'Sep', 'Oct', 'Nov', 'Dec'];

const getTasks = () => JSON.parse(localStorage.getItem('tasks'));

const refreshList = () => {
    if(getTasks().length) {
        taskList.style.display = 'block';
        fallback.style.display = 'none';
    } else {
        taskList.style.display = 'none';
        fallback.style.display = 'block';
    }
}

const addFunctions = (el) => {
    el.querySelector('input').onchange = () => {
        const tasks = getTasks();
        const elID = el.getAttribute('data-id');
        tasks[elID].done = !tasks[elID].done;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        tasks[elID].done ? el.className = 'task done' : el.className = 'task';
    }
}

const renderTask = (id, title, desc, date, done) => {
    const taskEl = document.createElement('details');
    taskEl.className = done ? 'task done' : 'task';
    taskEl.setAttribute('data-id', id);
    taskEl.innerHTML = 
    `<summary>
    <span>${title}</span>
    <label for="${id}">Done <input class="done" type="checkbox" role="checkbox" tabindex="1" name="done" id="${id}"></label>
    </summary>
    <p class="date">${date}</p>
    <p>${desc}</p>`;
    taskEl.querySelector('input').checked = done;
    addFunctions(taskEl);
    taskList.appendChild(taskEl);
}

const fetchTasks = () => {
    let tasks;
    if(getTasks() == null) {
        localStorage.setItem('tasks', JSON.stringify([]));
        tasks = [];
    } else {
        tasks = getTasks();
        tasks.forEach(task => {
            renderTask(task.id, task.title, task.desc, task.date, task.done);
        });
    }
    refreshList();
}
fetchTasks();

const addTask = (title, desc, id) => {
    const date = new Date().toLocaleString();
    const task = {id, title, desc, date, done: false};
    localStorage.setItem('tasks', JSON.stringify([...getTasks(), task]));
    renderTask(id, title, desc, date, false);
}

const submitEntry = (ev) => {
    ev.preventDefault();
    const title = document.querySelector('#entry_title').value;
    const desc = document.querySelector('#entry_desc').value;
    let taskID;
    if(localStorage.getItem('taskID') == null) {
        localStorage.setItem('taskID', 0);
        taskID = localStorage.getItem('taskID');
    } else {
        taskID = localStorage.getItem('taskID');
    }
    addTask(title, desc, taskID);
    taskID++;
    localStorage.setItem('taskID', taskID);
    taskID = localStorage.getItem('taskID');
    location.reload();
}

entry.onsubmit = submitEntry;

const filter = document.querySelector('#filter');
const forgetAllBtn = document.querySelector('.forget_all');

const listChildren = [];
taskList.childNodes.forEach(el => listChildren.push(el));
filter.onchange = (ev) => {
    let taskCopies = [...listChildren];
    let filtered;
    if(ev.target.value == 'done') {
        filtered = taskCopies.filter(el => el.className == 'task done');
    } else if(ev.target.value == 'not_done') {
        filtered = taskCopies.filter(el => el.className == 'task');
    } else {
        filtered = taskCopies;
    }
    taskList.innerHTML = '';
    filtered.forEach(el => taskList.appendChild(el));
};

forgetAllBtn.onclick = () => {
    if(getTasks().length) {
        const confirmForget = confirm('DO YOU WANT TO FORGET ALL THE TASKS?');
        confirmForget && localStorage.clear();
        fetchTasks();
        location.reload();
    }
}