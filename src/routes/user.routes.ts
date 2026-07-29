/**
 * CONTROLADOR - Rutas de Usuario
 * 
 * Define los endpoints de la API y mapea a funciones controladoras
 * Métodos HTTP:
 * - GET /api/users        → obtener lista de usuarios
 * - POST /api/users       → crear nuevo usuario
 * - DELETE /api/users/:id → eliminar usuario
 */

import { Router } from "express";
import { deleteUser, getUsers, postUser, patchUserPassword } from "../Presentation/Controllers/user.controller.js";

const router = Router();

router.get("/users", getUsers);
router.post("/users", postUser);
router.delete("/users/:id", deleteUser);
router.patch("/users/:email/password", patchUserPassword);

export default router;
