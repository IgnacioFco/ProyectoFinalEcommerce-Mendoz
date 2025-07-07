//Main.Js
class TiendaIRIS {
    constructor() {
        this.productos = [];
        // Carga el carrito del localStorage o inicia vacío
        this.carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        this.init();
    }

    init() {
        this.cargarProductosDesdeJSON();
        this.inicializarEventos();
        this.actualizarContadorCarrito();
        this.mostrarCarrito();
    }


    // Gestionar productos

    async cargarProductosDesdeJSON() {
        try {
            const esPaginaRelojes = window.location.pathname.includes("relojes.html");

            if (esPaginaRelojes) {
                this.productos = [
                    { id: 1, nombre: "I-GOLD A9000", descripcion: "El icónico G-SHOCK de metal con conectividad Bluetooth y energía solar.", precio: 999, categoria: "I-GOLD", imagen: "imagenes/RelojAAA.jpg", stock: 10 },
                    { id: 2, nombre: "LONDON B500", descripcion: "Elegancia deportiva con tecnología Bluetooth y cronógrafo de alta precisión.", precio: 350, categoria: "LONDON", imagen: "imagenes/rELOJBBB.jpg", stock: 15 },
                    { id: 3, nombre: "BAM G-290", descripcion: "Diseño juvenil y vibrante con resistencia al agua y múltiples funciones.", precio: 120, categoria: "BAM-G", imagen: "imagenes/RelojCCC.jpg", stock: 8 },
                    { id: 4, nombre: "I-GOLD A8500", descripcion: "Versión clásica con acabado dorado y funciones avanzadas de cronometraje.", precio: 699, categoria: "I-GOLD", imagen: "imagenes/rELOJaa.jpg", stock: 5 },
                    { id: 5, nombre: "LONDON B350", descripcion: "Diseño elegante y minimalista con pantalla digital y analógica.", precio: 280, categoria: "LONDON", imagen: "imagenes/relojBB.jpg", stock: 12 },
                    { id: 6, nombre: "BAM G-180", descripcion: "Modelo básico con gran durabilidad y diseño colorido para jóvenes.", precio: 89, categoria: "BAM-G", imagen: "imagenes/Relojcccc.jpg", stock: 20 }
                ];
            } else {
                // cargar los productos desde productos.json
                const respuesta = await fetch('productos.json');
                if (!respuesta.ok) throw new Error('No se pudo cargar productos');
                this.productos = await respuesta.json();
            }

            if (!esPaginaRelojes) {
                 this.cargarProductos(); 
            }
            this.agregarEventosProductos(); 
            
        } catch (error) {
            this.mostrarNotificacion('⚠️ Error al cargar los productos', 'error');
            console.error('Error al cargar productos:', error);
        }
    }


    cargarProductos() {
        const contenedor = document.getElementById('products-grid'); // ID del grid en index.html
        if (!contenedor) return;

        // Mostrar solo los primeros 3 productos 
        const productosDestacados = this.productos.slice(0, 3);
        
        contenedor.innerHTML = productosDestacados.map(producto => 
            this.crearTarjetaProducto(producto)
        ).join('');
    }

    crearTarjetaProducto(producto) {
        return `
            <div class="product-card" data-id="${producto.id}">
                <div class="product-image">
                    <img src="${producto.imagen}" alt="Imagen de ${producto.nombre}" class="product-thumbnail">
                </div>
                <div class="product-content">
                    <h3 class="product-title">${producto.nombre}</h3>
                    <p class="product-description">${producto.descripcion}</p>
                    <div class="product-price">$${producto.precio}</div>
                    <div class="product-stock">Stock: ${producto.stock} unidades</div>
                    <button class="add-to-cart-btn" 
                            data-id="${producto.id}" 
                            ${producto.stock === 0 ? 'disabled' : ''}>
                        ${producto.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                    </button>
                </div>
            </div>
        `;
    }

    agregarEventosProductos() {
        const botonesExistentes = document.querySelectorAll('.add-to-cart-btn');
        botonesExistentes.forEach(boton => {
            const nuevoBoton = boton.cloneNode(true);
            boton.parentNode.replaceChild(nuevoBoton, boton);
        });

        const botones = document.querySelectorAll('.add-to-cart-btn');
        botones.forEach(boton => {
            boton.addEventListener('click', (e) => {
                const productId = parseInt(e.target.getAttribute('data-id'));
                this.agregarAlCarrito(productId);
            });
        });
    }


    // GESTIÓN DEL CARRITO

    agregarAlCarrito(productId) {
        const producto = this.productos.find(p => p.id === productId);
        if (!producto) return;

        const itemExistente = this.carrito.find(item => item.id === productId);
        
        if (itemExistente) {
            if (itemExistente.cantidad < producto.stock) {
                itemExistente.cantidad++;
                this.mostrarNotificacion(`✅ Se agregó otra unidad de "${producto.nombre}"`, 'success');
            } else {
                this.mostrarNotificacion(`⚠️ No hay más stock de "${producto.nombre}"`, 'warning');
                return;
            }
        } else {
            if (producto.stock > 0) {
                this.carrito.push({
                    id: producto.id,
                    nombre: producto.nombre,
                    precio: producto.precio,
                    cantidad: 1,
                    imagen: producto.imagen
                });
                this.mostrarNotificacion(`✅ "${producto.nombre}" agregado al carrito`, 'success');
            } else {
                this.mostrarNotificacion(`⚠️ "${producto.nombre}" está agotado`, 'warning');
                return;
            }
        }

        this.guardarCarrito();
        this.actualizarContadorCarrito();
        this.mostrarCarrito();
    }

