/**
 * @file es.ts
 * @description Spanish translation keys for User module
 */

const userTranslationsEs = {
  general: {
    title: 'Usuario',
    description: 'Gestión de usuarios del sistema'
  },
  actions: {
    create: 'Crear usuario',
    update: 'Actualizar usuario',
    delete: 'Eliminar usuario',
    list: 'Listar usuarios'
  },
  fields: {
    name: 'Nombre',
    email: 'Correo electrónico',
    password: 'Contraseña',
    role: 'Rol',
    status: 'Estado'
  },
  status: {
    active: 'Activo',
    inactive: 'Inactivo',
    banned: 'Suspendido'
  },
  validations: {
    required: 'Este campo es obligatorio',
    invalidEmail: 'Correo inválido',
    minLength: (min: number) => `Debe tener al menos ${min} caracteres`,
    maxLength: (max: number) => `Debe tener máximo ${max} caracteres`
  },
  messages: {
    created: 'Usuario creado correctamente',
    updated: 'Usuario actualizado exitosamente',
    deleted: 'Usuario eliminado exitosamente',
    notFound: 'Usuario no encontrado',
    error: 'Ocurrió un error inesperado'
  },
  errors: {
    emailAlreadyExists: 'El correo ya está registrado',
    unauthorized: 'No tienes permisos para realizar esta acción',
    invalidCredentials: 'Credenciales incorrectas'
  }
}

export default userTranslationsEs