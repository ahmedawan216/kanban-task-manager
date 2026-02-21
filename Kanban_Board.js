let taskData = {};

const todo = document.querySelector('#todo');
const progress = document.querySelector('#Progress');
const done = document.querySelector('#done');
let dragElement = null;

// Unified function to update counts and save data (Keeping your logic)
function updateAndSave() {
    [todo, progress, done].forEach(col => {
        const tasks = col.querySelectorAll('.task');
        const count = col.querySelector('.right');
        
        taskData[col.id] = Array.from(tasks).map(t => {
            return {
                title: t.querySelector('h2').innerText,
                desc: t.querySelector('p').innerText
            }
        });

        if (count) count.innerText = tasks.length;
    });
    // Save the data object using a single consistent key
    localStorage.setItem("kanbanTasks", JSON.stringify(taskData));
}

// Fixed Load Logic
if (localStorage.getItem("kanbanTasks")) {
    const data = JSON.parse(localStorage.getItem("kanbanTasks"));

    for (const col in data) {
        const column = document.querySelector(`#${col}`);
        data[col].forEach(task => {
            const div = document.createElement("div");
            div.classList.add("task");
            div.setAttribute("draggable", "true");
            div.innerHTML = `
                <h2>${task.title}</h2>
                <p>${task.desc}</p>
                <button class="delete-btn">Delete</button>
            `;
            column.appendChild(div);

            // Adding all necessary listeners to loaded tasks
            div.addEventListener("dragstart", () => {
                dragElement = div;
                setTimeout(() => div.classList.add("dragging"), 0);
            });
            div.addEventListener("dragend", () => {
                div.classList.remove("dragging");
            });
            div.querySelector('.delete-btn').addEventListener('click', () => {
                div.remove();
                updateAndSave();
            });
        });
    }
}

// Keeping your initial tasks listener for any hardcoded HTML tasks
document.querySelectorAll('.task').forEach(task => {
    task.addEventListener("dragstart", () => {
        dragElement = task;
        setTimeout(() => task.classList.add("dragging"), 0);
    });
    task.addEventListener("dragend", () => {
        task.classList.remove("dragging");
    });
});

function addDragAndDropEvents(column) {
    column.addEventListener("dragenter", (e) => {
        e.preventDefault();
        column.classList.add("hover-over");
    });

    column.addEventListener("dragleave", (e) => {
        e.preventDefault();
        column.classList.remove("hover-over");
    });

    column.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    column.addEventListener("drop", (e) => {
        e.preventDefault();
        if (dragElement) {
            column.appendChild(dragElement);
        }
        column.classList.remove("hover-over");
        updateAndSave(); // Call unified save function
    });
}

addDragAndDropEvents(todo);
addDragAndDropEvents(progress);
addDragAndDropEvents(done);

// modal related code
const togalModalBtn = document.querySelector('#toggle-modal');
const modal = document.querySelector('.modal');
const modalBG = document.querySelector('.modal .bg');
const addTaskBtn = document.querySelector('#add-new-task');

togalModalBtn.addEventListener("click", () => {
    modal.classList.toggle("active");
});

modalBG.addEventListener("click", () => {
    modal.classList.remove("active");
});

addTaskBtn.addEventListener("click", () => {
    const taskTitle = document.querySelector('#task-title-input').value;
    const taskDetails = document.querySelector('#task-area-input').value;

    const div = document.createElement("div");
    div.classList.add("task");
    div.setAttribute("draggable", "true");
    div.innerHTML = `
       <h2>${taskTitle}</h2>
       <p>${taskDetails}</p>
       <button class="delete-btn">Delete</button>
    `;

    todo.appendChild(div);

    // Add listeners to new task
    div.addEventListener("dragstart", () => {
        dragElement = div;
        setTimeout(() => div.classList.add("dragging"), 0);
    });
    div.addEventListener("dragend", () => {
        div.classList.remove("dragging");
    });
    div.querySelector('.delete-btn').addEventListener('click', () => {
        div.remove();
        updateAndSave();
    });

    updateAndSave(); // Save state
    
    // Clear inputs
    document.querySelector('#task-title-input').value = "";
    document.querySelector('#task-area-input').value = "";
    modal.classList.remove("active");
});