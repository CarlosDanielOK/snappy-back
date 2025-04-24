# 📸 SnappyFriends API

![NestJS](https://img.shields.io/badge/NestJS-v9.0.0-red)
![TypeScript](https://img.shields.io/badge/TypeScript-v4.9-blue)
![License](https://img.shields.io/badge/License-MIT-green)

**SnappyFriends** es una API desarrollada con [NestJS](https://nestjs.com), pensada para alimentar una red social moderna e interactiva. Permite crear publicaciones, enviar y recibir mensajes, recibir notificaciones en tiempo real, seguir cuentas, y mucho más.

> 🛠 Este es mi proyecto final del bootcamp Henry, seleccionado como el mejor del bootcamp y presentado en la **Demo Day** ante empresas.

---

## 🌟 Funcionalidades

- 🔐 **Autenticación**  
  Registro con email, login con usuario o Google OAuth. Manejo de JWT para sesiones seguras.

- 🧑‍🤝‍🧑 **Usuarios**
  - Seguidores / seguidos
  - Intereses y perfiles personalizados
  - Subida de foto de perfil
  - Personalizar el perfil

- 📝 **Publicaciones**
  - Crear, editar, eliminar posts
  - Likes y comentarios (incluye respuestas)
  - Compartir publicaciones

- ⏳ **Historias**
  - Historias con imagen o video
  - Expiran automáticamente tras 24 horas

- 💬 **Mensajería en tiempo real**
  - Chats privados y grupales
  - WebSockets con Socket.IO

- 🔔 **Notificaciones**
  - En tiempo real al recibir mensajes, likes, comentarios o nuevos seguidores

- 🧑‍⚖️ **Administración**
  - Reportes de contenido
  - Logs de acciones administrativas

- 💎 **Suscripciones premium**
  - Sistema de planes y pagos

---

## ⚙️ Tecnologías Utilizadas

| Categoría          | Tecnología                |
|--------------------|---------------------------|
| Backend Framework  | [NestJS](https://nestjs.com) |
| Lenguaje           | TypeScript                |
| Base de datos      | PostgreSQL o MySQL con TypeORM |
| Autenticación      | JWT y Google OAuth        |
| Validaciones       | class-validator, class-transformer |
| WebSockets         | Socket.IO                 |

---

## 📦 Instalación

### Requisitos previos
- Node.js v14+
- npm o yarn
- PostgreSQL

### Pasos

```bash
# Clonar el repositorio
git clone https://github.com/CarlosDanielOK/snappy-back.git
cd snappy-back

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Asegúrate de configurar tu conexión a la base de datos y JWT secret en el .env

# Ejecutar migraciones si usás TypeORM CLI
npm run typeorm migration:run

# Iniciar servidor en desarrollo
npm run start:dev
