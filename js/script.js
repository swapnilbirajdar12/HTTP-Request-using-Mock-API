let userList = [];

function toggleAddUserForm() {
  const addUserFormContainer = document.getElementById('add-user-form-container');
  addUserFormContainer.classList.toggle('hidden');
}

function toggleUserList() {
  const userListContainer = document.getElementById('user-list-container');
  userListContainer.classList.toggle('hidden');
}

function renderUserList() {
  const userTableBody = document.getElementById('user-table-body');
  userTableBody.innerHTML = '';

  userList.forEach((user, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td contenteditable>${user.name}</td>
      <td contenteditable>${user.age}</td>
      <td contenteditable>${user.state}</td>
      <td class="actions">
          <span class="edit-icon" onclick="editUser(${index})">&#9998;</span>
          <span class="delete-icon" onclick="deleteUser(${index})">&#128465;</span>
      </td>
    `;

    userTableBody.appendChild(row);
  });
}

function fetchUsers() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      userList = JSON.parse(this.responseText);
      renderUserList();
    }
  };
  xhttp.open("GET", "https://61dc785d591c3a0017e1a96d.mockapi.io/api/v1/users", true);
  xhttp.send();
}

function addUser(event) {
  event.preventDefault();

  const nameInput = document.getElementById('name');
  const ageInput = document.getElementById('age');
  const stateInput = document.getElementById('state');

  const user = {
    name: nameInput.value,
    age: ageInput.value,
    state: stateInput.value
  };

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 201) {
      userList.push(user);
      renderUserList();

      nameInput.value = '';
      ageInput.value = '';
      stateInput.value = '';

      toggleAddUserForm();
    }
  };
  xhttp.open("POST", "https://61dc785d591c3a0017e1a96d.mockapi.io/api/v1/users", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify(user));
}

function editUser(index) {
    const userTableBody = document.getElementById('user-table-body');
    const userRows = userTableBody.getElementsByTagName('tr');

    for (let i = 0; i < userRows.length; i++) {
        const row = userRows[i];
        const cells = row.getElementsByTagName('td');

        for (let j = 0; j < cells.length; j++) {
            const cell = cells[j];

            if (i === index) {
                cell.contentEditable = 'true';
                cell.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        cell.blur();
                    }
                });

                cell.addEventListener('blur', function () {
                    const property = j === 0 ? 'name' : j === 1 ? 'age' : 'state';
                    userList[index][property] = cell.textContent.trim();
                });
            } else {
                cell.contentEditable = 'false';
            }
        }
    }
}

function deleteUser(index) {
  const user = userList[index];

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      userList.splice(index, 1);
      renderUserList();
    }
  };
  xhttp.open("DELETE", `https://61dc785d591c3a0017e1a96d.mockapi.io/api/v1/users/${user.id}`, true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send();
}

fetchUsers();