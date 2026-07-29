/**
 * VISTA - Lógica del Cliente
 * 
 * Ejecuta en el navegador del usuario
 * Responsabilidades:
 * - Actualizar el DOM (mostrar/ocultar elementos)
 * - Capturar eventos del usuario (clicks, sumits de formularios)
 * - Comunicarse con el servidor mediante peticiones HTTP
 * - Renderizar respuestas del servidor
 * 
 * NO contiene:
 * - Lógica de negocio (eso está en el servidor)
 * - Acceso directo a base de datos (se comunica con API)
 */

interface UiUser {
  id: number;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
}

interface ApiError {
  message?: string;
}

function getRequiredElement<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);

  if (!element) {
    throw new Error(`No se encontró el elemento con id: ${id}`);
  }

  return element as T;
}

const form = getRequiredElement<HTMLFormElement>("user-form");
const emailInput = getRequiredElement<HTMLInputElement>("user-email");
const nameInput = getRequiredElement<HTMLInputElement>("user-name");
const passwordInput = getRequiredElement<HTMLInputElement>("user-password");
const tableBody = getRequiredElement<HTMLTableSectionElement>("user-table-body");
const message = getRequiredElement<HTMLParagraphElement>("message");

function showMessage(text = ""): void {
  message.textContent = text;
}

function renderUsers(users: UiUser[]): void {
  tableBody.innerHTML = "";

  if (users.length === 0) {
    const row = document.createElement("tr");
    const empty = document.createElement("td");
    empty.colSpan = 6;
    empty.textContent = "No hay users todavía.";
    row.appendChild(empty);
    tableBody.appendChild(row);
    return;
  }

  users.forEach((user) => {
    const row = document.createElement("tr");

    const idCell = document.createElement("td");
    idCell.textContent = String(user.id);

    const nameCell = document.createElement("td");
    nameCell.textContent = user.name;

    const emailCell = document.createElement("td");
    emailCell.textContent = user.email;

    const hashCell = document.createElement("td");
    hashCell.textContent = user.passwordHash;

    const createdAtCell = document.createElement("td");
    createdAtCell.textContent = user.createdAt;

    const actionCell = document.createElement("td");

    const delBtn = document.createElement("button");
    delBtn.className = "delete-btn";
    delBtn.textContent = "Eliminar";
    delBtn.dataset.id = String(user.id);

    const changePwdBtn = document.createElement("button");
    changePwdBtn.className = "change-pwd-btn";
    changePwdBtn.textContent = "Cambiar Password";
    changePwdBtn.dataset.email = user.email;
    changePwdBtn.style.marginRight = "5px";
    changePwdBtn.style.backgroundColor = "#ff9800"; // Naranja para diferenciar

    actionCell.appendChild(changePwdBtn);
    actionCell.appendChild(delBtn);
    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(emailCell);
    row.appendChild(hashCell);
    row.appendChild(createdAtCell);
    row.appendChild(actionCell);
    tableBody.appendChild(row);
  });
}

async function loadUsers(): Promise<void> {
  try {
    const response = await fetch("/api/users");
    const users = (await response.json()) as UiUser[];
    renderUsers(users);
  } catch {
    showMessage("No se pudo cargar la lista.");
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  showMessage();

  const email = emailInput.value.trim();
  const name = nameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email) {
    showMessage("El email es requerido.");
    return;
  }

  if (!name) {
    showMessage("El nombre es requerido.");
    return;
  }

  if (!password) {
    showMessage("El password es requerido.");
    return;
  }

  try {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, password })
    });

    if (!response.ok) {
      const data = (await response.json()) as ApiError;
      showMessage(data.message || "Error al crear.");
      return;
    }

    emailInput.value = "";
    nameInput.value = "";
    passwordInput.value = "";
    await loadUsers();
  } catch {
    showMessage("No se pudo crear el user.");
  }
});

tableBody.addEventListener("click", async (event) => {
  const target = event.target;

  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  // Lógica para Eliminar
  if (target.classList.contains("delete-btn") && target.dataset.id) {
    showMessage();

    try {
      const response = await fetch(`/api/users/${target.dataset.id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        showMessage("No se pudo eliminar.");
        return;
      }

      await loadUsers();
    } catch {
      showMessage("No se pudo eliminar.");
    }
  }

  // Lógica para Cambiar Contraseña
  if (target.classList.contains("change-pwd-btn") && target.dataset.email) {
    const newPassword = prompt("Ingresa la nueva contraseña (mínimo 8 caracteres):");
    if (!newPassword) {
      return; // El usuario canceló o no escribió nada
    }

    showMessage();

    try {
      const response = await fetch(`/api/users/${target.dataset.email}/password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword })
      });

      if (!response.ok) {
        const data = (await response.json()) as ApiError;
        showMessage(data.message || "Error al actualizar contraseña.");
        return;
      }

      showMessage("Contraseña actualizada con éxito.");
      await loadUsers();
    } catch {
      showMessage("No se pudo actualizar la contraseña.");
    }
  }
});

void loadUsers();
