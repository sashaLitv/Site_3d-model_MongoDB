document.getElementById("close-task-modal").addEventListener("click", function () {
    document.querySelector(".modal").classList.add("hidden");
});


document.getElementById("create-task-modal").addEventListener("click", function () {
    document.querySelector(".modal").classList.remove("hidden");
    
    const taskForm = document.getElementById("taskForm");

    taskForm.addEventListener("submit", async function (e) {
        e.preventDefault(); 
        await createTask();
        loadTasks();
    });

});
async function createTask() {
    const taskData = {
        task_name: document.getElementById("title").value,
        due_date: document.getElementById("date").value,
        importance: document.getElementById("importance").value,
        description: document.getElementById("description").value,
    };

    const token = localStorage.getItem("userToken");
    if (!token) {
        alert("You are not authenticated. Please log in.");
        return;
    }

    const decodedToken = JSON.parse(atob(token.split('.')[1]));  
    taskData.user_id = decodedToken.userId; 

    try {
        const response = await fetch(`/api/tasks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(taskData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
            return;
        }

        alert("Task successfully created!");
        document.querySelector(".modal").classList.add("hidden");
        return true; 
    } catch (error) {
        console.error("Error creating task:", error);
        alert("Failed to create task. Please try again.");
        return false;
    }
}


function openEditTaskModal(task) {
    document.querySelector(".modal").classList.remove("hidden");
    document.getElementById("title").value = task.task_name;
    document.getElementById("date").value = task.due_date.split('T')[0];
    document.getElementById("importance").value = task.importance;
    document.getElementById("description").value = task.description;

    taskForm.addEventListener("submit", async function (e) {
        const taskForm = document.getElementById("taskForm");
        e.preventDefault();
        await updateTask(task._id); 
        loadTasks();
        document.querySelector(".modal").classList.add("hidden");
    });
}
async function updateTask(taskId) {
    const token = localStorage.getItem("userToken");
    const taskData = {
        task_name: document.getElementById("title").value,
        due_date: document.getElementById("date").value,
        importance: document.getElementById("importance").value,
        description: document.getElementById("description").value,
    };

    if (!token) {
        alert("You are not authenticated. Please log in.");
        return;
    }

    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(taskData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        } else {
            alert("Task successfully updated!");
        }
    } catch (error) {
        console.error("Error updating task:", error);
        alert("Failed to update task. Please try again.");
    }
}


async function deleteTask(taskId) {
    const token = localStorage.getItem("userToken");
    if (!token) {
        alert("You are not authenticated. Please log in.");
        return;
    }

    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            alert("Task successfully deleted!");
            loadTasks();
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
    } catch (error) {
        console.error("Error deleting task:", error);
        alert("Failed to delete task. Please try again.");
    }
}


async function markTaskAsCompleted(taskId) {
    const token = localStorage.getItem("userToken");
    if (!token) {
        alert("You are not authenticated. Please log in.");
        return;
    }

    try {
        const response = await fetch(`/api/tasks/${taskId}/completed`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            alert("Task marked!");
            loadTasks();
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
    } catch (error) {
        console.error("Error marking task as completed:", error);
        alert("Failed to mark task as completed. Please try again.");
    }
}



const getUserTasks = async (token) => {
    try {
        const response = await fetch('/api/tasks', {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const textResponse = await response.text();

        if (!response.ok) {
            const errorData = JSON.parse(textResponse);
            console.error("Error response:", errorData);
            return [];
        }

        const tasks = JSON.parse(textResponse); 
        const sortedDay = document.getElementById("planning-date");
        const planningDate = sortedDay ? sortedDay.innerText.replace("Date: ", "") : "-"; 

        if (planningDate === "-") {
            return tasks;
        } else {
            const filteredTasks = tasks.filter(task => {
                const taskDueDate = new Date(task.due_date);
                const formattedTaskDate = `${taskDueDate.getDate().toString().padStart(2, '0')}/${(taskDueDate.getMonth() + 1).toString().padStart(2, '0')}/${taskDueDate.getFullYear()}`;
                return formattedTaskDate === planningDate; 
            });
            return filteredTasks; 
        }
    } catch (error) {
        console.error("Error fetching tasks:", error);
        alert("Failed to fetch tasks. Please try again.");
        return [];
    }
};
const displayTasks = (tasks) => {
    const toDoList = document.getElementById("to-do-list-content");
    const completedList = document.getElementById("completed-list-content");

    toDoList.innerHTML = '';
    completedList.innerHTML = '';

    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        const dueDate = new Date(task.due_date);
        const formattedDate = `${dueDate.getDate().toString().padStart(2, '0')}/${(dueDate.getMonth() + 1).toString().padStart(2, '0')}/${dueDate.getFullYear()}`;
        taskItem.textContent = `${task.task_name} - ${formattedDate} - ${task.importance}`;

        const buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add('actions'); 

        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
        editButton.addEventListener('click', () => openEditTaskModal(task));

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
        deleteButton.addEventListener('click', () => deleteTask(task._id));

        const completeButton = document.createElement('button');
        const icon = document.createElement('i');
        icon.className = task.completed ? 'fa-solid fa-xmark' : 'fa-solid fa-check'; 
        completeButton.appendChild(icon);
        completeButton.addEventListener('click', () => markTaskAsCompleted(task._id));

        buttonsContainer.appendChild(editButton);
        buttonsContainer.appendChild(deleteButton);
        buttonsContainer.appendChild(completeButton);

        taskItem.appendChild(buttonsContainer);

        if (task.completed) {
            completedList.appendChild(taskItem);
        } else {
            toDoList.appendChild(taskItem);
        }
    });
};

async function loadTasks() {
    const token = localStorage.getItem("userToken");

    if (token) {
        const tasks = await getUserTasks(token);
        displayTasks(tasks);
    } else {
        alert("You are not authenticated. Please log in.");
    }
    taskForm.reset(); 
}

window.addEventListener("DOMContentLoaded", async () => {
    loadTasks();
});

