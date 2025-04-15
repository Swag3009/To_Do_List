const addTask = document.getElementById("addTask");
const todayDiv = document.getElementById("today");
const dueDiv = document.getElementById("due");
const upcomingDiv = document.getElementById("upcoming");
const searchInput = document.getElementById("search-box");

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const taskList = document.getElementsByClassName("taskDiv");
  Array.from(taskList).forEach((task) => {
    const taskName = task.querySelector(".taskName").textContent.toLowerCase();
    if (taskName.includes(query)) {
      task.style.display = "block";
    } else {
      task.style.display = "none";
    }
  });
});
//localStorage.setItem("tasks", []);
const updateLocalStorage = (task) => {
  const tasks = getDataFromLocalStorage();
  localStorage.setItem("tasks", JSON.stringify([...tasks, task]));
};
const getDataFromLocalStorage = () => {
  const fetchedData = localStorage.getItem("tasks");
  if (fetchedData)
    return JSON.parse(fetchedData).sort((a, b) => {
      let aDate = new Date(a.date);
      let bDate = new Date(b.date);
      return aDate.getTime() - bDate.getTime();
    });
  else return [];
};
const getCurrentDate = () => {
  const today = new Date();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const yyyy = today.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
};

const updateTaskList = (newTask) => {
  if (newTask) updateLocalStorage(newTask);
  const taskList = getDataFromLocalStorage();
  const displayList = {
    today: [],
    due: [],
    upcoming: [],
  };
  let pushDiv;
  const today = new Date(getCurrentDate());
  if (newTask) {
    const taskDate = new Date(newTask.date);

    if (taskDate.getTime() === today.getTime()) {
      pushDiv = todayDiv;
    } else if (taskDate.getTime() < today.getTime()) {
      pushDiv = dueDiv;
    } else {
      pushDiv = upcomingDiv;
    }
  } else {
    taskList.forEach((task) => {
      const taskDate = new Date(task.date);
      if (taskDate.getTime() === today.getTime()) {
        displayList.today.push(task);
      } else if (taskDate.getTime() < today.getTime()) {
        displayList.due.push(task);
      } else {
        displayList.upcoming.push(task);
      }
    });
  }

  return { displayList, pushDiv };
};

const deleteTask = (task) => {
  const taskName = task.querySelector(".taskName");
  let taskList = getDataFromLocalStorage();
  const newTaskList = taskList.filter(
    (item) => item.taskName !== taskName.innerHTML,
  );
  localStorage.setItem("tasks", JSON.stringify(newTaskList));
  task.remove();
};
const htmlEditField = () => {
  const container = document.getElementsByClassName("container")[0];
  const div = document.createElement("div");
  div.className = "editField";
  div.style.display = "none";
  const input = document.createElement("input");
  input.setAttribute("type", "text");
  const date = document.createElement("h2");
  div.append(date, input);
  container.append(div);
  return div;
};
const editTask = (task, taskObj) => {
  const editFieldDiv = htmlEditField();
  const taskName = task.querySelector(".taskName");
  const taskDate = taskObj.date;

  const header = editFieldDiv.querySelector("h2");
  const editField = editFieldDiv.querySelector("input");
  editField.value = taskName.innerHTML;
  header.innerHTML = taskDate;
  editFieldDiv.style.display = "block";
  editField.addEventListener("blur", () => {
    //change in local storage
    let taskList = getDataFromLocalStorage();
    const newTaskList = taskList.map((item) => {
      if (
        item.taskName === taskName.innerHTML &&
        item.date === taskDate &&
        item.time === taskObj.time
      ) {
        item.taskName = editField.value;
      }
      return item;
    });
    localStorage.setItem("tasks", JSON.stringify(newTaskList));
    taskName.textContent = editField.value;
    editFieldDiv.remove();
  });
};
const updateDisplay = (newTask = null) => {
  const insertBtn = (div, task) => {
    const buttonContainer = document.createElement("div");
    const editButton = document.createElement("button");
    const deleteButton = document.createElement("button");
    buttonContainer.className = "buttonContainer";
    editButton.className = "edit";
    deleteButton.className = "delete";
    editButton.innerHTML = "Edit";
    deleteButton.innerHTML = "Delete";
    buttonContainer.append(editButton, deleteButton);
    deleteButton.addEventListener("click", () => {
      deleteTask(div);
    });
    editButton.addEventListener("click", () => {
      editTask(div, task);
    });
    div.append(buttonContainer);
  };

  const { displayList, pushDiv } = updateTaskList(newTask);
  const { today, due, upcoming } = displayList;
  if (newTask) {
    pushDiv.style.display = "block";
    const taskDiv = document.createElement("div");
    taskDiv.className = "taskDiv";
    taskDiv.innerHTML = `<h4>${newTask.date}</h4><p class="taskName">${newTask.taskName}</p><p>${newTask.time}</p>`;
    pushDiv.append(taskDiv);
    insertBtn(taskDiv, newTask);
  } else {
    if (today.length > 0) {
      todayDiv.style.display = "block";
      today.forEach((task) => {
        const taskDiv = document.createElement("div");
        taskDiv.className = "taskDiv";
        taskDiv.innerHTML = `<h4>${task.date}</h4><p class="taskName">${task.taskName}</p><p>${task.time}</p>`;
        todayDiv.append(taskDiv);
        insertBtn(taskDiv, task);
      });
    }
    if (due.length > 0) {
      dueDiv.style.display = "block";
      due.forEach((task) => {
        const taskDiv = document.createElement("div");
        taskDiv.className = "taskDiv";
        taskDiv.innerHTML = `<h4>${task.date}</h4><p class="taskName">${task.taskName}</p><p>${task.time}</p>`;
        dueDiv.append(taskDiv);
        insertBtn(taskDiv, task);
      });
    }
    if (upcoming.length > 0) {
      upcomingDiv.style.display = "block";
      upcoming.forEach((task) => {
        const taskDiv = document.createElement("div");
        taskDiv.className = "taskDiv";
        taskDiv.innerHTML = `<div class = "taskDetails"><h4>${task.date}</h4><p class="taskName">${task.taskName}</p><p>${task.time}</p><div>`;
        upcomingDiv.append(taskDiv);
        insertBtn(taskDiv, task);
      });
    }
  }
};
updateDisplay();

addTask.addEventListener("click", (event) => {
  const taskName = document.getElementById("text");
  const date = document.getElementById("date");
  const time = document.getElementById("time");
  let isFieldFilled = taskName.value && date.value && time.value;
  if (!isFieldFilled) {
    // Display modal
    const modal = document.getElementById("modal");
    modal.style.display = "block";
    const okBtn = document.getElementById("ok");
    okBtn.addEventListener("click", (event) => {
      modal.style.display = "none";
    });
  } else {
    updateDisplay({
      taskName: taskName.value,
      date: date.value,
      time: time.value,
    });
    taskName.value = "";
    date.value = "";
    time.value = "";
  }
});
