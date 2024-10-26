function loadTasksList() {
    const tasksList = getTasksListFromLocalStorage()
    
    displayTasks(tasksList)
}
loadTasksList()





function AddTask() {
    const valid = validation()
    if (!valid) return

    const task = getTask()

    const tasksList = getTasksListFromLocalStorage()

    tasksList.push(task)

    saveTasksListToLocalStorage(tasksList)

    displayTasks(tasksList)

    addFadeInClass()

    ClearValues()


}


function validation() {

    let DataMission = document.getElementById("DataMission")
    let TimeMission = document.getElementById("TimeMission")
    let DateMission = document.getElementById("DateMission")

    let Data = DataMission.value
    let Time = TimeMission.value
    let Date = DateMission.value

    let DataErr = document.getElementById("DataErr")
    let TimeErr = document.getElementById("TimeErr")
    let DateErr = document.getElementById("DateErr")

    DataErr.innerText = " "
    TimeErr.innerText = " "
    DateErr.innerText = " "


    if(Data ==! " ") {
        event.preventDefault() 
        DataErr.innerText = "Invaild Data"
        DataMission.focus()
        return
    }

    if(Time ==! " ") {
        event.preventDefault() 
        TimeErr.innerText = "Invaild Time"
        TimeMission.focus()
        return
    } 

    if(Date ==! " ") {
        event.preventDefault() 
        DateErr.innerText = "Invaild Date"
        DateMission.focus()
        return
    }

     return true
}
            
            
function getTask() {

                let DataMission = document.getElementById("DataMission")
                let TimeMission = document.getElementById("TimeMission")
                let DateMission = document.getElementById("DateMission")

                let Data = DataMission.value
                let Time = TimeMission.value
    let Date = DateMission.value

                    const task = {
                        Data,
                        Time,
                        Date
                    }
                return task
}


function getTasksListFromLocalStorage() {
    const tasksListStr = localStorage.getItem("tasksList");
  
    const tasksList = !tasksListStr ? [] : JSON.parse(tasksListStr);
  
    return tasksList;

}

function saveTasksListToLocalStorage(tasksList) {
    const tasksListStr = JSON.stringify(tasksList);
    localStorage.setItem("tasksList", tasksListStr);
}


function displayTasks(tasksList) {
    let notesBox = document.getElementById("notesBox")
    notesBox.innerHTML = " "
    let index = 0
    for(const tesk of tasksList) {
        let note = `
                    <div class="note" onmouseenter="showDeleteLogo(${index})" onmouseleave="removeDeleteLogo(${index})">
                        <i id="logo${index}" onclick="delValue(${index})" name="index" value="Delete" class="removeLogo glyphicon glyphicon-remove"></i>
                                <p>${tesk.Data}</p>
                        <div class="foot">${tesk.Date}
                            <br>${tesk.Time}
                        </div>
                    </div>
                    `
                    index++
                    notesBox.innerHTML += note
    }
}

function ClearValues() {
        document.getElementById("DataMission").value = " "
        document.getElementById("TimeMission").value = " "
        document.getElementById("DateMission").value = " "
}


function delValue(index) {

    if(confirm("Are You Sure You Want To Delete?") == true) {
    const tasksList = getTasksListFromLocalStorage()

    tasksList.splice(index, 1)
  
    saveTasksListToLocalStorage(tasksList)
  
    displayTasks(tasksList)
    }
}

function addFadeInClass() {
    const newTaskElement = document.querySelector(".note:last-of-type");
    newTaskElement.classList.add("fade-in");
}

function showDeleteLogo(index) {
    const removeLogo = document.getElementById(`logo${index}`);
    removeLogo.style.visibility = "visible";
}

function removeDeleteLogo(index) {
    const removeLogo = document.getElementById(`logo${index}`);
    removeLogo.style.visibility = "hidden";
}




  
  