    eliminarDelCarrito(productId) {
        const index = this.carrito.findIndex(item => item.id === productId);
        if (index !== -1) {
            const nombreProducto = this.carrito[index].nombre;
            this.carrito.splice(index, 1);
            this.guardarCarrito();
            this.actualizarContadorCarrito();
            this.mostrarCarrito();
            this.mostrarNotificacion(`🗑️ "${nombreProducto}" eliminado del carrito`, 'info');
        }
    }

    modificarCantidad(productId, nuevaCantidad) {
        const item = this.carrito.find(item => item.id === productId);
        const producto = this.productos.find(p => p.id === productId);
        
        if (item && producto) {
            if (nuevaCantidad <= 0) {
                this.eliminarDelCarrito(productId);
            } else if (nuevaCantidad <= producto.stock) {
                item.cantidad = nuevaCantidad;
                this.guardarCarrito();
                this.actualizarContadorCarrito();
                this.mostrarCarrito();
            } else {
                this.mostrarNotificacion(`⚠️ Solo hay ${producto.stock} unidades disponibles`, 'warning');
            }
        }
    }
    
    vaciarCarrito() {
        if (this.carrito.length === 0) {
            this.mostrarNotificacion('🛒 El carrito ya está vacío', 'info');
            return;
        }

        Swal.fire({
            title: '¿Vaciar carrito?',
            text: 'Esta acción eliminará todos los productos del carrito',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, vaciar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6'
        }).then((result) => {
            if (result.isConfirmed) {
                this.carrito = [];
                this.guardarCarrito();
                this.actualizarContadorCarrito();
                this.mostrarCarrito();
                this.mostrarNotificacion('🗑️ Carrito vaciado correctamente', 'info');
            }
        });
    }


    // INTERFAZ DEL CARRITO

    mostrarCarrito() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        
        if (!cartItems || !cartTotal) return;

        if (this.carrito.length === 0) {
            cartItems.innerHTML = '<p class="cart-empty">Tu carrito está vacío</p>';
            cartTotal.textContent = '0';
            return;
        }

        cartItems.innerHTML = this.carrito.map(item => 
            this.crearItemCarrito(item)
        ).join('');

