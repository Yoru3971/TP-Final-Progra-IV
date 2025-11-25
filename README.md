# 🍽️ MiViandita 

**MiViandita** es una aplicación Single Page Application (SPA) desarrollada en Angular que facilita la conexión entre emprendedores que ofrecen viandas y clientes. Actúa como un *marketplace* de visualización y gestión inicial de pedidos, sin gestionar pagos ni logística de envío.

Este proyecto sigue una arquitectura de **Angular Moderno**, enfocada en la eficiencia con un diseño **Stateless** y **Zoneless**, potenciado por la reactividad de **Angular Signals**.

## 🚀 Stack Tecnológico

| Componente | Tecnología | Descripción |
| :--- | :--- | :--- |
| **Frontend** | Angular (v17+) | Desarrollo principal. Enfoque **Stateless** y **Zoneless**. |
| **Backend API** | Spring Boot | Consumo de la API REST desarrollada el cuatrimestre pasado. |
| **Autenticación** | JWT | Token para validación de rol y acceso a rutas protegidas. |

## 🔑 Roles y Funcionalidades

La aplicación maneja tres roles principales, definidos por el token JWT.

### 1. Invitado

| Funcionalidad | Descripción |
| :--- | :--- |
| **Visualización** | Ver emprendimientos y sus viandas. |
| **Acceso** | No puede comprar, llenar el carrito o realizar cualquier acción transaccional. |

### 2. Cliente

Puede realizar todas las acciones del Invitado, más las siguientes:

| Funcionalidad | Descripción |
| :--- | :--- |
| **Pedidos** | Crear un carrito para realizar un pedido. |
| **Cancelación** | Cancelar un pedido si **aún no fue aceptado** por el Dueño y si la fecha de entrega es **próxima a más de 24 horas**. |
| **Personalización** | Modificar sus datos de usuario y credenciales en su perfil. |
| **Selección de Ciudad** | Un selector global permite filtrar y visualizar **reactivamente** los emprendimientos de la ciudad seleccionada (implementado con **Signals**). |
| **Filtros de Viandas** | Aplicar filtros por categoría, rango de precios y características dietéticas (sin TACC, vegano, vegetariano) en la página del emprendimiento. |
| **Perfil** | Ver notificaciones y pedidos realizados. |

### 3. Dueño (Emprendedor)

| Funcionalidad | Descripción |
| :--- | :--- |
| **Home Page** | Visualiza **solo sus propios** emprendimientos. |
| **Filtrado** | La selección de ciudad filtra reactivamente sus emprendimientos a los de esa ciudad. |
| **Gestión de Emprendimientos** | Crear nuevos emprendimientos (puede tener varios) y modificar los datos de los existentes. |
| **Gestión de Viandas** | Crear, modificar, dar de baja o borrar viandas asociadas a sus emprendimientos. |
| **Gestión de Pedidos** | Visualiza todos los pedidos y puede pasarlos a estado **Aceptado** o **Cancelado**. |
| **Perfil** | Ver notificaciones, datos y pedidos pendientes de gestión. |

## ⚙️ Arquitectura Destacada (Stateless & Signals)

El sistema utiliza **Angular Signals** para manejar el estado reactivo, especialmente la `ciudadSeleccionada`.

Al cambiar la ciudad, la *Signal* se actualiza y los componentes (`EmprendimientosListComponent`) reaccionan automáticamente, solicitando el nuevo conjunto de datos a la API sin depender del ciclo tradicional de `NgZone`. Esto garantiza un alto rendimiento y un código más limpio.

## 💻 Instrucciones de Instalación y Ejecución

### 1. Pre-requisitos

Asegúrese de tener instalados:

* Node.js (LTS recomendado)
* Angular CLI (`npm install -g @angular/cli`)
* La API Backend de Spring Boot debe estar en ejecución.

### 2. Clonar e Instalar

```bash
# Clonar el repositorio
git clone [URL_DEL_REPOSITORIO]
cd FoodieConnect-Frontend

# Instalar dependencias
npm install


