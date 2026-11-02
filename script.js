const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const totalTasks = document.getElementById('totalTasks');
const pendingTasks = document.getElementById('pendingTasks');
const completedTasks = document.getElementById('completedTasks');
const deletedTasks = document.getElementById('deletedTasks');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const message = document.getElementById('message');
const currentDate = document.getElementById('currentDate');
let deletedTaskCount = 0;

addTaskBtn.addEventListener('click', addTask);
clearCompletedBtn.addEventListener('click', clearCompletedTasks);

function formatTaskText(text) {
    const normalized = text.toLowerCase();
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') {
        showMessage('Please enter a task.', 'error');
        return;
    }

    const taskExists = Array.from(taskList.querySelectorAll('.taskText'))
        .some(task => task.textContent.toLowerCase() === taskText.toLowerCase());

    if (taskExists) {
        showMessage('This task already exists.', 'error');
        return;
    }

    const taskItem = document.createElement('div');
    taskItem.className = 'taskItem';
    const taskTextElement = document.createElement('span');
    taskTextElement.className = 'taskText';
    taskTextElement.textContent = formatTaskText(taskText);

    const statusElement = document.createElement('span');
    statusElement.className = 'taskStatus';
    statusElement.textContent = 'Pending';

    const timestampElement = document.createElement('span');
    timestampElement.className = 'taskTimestamp';
    timestampElement.textContent = formatTimestamp(new Date());

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'deleteBtn';
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';

    taskItem.append(taskTextElement, statusElement, timestampElement, deleteBtn);
    taskList.prepend(taskItem);
    taskInput.value = '';

    taskTextElement.addEventListener('click', () => {
        taskItem.classList.toggle('completed');
        updateTaskTimestamp(taskItem);
        updateTaskCounts();
    });

    deleteBtn.addEventListener('click', () => deleteTask(taskItem));

    updateTaskCounts();
    showMessage('Task added successfully!', 'success');
}

taskInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        addTask();
    }
});

function formatTimestamp(date) {
    return date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
}

function updateTaskTimestamp(taskItem) {
    const isCompleted = taskItem.classList.contains('completed');
    taskItem.querySelector('.taskStatus').textContent = isCompleted ? 'Completed' : 'Pending';
    taskItem.querySelector('.taskTimestamp').textContent = formatTimestamp(new Date());
}

function deleteTask(taskItem) {
    taskItem.remove();
    deletedTaskCount++;
    updateTaskCounts();
    showMessage('Task deleted successfully!', 'success');
}

function clearCompletedTasks() {
    const completedTasksList = taskList.querySelectorAll('.taskItem.completed');
    if (completedTasksList.length === 0) {
        showMessage('No completed tasks to clear.', 'error');
        return;
    }

    deletedTaskCount += completedTasksList.length;
    completedTasksList.forEach(task => task.remove());
    updateTaskCounts();
    showMessage('Completed tasks cleared successfully!', 'success');
}

function updateTaskCounts() {
    const total = taskList.getElementsByClassName('taskItem').length;
    const completed = taskList.getElementsByClassName('completed').length;
    const pending = total - completed;
    totalTasks.textContent = `Total Tasks: ${total}`;
    pendingTasks.textContent = `Pending Tasks: ${pending}`;
    completedTasks.textContent = `Completed Tasks: ${completed}`;
    deletedTasks.textContent = `Deleted Tasks: ${deletedTaskCount}`;
}

function showMessage(text, type) {
    message.textContent = text;
    message.className = `message ${type}`;
}

const today = new Date();
currentDate.textContent = today.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});

updateTaskCounts();