        cartTotal.textContent = this.calcularTotal();
        this.agregarEventosCarrito();
    }

    //crear el HTML para cada ítem en el carrito
    crearItemCarrito(item) {
        return `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.imagen}" alt="Imagen de ${item.nombre}" class="cart-thumbnail">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.nombre}</h4>
                    <p class="cart-item-price">$${item.precio}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <span class="quantity">${item.cantidad}</span>
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                </div>
                <div class="cart-item-total">
                    $${(item.precio * item.cantidad).toFixed(2)}
                </div>
                <button class="remove-item" data-id="${item.id}">🗑️</button>
            </div>
        `;
    }

    agregarEventosCarrito() {
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.getAttribute('data-id'));
                const item = this.carrito.find(item => item.id === productId);
                
                if (e.target.classList.contains('increase')) {
                    this.modificarCantidad(productId, item.cantidad + 1);
                } else if (e.target.classList.contains('decrease')) {
                    this.modificarCantidad(productId, item.cantidad - 1);
                }
            });
        });

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.getAttribute('data-id'));
                this.eliminarDelCarrito(productId);
            });
        });
    }

  // FINALIZACIÓN DE COMPRA

   finalizarCompra() {
    if (this.carrito.length === 0) {
        this.mostrarNotificacion('🛒 Tu carrito está vacío', 'warning');
        return;
    }

    const stockInsuficiente = this.carrito.some(item => {
        const producto = this.productos.find(p => p.id === item.id);
        return item.cantidad > producto.stock;
    });

    if (stockInsuficiente) {
        this.mostrarNotificacion('⚠️ Algunos productos no tienen stock suficiente', 'warning');
        return;
    }

    const resumenOrden = this.carrito.map(item => 
        `${item.nombre} x${item.cantidad} - $${(item.precio * item.cantidad).toFixed(2)}`
    ).join('<br>');

    const total = this.calcularTotal();
    const numeroOrden = this.generarNumeroOrden();

    Swal.fire({
        title: '¡Compra realizada!',
        html: `Gracias por tu compra.<br><strong>Total:</strong> $${total}<br><strong>Número de orden:</strong> #${numeroOrden}`,
        icon: 'success',
        confirmButtonText: 'Ver detalles',
        confirmButtonColor: '#4ecdc4'
    }).then(() => {
        // ✅ Vaciar el carrito
        this.carrito = [];
        this.guardarCarrito();
        this.actualizarContadorCarrito();
        this.mostrarCarrito();

        this.mostrarModalExito(resumenOrden, total, numeroOrden);
        this.cerrarCarrito();
    });
}


    generarNumeroOrden() {
        return Date.now().toString().slice(-8);
    }

    mostrarModalExito(resumen, total, numeroOrden) {
        const modal = document.getElementById('success-modal');
        const orderSummary = document.getElementById('order-summary');
        const orderNumber = document.getElementById('order-number');

        if (modal && orderSummary && orderNumber) {
            orderSummary.innerHTML = `
                <div class="order-details">
                    <h3>Resumen de tu pedido:</h3>
                    <div class="order-items">${resumen}</div>
                    <div class="order-total"><strong>Total pagado: $${total}</strong></div>
                </div>
            `;
            orderNumber.textContent = numeroOrden;
            modal.style.display = 'flex';
        }
    }


    // Util

    calcularTotal() {
        return this.carrito.reduce((total, item) => 
            total + (item.precio * item.cantidad), 0
        ).toFixed(2);
    }

    actualizarContadorCarrito() {
        const contador = document.querySelector('.cart-count');
        if (contador) {
            const totalItems = this.carrito.reduce((sum, item) => sum + item.cantidad, 0);
            contador.textContent = totalItems;
        }
    }

    guardarCarrito() {
        localStorage.setItem('carrito', JSON.stringify(this.carrito));
    }

    // ====================================
    // INTERFAZ DE USUARIO
    // ====================================

    toggleCarrito() {
        const cartPanel = document.getElementById('cart-panel');
        const cartOverlay = document.getElementById('cart-overlay');
        
        if (cartPanel && cartOverlay) {
            cartPanel.classList.toggle('active');
            cartOverlay.classList.toggle('active');
        }
    }

    cerrarCarrito() {
        const cartPanel = document.getElementById('cart-panel');
        const cartOverlay = document.getElementById('cart-overlay');
        
        if (cartPanel && cartOverlay) {
            cartPanel.classList.remove('active');
            cartOverlay.classList.remove('active');
        }
    }


    mostrarNotificacion(mensaje, tipo = 'info') {
        Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            icon: tipo === 'success' ? 'success' : (tipo === 'error' ? 'error' : (tipo === 'warning' ? 'warning' : 'info')),
            title: mensaje
        });
    }

    // ====================================
    // EVENTOS PRINCIPALES
    // ====================================

    inicializarEventos() {
        // Eventos del carrito
        const toggleCartBtn = document.getElementById('toggle-cart');
        const closeCartBtn = document.getElementById('close-cart');
        const cartOverlay = document.getElementById('cart-overlay');
        const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
        const finalizarCompraBtn = document.getElementById('finalizar-compra');

        if (toggleCartBtn) {
            toggleCartBtn.addEventListener('click', () => this.toggleCarrito());
        }

        if (closeCartBtn) {
            closeCartBtn.addEventListener('click', () => this.cerrarCarrito());
        }

        if (cartOverlay) {
            cartOverlay.addEventListener('click', () => this.cerrarCarrito());
        }

        if (vaciarCarritoBtn) {
            vaciarCarritoBtn.addEventListener('click', () => this.vaciarCarrito());
        }

        if (finalizarCompraBtn) {
            finalizarCompraBtn.addEventListener('click', () => this.finalizarCompra());
        }


        const closeSuccessModal = document.getElementById('close-success-modal');
        if (closeSuccessModal) {
            closeSuccessModal.addEventListener('click', () => {
                document.getElementById('success-modal').style.display = 'none';
                this.carrito = [];
                this.guardarCarrito();
                this.actualizarContadorCarrito();
                this.mostrarCarrito();
                this.cargarProductosDesdeJSON();
            });
        }

        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => this.manejarSuscripcion(e));
        }

        // Cerrar modal con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.cerrarCarrito();
                const modal = document.getElementById('success-modal');
                if (modal && modal.style.display === 'flex') {
                    modal.style.display = 'none';
                    this.carrito = [];
                    this.guardarCarrito();
                    this.actualizarContadorCarrito();
                    this.mostrarCarrito();
                    this.cargarProductosDesdeJSON();
                }
            }
        });
    }

    //Contacto

    manejarSuscripcion(event) {
        event.preventDefault();
        
        const emailInput = document.getElementById('email-input');
        const email = emailInput.value.trim();

        if (email === '' || !this.validarEmail(email)) {
            this.mostrarNotificacion('Por favor, ingresa un email válido', 'warning');
            return;
        }

        localStorage.setItem('suscriptorEmail', email);
        Swal.fire({
            title: '¡Gracias por suscribirte!',
            text: `Hemos registrado tu email correctamente.`,
            icon: 'success',
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#4ecdc4'
        });
        emailInput.value = ''; 
    }

    validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
}



//carrousel
document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll(".carousel-image");
  let current = 0;

  setInterval(() => {
    images[current].classList.remove("active");
    current = (current + 1) % images.length;
    images[current].classList.add("active");
  }, 5000);
});



document.addEventListener('DOMContentLoaded', () => {
    window.tiendaIRIS = new TiendaIRIS();

    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('nav-menu-active');
        });
    }
});