# 🧪 Sistema de Gestión de Indicios

Este repositorio contiene el backend y la base de datos del sistema de gestión de indicios, diseñado para técnicos forenses que necesitan documentar evidencias (indicios) asociadas a expedientes.

## 🧩 Modelo Entidad-Relación

El sistema se basa en el siguiente modelo de datos:

![Modelo ER](./diagramas/ER%20Diagram%20.png)

### Descripción:

- **User**: Usuarios del sistema con campos `email`, `name`, `password`, `role`.
- **Expediente**: Cada expediente tiene `fecha`, `estado`, `justificacion` y pertenece a un `técnico` (relación con `User`).
- **Indicio**: Evidencia asociada a un expediente. Tiene `descripcion`, `color`, `tamano`, `peso`, `ubicacion`.

---

## 🏗️ Arquitectura del Proyecto

![Diagrama de Arquitectura](./diagramas/Diagrama%20arquitectura.drawio.png)

### Componentes:

- **Frontend (Next.js)**: Aplicación web interactiva que consume el backend mediante JWT.
- **Backend (Node.js + Express)**: API RESTful encargada de manejar autenticación, expedientes e indicios.
- **Base de Datos (SQL Server)**: Almacenamiento relacional para todos los datos.

### Autenticación:

- El backend genera un **JWT** que es enviado al frontend.
- El frontend lo incluye en cada request mediante el header `Authorization`.

---

## 🚀 Cómo levantar el proyecto

### Requisitos:

- Docker
- Docker Compose
- Bun (para levantar el frontend)
- Node.js (opcional para desarrollo local del backend)

### Backend y Base de Datos (Docker Compose)

Desde la raíz del proyecto, ejecuta:

```bash
docker compose up --build
```

Esto levantará:

- Servidor Express (`backend/Dockerfile`)
- SQL Server con los datos persistentes

### Frontend

En otra terminal:

```bash
cd frontend
bun run dev
```

> 💡 Asegúrate que el backend esté corriendo antes de iniciar el frontend.

---

## 📦 Estructura del proyecto

```
.
├── README.md
├── backend
│   ├── Dockerfile
│   ├── bun.lock
│   ├── jest.config.mjs
│   ├── package-lock.json
│   ├── package.json
│   ├── postman/
│   │   └── MP.postman_collection.json
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── tests/
│   │   └── ...
│   └── tsconfig.json
├── diagramas/
│   ├── Diagrama arquitectura.drawio.png
│   └── ER Diagram .png
├── docker-compose.yml
└── frontend/
    ├── Dockerfile
    ├── bun.lock
    ├── components.json
    ├── package.json
    ├── public/
    ├── src/
    │   ├── app/
    │   ├── components/
    │   ├── context/
    │   ├── hooks/
    │   ├── lib/
    │   ├── types/
    │   └── ...
    └── tsconfig.json
```

---

## Notas finales

Este proyecto se encuentra en desarrollo. Actualmente solo el backend y la base de datos están disponibles en Docker. El frontend debe iniciarse con `bun run dev` de manera independiente.
