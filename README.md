# E-commerce Platform - Dsw2025Tpi

Sistema de comercio electrónico desarrollado con ASP.NET Core y React, implementando gestión completa de productos, órdenes y autenticación dual.

## 🏗️ Arquitectura

### Backend (.NET 8)
- **Clean Architecture** con separación de capas
- **Domain Layer**: Entidades y lógica de negocio
- **Application Layer**: Servicios y DTOs
- **Data Layer**: Repositorios y Entity Framework Core
- **API Layer**: Controladores y configuración

### Frontend (React + Vite)
- **React 18** con hooks modernos
- **React Router** para navegación
- **Axios** para comunicación HTTP
- **CSS Modules** para estilos

## 🚀 Funcionalidades

### Autenticación y Autorización
- **JWT Authentication** con roles diferenciados
- **Admin**: Gestión completa del sistema
- **Customer**: Compras y consultas
- **Rutas protegidas** por rol

### Gestión de Productos
- CRUD completo de productos
- Activación/desactivación de productos
- Validación de stock en tiempo real
- Búsqueda y filtrado

### Sistema de Órdenes
- Creación de órdenes con validación de stock
- Actualización automática de inventario
- Estados de orden (Pending, Processing, Shipped, Delivered, Cancelled)
- Gestión de items de orden

### Panel de Administración
- Dashboard con estadísticas
- Gestión de productos y órdenes
- Interfaz unificada con sidebar navigation

### Tienda Pública
- Catálogo de productos activos
- Carrito de compras persistente
- Proceso de checkout completo

## 🛠️ Tecnologías

### Backend
- ASP.NET Core 8
- Entity Framework Core
- SQL Server
- JWT Bearer Authentication
- BCrypt para hashing de contraseñas
- Swagger/OpenAPI

### Frontend
- React 18
- Vite
- React Router DOM
- Axios
- CSS3

## 📦 Instalación

### Prerrequisitos
- .NET 8 SDK
- Node.js 18+
- SQL Server

### Backend
```bash
cd Dsw2025Tpi.Api
dotnet restore
dotnet ef database update
dotnet run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🔧 Configuración

### Base de Datos
Configurar connection string en `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=DswDb;User Id=sa;Password=P@ssword123;TrustServerCertificate=True;"
  }
}
```

### JWT
Configurar JWT settings en `appsettings.json`:
```json
{
  "jwt": {
    "Key": "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    "Issuer": "Dsw2025",
    "Audience": "Dsw2025",
    "ExpiryMinutes": "60"
  }
}
```

## 🔐 Endpoints API

### Autenticación
- `POST /api/auth/login` - Login administrador
- `POST /api/auth/register` - Registro administrador
- `POST /api/auth/login/customer` - Login cliente

### Productos
- `GET /api/products` - Productos activos (público)
- `GET /api/products/all` - Todos los productos (admin)
- `POST /api/products` - Crear producto (admin)
- `PUT /api/products/{id}` - Actualizar producto (admin)
- `PATCH /api/products/{id}` - Toggle estado producto (admin)

### Órdenes
- `POST /api/orders` - Crear orden (público)
- `GET /api/orders` - Listar órdenes (autenticado)
- `GET /api/orders/{id}` - Obtener orden (admin)
- `PUT /api/orders/{id}/status` - Actualizar estado (admin)

## 🎯 Características Técnicas

### Validaciones
- Validación de entrada en DTOs
- Validación de stock antes de crear órdenes
- Validación de duplicados (SKU, email)
- Manejo de errores con códigos HTTP apropiados

### Seguridad
- Autenticación JWT con roles
- Hashing seguro de contraseñas con BCrypt
- Autorización basada en roles
- Validación de tokens automática

### Calidad de Código
- Separación de responsabilidades
- Patrón Repository
- Inyección de dependencias
- Manejo centralizado de errores
- Código limpio y documentado

## 🚦 Estados de Orden

```csharp
public enum OrderStatus
{
    Pending,     // Pendiente
    Processing,  // Procesando
    Shipped,     // Enviado
    Delivered,   // Entregado
    Cancelled    // Cancelado
}
```

## 📱 Rutas Frontend

### Públicas
- `/` - Tienda pública
- `/cart` - Carrito de compras
- `/customer-login` - Login/registro cliente

### Admin (Protegidas)
- `/login` - Login administrador
- `/admin` - Dashboard principal
- `/admin/products` - Gestión de productos
- `/admin/products/create` - Crear producto
- `/admin/products/edit/:id` - Editar producto
- `/admin/orders` - Gestión de órdenes
- `/checkout` - Proceso de compra

## 🔄 Flujo de Trabajo

### Para Administradores
1. Login en `/login`
2. Acceso al dashboard `/admin`
3. Gestión de productos y órdenes
4. Cambio de estados de órdenes

### Para Clientes
1. Navegación pública en `/`
2. Agregar productos al carrito
3. Login/registro en `/customer-login`
4. Finalizar compra en `/checkout`

## 🧪 Testing

El proyecto está preparado para testing con:
- Validaciones de entrada
- Manejo de errores
- Verificación de stock
- Autenticación y autorización

## 📝 Notas de Desarrollo

- **Entity Framework**: Configurado con Code First
- **CORS**: Habilitado para desarrollo
- **Swagger**: Disponible en desarrollo
- **Health Checks**: Endpoint `/healthcheck`
- **Logging**: Configurado para desarrollo y producción

## 🤝 Contribución

1. Fork del proyecto
2. Crear feature branch
3. Commit de cambios
4. Push al branch
5. Crear Pull Request

## 📄 Licencia

Este proyecto es parte del curso de Desarrollo de Software 2025.