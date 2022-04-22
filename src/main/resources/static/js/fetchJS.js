const tbody = document.querySelector("tbody")
const addUserForm = document.querySelector(".add-post-form")

const urlRoles = "http://localhost:8080/api/roles"
const URL = "http://localhost:8080/api/users/"
const userBarUrl = "http://localhost:8080/api/user_bar"
let output = ""
let outputRole = ""

const formArticuloDel = document.querySelector('#deleteUser')


const modalArtDel = new bootstrap.Modal(document.getElementById('del'))
const idDelIn = document.getElementById('idDelIn')
const firtsNameDelIn = document.getElementById('firtsNameDelIn')
const lastNameDelIn = document.getElementById('lastNameDelIn')
const ageDelIn = document.getElementById('ageDelIn')
const emailDelIn = document.getElementById('emailDelIn')

const formArticuloEd = document.querySelector('#editUser')

const modalArtEd = new bootstrap.Modal(document.getElementById('ed'))
const idEdIn = document.getElementById('idEdIn')
const firstNameEdIn = document.getElementById('firstNameEdIn')
const lastNameEdIn = document.getElementById('lastNameEdIn')
const ageEdIn = document.getElementById('ageEdIn')
const emailEdIn = document.getElementById('emailEdIn')
const passwordEdIn = document.getElementById('passwordEdIn')

const showUserSelector = document.querySelector("#brand")
const navUserSelector = document.querySelector("#navUser")

const navTableUserBar = (userBar) => {
    let outputShowUserBar = ""
    let outputNavUserBar = ""
    outputShowUserBar += `                   
                    <a class="font-weight-bold" >${userBar.email}</a>
                    <a class="font-weight-normal">with roles:</a>
                    
                    <a>${userBar.roles.map(role => {
        role = role.name.replace("ROLE_", " ")
        return role
    })}</a>
                        `
    showUserSelector.innerHTML = outputShowUserBar

    outputNavUserBar += `                   
                         <tr>
                            <td>${userBar.id}</td>
                            <td>${userBar.firstName}</td>
                            <td>${userBar.lastName}</td>
                            <td>${userBar.age}</td>
                            <td>${userBar.email}</td>
                            <td> <a>${userBar.roles.map(role => {
        role = role.name.replace("ROLE_", " ")
        return role
    })}</a>
                            </td>
                        </tr>
                         `
    navUserSelector.innerHTML = outputNavUserBar
}


fetch(userBarUrl)
    .then(response => response.json())
    .then(data => navTableUserBar(data))

const roleMultiSelector = document.querySelector("#roles-value")

const selectRole = (roles) => {
    roles.forEach(role => {
        outputRole += `                   
                            <option  value=${JSON.stringify(role)}         
                                    >${role.name.replace("ROLE_", " ")}</option>
                        
                        `
    })
    roleMultiSelector.innerHTML = outputRole
}
fetch(urlRoles)
    .then(response => response.json())
    .then(data => selectRole(data))


const renderUsers = (users) => {
    users.forEach(user => {
        output += `
             <tr>
                                <td>${user.id}</td>
                                <td>${user.firstName}</td>
                                <td>${user.lastName}</td>
                                <td >${user.age}</td>
                                <td>${user.email}</td>
                                <td>${user.roles.map(role => {
            role = role.name.replace("ROLE_", " ")
            return role
        })}</td>
                                <td>
                                    <button type="button" class="btnEdit btn btn-info"
                                            data-toggle="modal" >
                                        Edit
                                    </button>
                                </td>
                                <td>
                                    <button type="button" class="btnDelete btn btn-danger" data-toggle="modal"
                                            >
                                        Delete
                                    </button>
                                </td>
                                    
                            </tr> 
                        `
    })
    tbody.innerHTML = output
}

fetch(URL)
    .then(response => response.json())
    .then(data => renderUsers(data))


// Create - Insert new user
//Method: POST
addUserForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(e.target)
    const value = Object.fromEntries(data.entries())
    value.topics = data.getAll("rolesi")
    for (let i = 0; i < value.topics.length; i++) {
        value.topics[i] = JSON.parse(value.topics[i])
    }

    fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            firstName: document.getElementById("firstName-value").value,
            lastName: document.getElementById("lastName-value").value,
            age: document.getElementById("age-value").value,
            email: document.getElementById("email-value").value,
            password: document.getElementById("password-value").value,

            roles: value.topics
        })
    })
        .then(response => response.json())
        .then(data => {
            const dataArr = []
            dataArr.push(data)
            renderUsers(dataArr)
        })
    e.target.reset();
    $('#home-tab').tab('show')

})


