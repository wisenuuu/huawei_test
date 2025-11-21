class UserManager {
  constructor() {
    this.selectedUserId = null;
    this.init();
  }

  async init() {
    await this.loadModals();
    await this.fetchUsers();
    this.setupEventListeners();
  }

  async loadModals() {
    await Promise.all([
      this.loadModal("createModalContainer", "create.html"),
      this.loadModal("deleteModalContainer", "delete.html"),
      this.loadModal("updateModalContainer", "update.html"),
    ]);
  }

  async loadModal(containerId, htmlFile) {
    try {
      const response = await fetch(htmlFile);
      const html = await response.text();
      document.getElementById(containerId).innerHTML = html;
    } catch (error) {
      console.error(`Failed to load ${htmlFile}:`, error);
    }
  }

  setupEventListeners() {
    document.addEventListener("click", (e) => {
      if (e.target.getAttribute("data-dialog-backdrop-close") === "true") {
        this.closeAllModals();
      }
    });
  }

  // User CRUD operations
  async fetchUsers() {
    try {
      const response = await fetch("http://localhost:3000/users");
      const result = await response.json();
      this.renderUsers(result.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      alert("Error fetching users");
    }
  }

  renderUsers(users) {
    const tbody = document.getElementById("userTableBody");
    tbody.innerHTML = users
      .map(
        (user, index) => `
            <tr class="hover:bg-slate-50">
                <td class="p-4 border-b border-slate-200">${index + 1}</td>
                <td class="p-4 border-b border-slate-200">${user.name}</td>
                <td class="p-4 border-b border-slate-200">${user.username}</td>
                <td class="p-4 border-b border-slate-200">${user.email}</td>
                <td class="p-4 border-b border-slate-200">
                    <button onclick="userManager.openUpdateModal(${user.id})" 
                            class="text-blue-600 font-semibold mr-1 hover:underline cursor-pointer">
                        Edit
                    </button>
                    <button onclick="userManager.openDeleteModal(${user.id})" 
                            class="text-red-600 font-semibold hover:underline cursor-pointer">
                        Delete
                    </button>
                </td>
            </tr>
        `
      )
      .join("");
  }

  // Modal management
  openModal() {
    this.toggleModal("user-modal", true);
  }

  closeModal() {
    this.toggleModal("user-modal", false);
  }

  openDeleteModal(id) {
    this.selectedUserId = id;
    this.toggleModal("delete-modal", true);
  }

  closeDeleteModal() {
    this.toggleModal("delete-modal", false);
    this.selectedUserId = null;
  }

  async openUpdateModal(id) {
    this.selectedUserId = id;

    try {
      const response = await fetch(`http://localhost:3000/users/${id}`);
      const result = await response.json();
      this.populateUpdateForm(result.data);
      this.toggleModal("update-modal", true);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      alert("Error loading user data");
    }
  }

  closeUpdateModal() {
    this.toggleModal("update-modal", false);
    this.selectedUserId = null;
  }

  toggleModal(modalName, show) {
    const backdrop = document.querySelector(
      `[data-dialog-backdrop='${modalName}']`
    );
    if (show) {
      backdrop.classList.remove("pointer-events-none", "opacity-0");
      backdrop.classList.add("opacity-100");
    } else {
      backdrop.classList.add("pointer-events-none", "opacity-0");
      backdrop.classList.remove("opacity-100");
    }
  }

  closeAllModals() {
    this.closeModal();
    this.closeDeleteModal();
    this.closeUpdateModal();
  }

  // Form handling
  resetFormErrors(formType = "create") {
    const fields = ["name", "username", "email", "password"];
    const prefix = formType === "create" ? "" : "update";

    fields.forEach((field) => {
      const input = document.getElementById(
        `${prefix}${field.charAt(0).toUpperCase() + field.slice(1)}Input`
      );
      const errorTxt = document.getElementById(
        `${prefix}${field.charAt(0).toUpperCase() + field.slice(1)}Error`
      );

      if (input) {
        input.classList.remove("border-red-500");
        input.classList.add("border-slate-200");
      }
      if (errorTxt) errorTxt.textContent = "";
    });
  }

  showFieldError(field, message, formType = "create") {
    const prefix = formType === "create" ? "" : "update";
    const input = document.getElementById(
      `${prefix}${field.charAt(0).toUpperCase() + field.slice(1)}Input`
    );
    const errorTxt = document.getElementById(
      `${prefix}${field.charAt(0).toUpperCase() + field.slice(1)}Error`
    );

    if (input && errorTxt) {
      input.classList.remove("border-slate-200");
      input.classList.add("border-red-500");
      errorTxt.textContent = message;
    }
  }

  handleApiError(error, formType = "create") {
    const msg = error.message ? error.message.toLowerCase() : "unknown error";

    const fieldMappings = {
      name: ["name is required"],
      username: ["username is required", "username", "exist"],
      email: ["email is required", "email", "exist"],
      password: ["password is required"],
    };

    Object.entries(fieldMappings).forEach(([field, keywords]) => {
      if (keywords.some((keyword) => msg.includes(keyword))) {
        this.showFieldError(field, error.message, formType);
      }
    });
  }

  async submitUserForm() {
    const formData = {
      name: document.getElementById("nameInput").value.trim(),
      username: document.getElementById("usernameInput").value.trim(),
      email: document.getElementById("emailInput").value.trim(),
      password: document.getElementById("passwordInput").value.trim(),
    };

    this.resetFormErrors("create");

    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        this.handleApiError(result, "create");
        return;
      }

      alert("User created successfully!");
      this.closeModal();
      await this.fetchUsers();
    } catch (error) {
      console.error("Create user error:", error);
      alert("Error connecting to API");
    }
  }

  async submitUpdateForm() {
    const formData = {
      name: document.getElementById("updateNameInput").value.trim(),
      username: document.getElementById("updateUsernameInput").value.trim(),
      email: document.getElementById("updateEmailInput").value.trim(),
      password: document.getElementById("updatePasswordInput").value.trim(),
    };

    // Remove password if empty
    if (!formData.password) {
      delete formData.password;
    }

    this.resetFormErrors("update");

    try {
      const response = await fetch(
        `http://localhost:3000/users/${this.selectedUserId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        this.handleApiError(result, "update");
        return;
      }

      alert("User updated successfully!");
      this.closeUpdateModal();
      await this.fetchUsers();
    } catch (error) {
      console.error("Update user error:", error);
      alert("Error connecting to API");
    }
  }

  async confirmDelete() {
    if (!this.selectedUserId) return;

    try {
      const response = await fetch(
        `http://localhost:3000/users/${this.selectedUserId}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Failed to delete user");
        return;
      }

      alert("User deleted successfully!");
      this.closeDeleteModal();
      await this.fetchUsers();
    } catch (error) {
      console.error("Delete user error:", error);
      alert("Cannot connect to server");
    }
  }

  populateUpdateForm(user) {
    document.getElementById("updateUserId").value = user.id;
    document.getElementById("updateNameInput").value = user.name;
    document.getElementById("updateUsernameInput").value = user.username;
    document.getElementById("updateEmailInput").value = user.email;
    document.getElementById("updatePasswordInput").value = "";
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.userManager = new UserManager();
});
