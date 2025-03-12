const taskFilter = document.querySelectorAll('.filter-task')
const priorotyColors = document.querySelectorAll('.prioroty-colors')
const taskProperties = document.querySelector('.task-properties')
const back = document.querySelector('.task-properties-back')
const taskDropDown = document.querySelector('.task-properties-container')
const add = document.querySelector('.task-adder-container')
const taskview = document.querySelectorAll('.taskcards-view')
const addBtn = document.querySelector('button')
const taskContent = document.querySelector('.task-content')
const textarea = document.querySelector('textarea')

const greenTask = document.querySelector('.taskcard-green')
const blueTask = document.querySelector('.taskcard-blue')
const yellowTask = document.querySelector('.taskcard-yellow')
const redTask = document.querySelector('.taskcard-red')

const tickets = JSON.parse(localStorage.getItem('tickets')) || []

let colorValue = 'green'
let lockOpen = 'fa-lock'
let lockClose = 'fa-lock-open'
let lock = true

// Implement Local Storage fucntion
function init(){
    if(localStorage.getItem('tickets')){
        tickets.forEach(function(task){
            taskcard(task.number, task.color, task.content)
        })
    }
}

init()

// Priority Colors
priorotyColors.forEach(function(select){
    select.addEventListener('click', function(){
        colorValue = select.getAttribute('data-color')
        priorotyColors.forEach(function(removeColor){
            removeColor.classList.remove('active')
        })
        select.classList.add('active')
    })
})

// Filter Tasks
taskFilter.forEach(function(select){
    select.addEventListener('click', function(){
        taskFilter.forEach(function(removeColor){
            removeColor.classList.remove('active')
        })
        taskview.forEach(function(color){
            if(color.getAttribute('data-color') == select.getAttribute('data-color')){
                color.style.display = 'block'
            }
            else{
                color.style.display = 'none'
            }
        })
        select.classList.add('active')
    })
})

taskFilter.forEach(function(display){
    display.addEventListener('dblclick', function(){
        taskview.forEach(function(taskdisplay){
            taskdisplay.style.display = 'block'
        })
    })
})


add.addEventListener('click', function(){
    taskDropDown.style.transform = 'translateY(0vh)'
    taskDropDown.style.transition = '0.5s'
    setTimeout(function(){
        taskProperties.style.opacity = 1
        taskProperties.style.transition = 'opacity 0.5s ease-in-out';
    },300)
})

function backTransition(){
    taskProperties.style.opacity = 0
    taskProperties.style.transition = 'opacity 0.5s ease-in-out';
    setTimeout(function(){
        taskDropDown.style.transform = 'translateY(-95vh)'
        taskDropDown.style.transition = '0.5s'
    },400)
}   

function clearCache(){
    setTimeout(function(){
        document.querySelector('textarea').value = ''
    },1000)
}

back.addEventListener('click', backTransition)

function addTask() {
    if (taskContent.value.length > 0) {
        const taskNumber = Math.floor(Math.random() * 10000)
        tickets.push({ number: taskNumber, color: colorValue, content: taskContent.value })
        updateLocalStorage()
        backTransition()
        setTimeout(function () {
            taskcard(taskNumber, colorValue, taskContent.value)
        }, 1000)
        clearCache()
    }
}

addBtn.addEventListener('click', addTask)

document.addEventListener('keydown', function (e) {
    if (e.key == 'Home') addTask()
})

// Priority Task Color

