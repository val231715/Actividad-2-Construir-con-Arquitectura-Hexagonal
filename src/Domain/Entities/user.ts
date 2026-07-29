/**
 * MODELO - Logica de Negocio de Usuario
 *
 * Contiene la logica de negocio:
 * - Validaciones de datos
 * - Encriptacion de contrasenas
 * - Creacion de entidad
 *
 * Responsabilidades:
 * - Validar datos de entrada
 * - Aplicar reglas de negocio
 * - Crear objeto de dominio
 */

import bcrypt from "bcryptjs";


const SALT_ROUNDS = 10;


export class User {
  email: string;
  name: string;
  passwordHash: string;

  constructor(email:string, name:string, password:string){
    const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const cleanName = typeof name === "string" ? name.trim() : "";
    const cleanPassword = typeof password === "string" ? password.trim() : "";

    if (!cleanEmail) {
      throw new Error("email es requerido");
    }

    if (!cleanName) {
      throw new Error("name es requerido");
    }

    if (!cleanPassword) {
      throw new Error("password es requerido");
    }

    const passwordHash = bcrypt.hashSync(cleanPassword, SALT_ROUNDS);
    this.email = cleanEmail;
    this.name = cleanName;
    this.passwordHash = passwordHash;

  }

  changePassword(newPassword: string) {
    const cleanPassword = typeof newPassword === "string" ? newPassword.trim() : "";
    
    if (cleanPassword.length < 8) {
      throw new Error("La contraseña debe tener al menos 8 caracteres.");
    }
    
    if (bcrypt.compareSync(cleanPassword, this.passwordHash)) {
      throw new Error("La nueva contraseña no puede ser igual a la anterior.");
    }
    
    this.passwordHash = bcrypt.hashSync(cleanPassword, SALT_ROUNDS);
  }
}
