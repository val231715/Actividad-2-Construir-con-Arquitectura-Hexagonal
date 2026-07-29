/**
 * CONTROLADOR - Funciones Controladoras
 * 
 * Reciben peticiones HTTP, validan entrada, llaman al Modelo (Services)
 * y envían respuestas al cliente (Vista)
 * 
 * Responsabilidades:
 * - Validar datos de entrada
 * - Llamar a funciones del servicio (Modelo)
 * - Gestionar códigos HTTP (200, 201, 400, 404, etc.)
 * - Dar formato a respuestas
 */

import type { Request, Response } from "express";
import { UserService } from "../../Application/user.service.js";
import { InMemoryUserRepository } from "../../Infrastructure/Memory/user.repository.js";
import { ChangePassword } from "../../Application/change-password.use-case.js";


const userRepository = new InMemoryUserRepository();
const userService = new UserService(userRepository);
const changePasswordUseCase = new ChangePassword(userRepository);

export async function getUsers(_req: Request, res: Response): Promise<void> {
  const users = await userService.getAllUsers();
  res.json(users);
}

export async function postUser(req: Request, res: Response): Promise<void> {
  try {
    const user = await userService.createUser({
      email: req.body?.email,
      name: req.body?.name,
      password: req.body?.password
    });
    res.status(201).json(user);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error inesperado";
    res.status(400).json({ message });
  }
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    res.status(400).json({ message: "id inválido" });
    return;
  }

  await userService.deleteUser(id);

  res.status(204).send();
}

export async function patchUserPassword(req: Request, res: Response): Promise<void> {
  const email = String(req.params.email);
  const newPassword = req.body?.password;

  if (!email || !newPassword || email === "undefined") {
    res.status(400).json({ message: "email y nuevo password son requeridos" });
    return;
  }

  try {
    await changePasswordUseCase.execute(email, newPassword);
    res.status(200).json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error inesperado";
    res.status(400).json({ message });
  }
}