const on = (element, event, selector, handler) => {
    element.addEventListener(event, e => {
        if (e.target.closest(selector)) {
            handler(e)
        }
    })
}

const roleMultiDel = document.querySelector("#roleDelIn")

const roleMultiEdit = document.querySelector("#roleEdIn")


const predSelectedRoles = (data, roleMulti) => {
    let outputSelectRole = ""

    let user = data[0]
    let roles = data[1]
    let userRolesNames = []
    user.roles.forEach(role => userRolesNames.push(role.name))

    roles.forEach(role => {

        if (userRolesNames.includes(role.name)) {
            outputSelectRole += `
                        <option  value=${JSON.stringify(role)} selected
                                >${role.name.replace("ROLE_", " ")}</option>
                    `
        } else {
            outputSelectRole += `
                        <option  value=${JSON.stringify(role)} 
                                >${role.name.replace("ROLE_", " ")}</option>
                    `
        }
    })
    roleMulti.innerHTML = outputSelectRole
}


let idForm = 0

//delitto
on(document, "click", ".btnDelete", e => {


    const fila = e.target.parentNode.parentNode
    idForm = fila.children[0].innerHTML


    const firstNameForm = fila.children[1].innerHTML
    const lastNameForm = fila.children[2].innerHTML
    const ageForm = fila.children[3].innerHTML
    const emailForm = fila.children[4].innerHTML

    idDelIn.value = idForm
    firtsNameDelIn.value = firstNameForm
    lastNameDelIn.value = lastNameForm
    ageDelIn.value = ageForm
    emailDelIn.value = emailForm


    Promise.all([
        fetch(URL + idForm).then(response => response.json()),
        fetch(urlRoles).then(response => response.json()),
    ])
        .then(data => predSelectedRoles(data, roleMultiDel))

    modalArtDel.show()

})

formArticuloDel.addEventListener("submit", (e) => {
    e.preventDefault()
    // console.log("HELLO")
    fetch(URL + idForm, {
        method: "DELETE"
    })
        .then(res => res.json())
        .then(data => renderUsersAfter(data))
    modalArtDel.hide()
})

const renderUsersAfter = (users) => {
    let outputAfter = ""
    tbody.innerHTML = ""
    users.forEach(user => {
        outputAfter += `
             <tr>
                                <td>${user.id}</td>
                                <td>${user.firstName}</td>
                                <td>${user.lastName}</td>
                                <td >${user.age}</td>
                                <td>${user.email}</td>
                                <td>${user.roles.map(role => {
            role = role.name.replace("ROLE_", " ")
            return role
        })}</td>
                                <td>
                                    <button type="button" class="btnEdit btn btn-info"
                                            data-toggle="modal" >
                                        Edit
                                    </button>
                                </td>
                                <td>
                                    <button type="button" class="btnDelete btn btn-danger" data-toggle="modal"
                                            >
                                        Delete
                                    </button>
                                </td>
                                    
                            </tr> 
                        `
    })
    tbody.innerHTML = outputAfter
}

//editto
on(document, "click", ".btnEdit", e => {

    const fila = e.target.parentNode.parentNode
    idForm = fila.children[0].innerHTML

    const firstNameForm = fila.children[1].innerHTML
    const lastNameForm = fila.children[2].innerHTML
    const ageForm = fila.children[3].innerHTML
    const emailForm = fila.children[4].innerHTML

    idEdIn.value = idForm
    firstNameEdIn.value = firstNameForm
    lastNameEdIn.value = lastNameForm
    ageEdIn.value = ageForm
    emailEdIn.value = emailForm

    Promise.all([
        fetch(URL + idForm).then(response => response.json()),
        fetch(urlRoles).then(response => response.json()),
    ])
        .then(data => predSelectedRoles(data, roleMultiEdit))
    modalArtEd.show()
})

formArticuloEd.addEventListener("submit", async (e) => {
    e.preventDefault()
    const data = new FormData(e.target)
    const value = Object.fromEntries(data.entries())
    value.topics = data.getAll("rolesi")
    for (let i = 0; i < value.topics.length; i++) {
        value.topics[i] = JSON.parse(value.topics[i])
    }
    await fetch(URL, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: idEdIn.value,
            firstName: firstNameEdIn.value,
            lastName: lastNameEdIn.value,
            age: ageEdIn.value,
            email: emailEdIn.value,
            password: passwordEdIn.value,
            roles: value.topics
        })
    })
        .then(res => res.json())
        .then(data => renderUsersAfter(data))

    e.target.reset();
    modalArtEd.hide()

    fetch(userBarUrl)
        .then(response => response.json())
        .then(data => navTableUserBar(data))
})