function priorotyColorChange(taskcardView, number){
    const taskPriorityChange = taskcardView.querySelector('.taskcard-priority-color')
    taskPriorityChange.addEventListener('click', function(){
        const idx = ticketIndexInArray(number)
        if(taskPriorityChange.getAttribute('data-color') == 'green' && tickets[idx].color == 'green'){
            tickets[idx].color = 'blue'
            taskPriorityChange.setAttribute('data-color','blue')
            taskPriorityChange.classList.remove('green')
            taskPriorityChange.classList.add('blue')
            blueTask.appendChild(taskcardView)
        }
        else if(taskPriorityChange.getAttribute('data-color') == 'blue' && tickets[idx].color == 'blue'){
            tickets[idx].color = 'yellow'
            taskPriorityChange.setAttribute('data-color','yellow')
            taskPriorityChange.classList.remove('blue')
            taskPriorityChange.classList.add('yellow')
            yellowTask.appendChild(taskcardView)
        }
        else if(taskPriorityChange.getAttribute('data-color') == 'yellow' && tickets[idx].color == 'yellow'){
            tickets[idx].color = 'red'
            taskPriorityChange.setAttribute('data-color','red')
            taskPriorityChange.classList.remove('yellow')
            taskPriorityChange.classList.add('red')
            redTask.appendChild(taskcardView)
        }
        else if(taskPriorityChange.getAttribute('data-color') == 'red' && tickets[idx].color == 'red'){
            tickets[idx].color = 'green'
            taskPriorityChange.setAttribute('data-color','green')
            taskPriorityChange.classList.remove('red')
            taskPriorityChange.classList.add('green')
            greenTask.appendChild(taskcardView)
        }
        updateLocalStorage()
    })
}

function editCard(taskcardView,number){
    const editContent = taskcardView.querySelector('.taskcard-content')
    const editIcon  = taskcardView.querySelector('.edit')

    editIcon.addEventListener('click', function () {
        console.log('Hi')
        if (!lock) {
            editIcon.classList.remove(lockClose)
            editIcon.classList.add(lockOpen)
            editContent.children[0].setAttribute('contenteditable','false')
        } else {
            editIcon.classList.remove(lockOpen)
            editIcon.classList.add(lockClose)
            editContent.children[0].setAttribute('contenteditable','true')
        }
        lock = !lock
        const idx = ticketIndexInArray(number)
        tickets[idx].content = editContent.innerText
        updateLocalStorage()

    })
}

function removeCard(taskcardView, number){
    const removeBtn = taskcardView.querySelector('.taskcard-remove')
    const idx = ticketIndexInArray(number)
    removeBtn.addEventListener('click', function(){
        taskcardView.remove()
        console.log(tickets.splice(idx,1))
        updateLocalStorage()
    })
}

function taskcard(number, color, content){
    updateLocalStorage()
    const taskcardView = document.createElement('div')
    taskcardView.classList.add('taskcard-viewer','row')

    taskcardView.innerHTML = `<div class="taskcard">
        <div class="taskcard-bar-container row-sa">
            <div class="taskcard-bar row-sb">
                <div class="tasknumber"><span>TASK${number}</span></div>
                <div class="taskcard-properties row-sa">
                    <div class="taskcard-priority-color ${color}" data-color=${color}></div>
                    <div class="taskcard-editable"><i class="fa-solid fa-lock fa-lg edit" style="color: #edeee9;"></i></div>
                    <div class="taskcard-remove"><i class="fa-solid fa-xmark fa-xl" style="color: #edeee9;"></i></div>
                </div>
            </div>
        </div>
        <div class="taskcard-content">
            <p>${content}</p>
        </div>
        </div>`

    if(color == greenTask.getAttribute('data-color')) greenTask.appendChild(taskcardView)
    else if(color == blueTask.getAttribute('data-color')) blueTask.appendChild(taskcardView)
    else if(color == yellowTask.getAttribute('data-color')) yellowTask.appendChild(taskcardView)
    else if(color == redTask.getAttribute('data-color')) redTask.appendChild(taskcardView)

    priorotyColorChange(taskcardView, number)
    editCard(taskcardView, number)
    removeCard(taskcardView,number)
}



// Local Storage
function updateLocalStorage(){
    localStorage.setItem('tickets', JSON.stringify(tickets))
}

// Get IndeX

function ticketIndexInArray(num){
    const ticketIndex = tickets.findIndex(function(ticket){
        return ticket.number == num
    })
    return ticketIndex
}

