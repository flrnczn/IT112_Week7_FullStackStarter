const apiURL = "https://it112-week7-fullstackstarter-1.onrender.com/api/users";

const userForm = document.getElementById("userForm");
const usersTableBody = document.querySelector("#usersTable tbody");

// Fetch & display users
async function fetchUsers() {
  usersTableBody.innerHTML = "";
  const res = await fetch(apiURL);
  const users = await res.json();

  users.forEach(user => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td data-label="Name">${user.name}</td>
      <td data-label="Email">${user.email}</td>
      <td data-label="Age">${user.age || "N/A"}</td>
      <td data-label="Actions">
        <button class="edit" onclick="editUser('${user._id}', '${user.name}')">Edit</button>
        <button class="delete" onclick="deleteUser('${user._id}')">Delete</button>
      </td>
    `;
    usersTableBody.appendChild(tr);
  });
}

// Add new user
userForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(userForm);
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    age: formData.get("age") || null
  };
  await fetch(apiURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  userForm.reset();
  fetchUsers();
});

// Delete user
async function deleteUser(id) {
  await fetch(`${apiURL}/${id}`, { method: "DELETE" });
  fetchUsers();
}

// Edit user
function editUser(id, currentName) {
  const newName = prompt("Enter new name:", currentName);
  if (newName) {
    fetch(`${apiURL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName })
    }).then(fetchUsers);
  }
}

// Initial load
fetchUsers();