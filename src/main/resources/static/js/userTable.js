const userBarUrl = "http://localhost:8080/api/user_bar"

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