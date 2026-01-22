const taskInput = document.getElementById("taskInput");
const dueDate = document.getElementById("dueDate");
const taskList = document.getElementById("taskList");
const addBtn = document.getElementById("addBtn");
const themeToggle = document.getElementById("themeToggle");
const priority = document.getElementById("priority");
const tag = document.getElementById("tag");
const progressBar = document.getElementById("progressBar");
const emptyMessage = document.getElementById("emptyMessage");

let themeIndex = Number(localStorage.getItem("theme")) || 0;
document.body.className = "theme-" + themeIndex;

themeToggle.addEventListener("click", () => {
    themeIndex = (themeIndex + 1) % 10;
    document.body.className = "theme-" + themeIndex;
    localStorage.setItem("theme", themeIndex);
});

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function save() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    render();
}

function addTask() {
    if (taskInput.value.trim() === "") {
    Swal.fire({
        icon: "warning",
        title: "Empty Task",
        text: "Please write a task before adding 😊",
        confirmButtonColor: "#6366f1"
    });
    return;
}

    tasks.push({
        text: taskInput.value,
        due: dueDate.value,
        completed: false,
        priority: priority.value,
        tag: tag.value
    });
    taskInput.value = "";
    dueDate.value = "";
    save();
    Swal.fire({
    icon: "success",
    title: "Task Added!",
    showConfirmButton: false,
    timer: 1000
});

}

function toggleTask(i) {
    tasks[i].completed = !tasks[i].completed;
    save();

    if(tasks[i].completed){
        Swal.fire({
            icon: "success",
            title: "Task Completed 🎉",
            showConfirmButton: false,
            timer: 800
        });
    }
}


function deleteTask(i) {
    Swal.fire({
        title: "Are you sure?",
        text: "This task will be deleted permanently!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, delete it"
    }).then((result) => {
        if (result.isConfirmed) {
            tasks.splice(i, 1);
            save();

            Swal.fire({
                icon: "success",
                title: "Deleted!",
                showConfirmButton: false,
                timer: 1000
            });
        }
    });
}


function editTask(i) {
    Swal.fire({
        title: "Edit Task",
        input: "text",
        inputValue: tasks[i].text,
        showCancelButton: true,
        confirmButtonText: "Update",
        confirmButtonColor: "#22c55e"
    }).then((result) => {
        if (result.isConfirmed && result.value.trim() !== "") {
            tasks[i].text = result.value;
            save();

            Swal.fire({
                icon: "success",
                title: "Task Updated!",
                showConfirmButton: false,
                timer: 1000
            });
        }
    });
}


function render() {
    taskList.innerHTML = "";
    if (tasks.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }

    tasks.forEach((t, i) => {
        const li = document.createElement("li");
        li.className = t.completed ? "completed" : "";
        li.classList.add(`priority-${t.priority}`);
        li.innerHTML = `
            <div class="task-info">
                <strong>${t.text}</strong> 
                <span class="tag">${t.tag}</span> 
                <span class="due">${t.due ? "📅 " + t.due : "⏳ No Due Date"}</span>

            </div>
<div class="actions">
    <input type="checkbox" ${t.completed ? "checked" : ""} onclick="toggleTask(${i})">
    <span title="Edit Task" onclick="editTask(${i})">✏️</span>
    <span title="Delete Task" onclick="deleteTask(${i})">🗑️</span>
</div>

        `;
        taskList.appendChild(li);
    });

    
    const done = tasks.filter(t => t.completed).length;
    progressBar.style.width = tasks.length ? (done / tasks.length * 100) + "%" : "0%";

    document.getElementById("taskCount").innerText =
    `Completed ${done} of ${tasks.length} tasks`;

}

addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => { if (e.key === "Enter") addTask(); });
render();
