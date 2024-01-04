'use strict';

const API_URL = 'http://tasks-api.std-900.ist.mospolytech.ru/api'
const API_KEY = '50d2199a-42dc-447d-81ed-d68a443b697e'

let btn = document.querySelector('#create');



function createItem(value) {
    const list = document.querySelector(`#${value.status}-list`);
    const item = document.getElementById('task-template').cloneNode(true);
    item.querySelector('.task-name').textContent = value.name;
    item.dataset.id = value.id
    item.querySelector('.task-description').textContent = value.desc;
    item.classList.remove('d-none');
    list.append(item);
}

async function createReq(value) {
    let taskFormData = new FormData()
    taskFormData.append("name", value.name)
    taskFormData.append("desc", value.desc)
    taskFormData.append("status", value.status)
    await fetch(`${API_URL}/tasks?api_key=${API_KEY}`, {
        method: "POST",
        body: taskFormData
    })
        .then(async res => console.log(await res.json()))
        .catch(err => console.log(err))
    location.reload()
}

btn.addEventListener('click', function (event) {
    let modal = event.target.closest('.modal');
    let name = modal.querySelector('#nameTask').value;
    let desc = modal.querySelector('#textTask').value;
    let status = modal.querySelector('#select').value;
    // localStorage.setItem(`task-${localStorage.length+1}`,JSON.stringify({name, desc, status}));
    // createItem({id:`task-${localStorage.length+1}`, name, desc, status});
    createReq({ name, desc, status });
});

const showShowModal = document.querySelector('#showModal');
showShowModal.addEventListener('show.bs.modal', showModal)

function showModal(event) {
    let task = event.relatedTarget.closest('#task-template');
    let name = task.querySelector('.task-name').textContent;
    let desc = task.querySelector('.task-description').textContent;
    event.target.querySelector('#showNameTask').value = name;
    event.target.querySelector('#showTextTask').value = desc;
};


const showEditModal = document.querySelector('#editModal');
showEditModal.addEventListener('show.bs.modal', editModal)

function editModal(event) {
    let task = event.relatedTarget.closest('#task-template');
    let name = task.querySelector('.task-name').textContent;
    let desc = task.querySelector('.task-description').textContent;
    let id = task.dataset.id;
    event.target.querySelector('#editNameTask').value = name;
    event.target.querySelector('#editTextTask').value = desc;
    const btn = event.target.querySelector('#save');
    btn.addEventListener('click', async function (event) {
        let taskName = document.querySelector('#editNameTask').value;
        let taskDesc = document.querySelector('#editTextTask').value;
        let taskFormData = new FormData()
        taskFormData.append("name", taskName)
        taskFormData.append("desc", taskDesc)
        // const modal = event.target.closest('#editModal');
        // const item = JSON.parse(localStorage.getItem(id));

        // item.name = modal.querySelector('#editNameTask').value;
        // item.desc = modal.querySelector('#editTextTask').value;
        // localStorage.setItem(id, JSON.stringify(item));
        // task.querySelector('.task-name').textContent = item.name;
        // task.querySelector('.task-description').textContent = item.desc;
        // console.log(taskName, taskDesc)
        // let taskObj = {
        //     name: taskName,
        //     desc: taskDesc
        // }
        // console.log(taskObj)
        await fetch(`${API_URL}/tasks/${id}?api_key=${API_KEY}`, {
            method: "PUT",
            body: taskFormData
        })
            .then(res => location.reload())
    });
}

const showRemoveModal = document.querySelector('#removeModal');
showRemoveModal.addEventListener('show.bs.modal', removeModal)

function removeModal(event) {
    let task = event.relatedTarget.closest('#task-template');
    let name = task.querySelector('.task-name').textContent;
    let id = task.dataset.id;
    event.target.querySelector('#removeNameTask').textContent = name;
    const btn = event.target.querySelector('#removeModalBtn');
    btn.addEventListener('click', async function (event) {
        localStorage.removeItem(id);
        document.querySelector((`[data-id="${id}"]`)).remove();
        await fetch(`${API_URL}/tasks/${id}?api_key=${API_KEY}`, { method: "DELETE" })
            .then(res => location.reload())
    });
}


const showMoveModal = document.querySelector('#moveModal');
showMoveModal.addEventListener('show.bs.modal', moveModal)

function moveModal(event) {
    let task = event.relatedTarget.closest('#task-template');
    let name = task.querySelector('.task-name').textContent;
    let id = task.dataset.id;
    event.target.querySelector('#moveNameTask').textContent = name;
    const btn = event.target.querySelector('#moveModalBtn');

    let taskObj = JSON.parse(window.localStorage.getItem(`task-${id}`))
    let taskFormData = new FormData()
    if (taskObj.status === 'to-do') {
        taskFormData.append('status', 'done')
    } else {
        taskFormData.append('status', 'to-do')
    }
    // event.target.querySelector('#moveNameTask').textContent= name;
    btn.addEventListener('click', async function (event) {
        console.log(id, document.querySelector((`[data-id="${id}"]`)))
        localStorage.removeItem(id);
        await fetch(`${API_URL}/tasks/${id}?api_key=${API_KEY}`, { method: "PUT", body: taskFormData })
            .then(res => location.reload())
    });
}

async function loadData() {
    // let todoList = document.querySelector('#to-do-list');
    // let doneList = document.querySelector('#done-list');
    // console.log(todoList.childNodes)
    // console.log(doneList.childNodes)
    // for (let child of todoList.childNodes) {
    //     if (child.classList?.length === 3) {
    //         child.remove()
    //     }
    // }
    // for (let child of doneList.childNodes) {
    //     if (child.classList?.length === 3) {
    //         child.remove()
    //     }
    // }
    let todoCount = document.querySelector('#todoTaskCount');
    let doneCount = document.querySelector('#doneTaskCount');

    let res = await fetch(`${API_URL}/tasks?api_key=${API_KEY}`)
    res = await res.json()

    todoCount.innerHTML = res.tasks.filter(it => it.status === 'to-do').length
    doneCount.innerHTML = res.tasks.filter(it => it.status === 'done').length
    console.log(res.tasks)
    for (let task of res.tasks) {
        window.localStorage.setItem(`task-${task.id}`, JSON.stringify(task))
        createItem({ id: task.id, ...task })
    }
}

window.onload = async function () {
    await loadData()

    // for (let i = 0; i < localStorage.length; ++i) {
    //     let key = localStorage.key(i);
    //     if (key.startsWith('task')) {
    //         const value = JSON.parse(localStorage.getItem(key));
    //     }
    // }
};

