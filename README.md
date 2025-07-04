# Proyecto Final – **IRIS | Simulador Ecommerce de Relojes**



> Este repositorio contiene un simulador completo de Ecommerce que permite explorar productos, gestionar un carrito persistente y finalizar una compra ficticia, todo con una interfaz moderna y 100 % funcional.

---

## Tecnologías & librerías

* **HTML5 / CSS3** – Maquetado y estilos responsive (Flexbox + Grid).
* **JavaScript ES6+** – POO, async/await, módulos nativos.
* **SweetAlert2** – Notificaciones y diálogos modernos (reemplazo de alert).
* **localStorage** – Persistencia del carrito y suscriptor.
* **Fetch API** – Carga asíncrona de `productos.json`.
* **Animaciones CSS** – Keyframes y transiciones.

---

## Métodos y buenas prácticas aplicadas

| Técnica                              | Ejemplos                                                      |
| ------------------------------------ | ------------------------------------------------------------- |
| **Programación orientada a objetos** | Clase `TiendaIRIS` con estado interno de productos y carrito. |
| **Manipulación del DOM**             | Plantillas literales para tarjetas y elementos del carrito.   |
| **Delegación de eventos**            | Botones dinámicos `add-to-cart`, `quantity-btn`.              |
| **Persistencia**                     | Sincronización automática `localStorage` <-> estado.          |
| **Validación de inputs**             | Regex de email + feedback SweetAlert2.                        |
| **Accesibilidad & UX**               | Cierre de modales con *Escape*, foco visual, diseños móviles. |

---

## Estructura del repositorio

```
ProyectoFinal-Mendoz/
├── index.html          # Landing & destacados
├── relojes.html        # Catálogo completo
├── styles.css          # Estilos globales responsive
├── main.js             # Lógica JS principal
├── productos.json      # Fuente de datos (mock remoto)
├── imagenes/           # Recursos gráficos
└── README.md           # Este documento
```

## Roadmap • Mejora futura

* Autenticación de usuarios y órdenes históricas.
* Integración con pasarela de pagos simulada.
* Panel de administración para CRUD de productos.
* Tests unitarios con Vitest/Jest.

---

## Autor

**Ignacio  Mendoz**

