# Kata User Management Frontend

Sistema de gestión de clientes para Banco de Bogotá. Aplicación web con autenticación JWT, control de acceso basado en roles (admin, asesor, consulta) y exportación estática para despliegue en AWS S3 + CloudFront.

## Stack

- **Next.js 16** (App Router + Turbopack)
- **React 19** + **TypeScript 5.7**
- **Tailwind CSS 4.2**
- **SWR** (client-side data fetching y caché)
- **Formik + Yup** (formularios y validación)
- **Vitest + Testing Library** (testing)

## Requisitos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

## Instalación

### 1. Clonar repositorio

```bash
git clone https://github.com/pulidxx/kata-user-management-frontend.git
cd kata-user-management-frontend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

Para producción, esta variable se configura automáticamente desde GitHub Secrets durante el despliegue.

### 4. Iniciar servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Scripts disponibles

```bash
npm run dev          # Servidor de desarrollo con Turbopack
npm run build        # Build de producción (exportación estática)
npm start            # Servidor de producción local
npm run lint         # Ejecutar ESLint
npm test             # Ejecutar tests con Vitest
npm run test:ui      # Ejecutar tests con interfaz visual
npm run test:coverage # Ejecutar tests con reporte de cobertura
```
