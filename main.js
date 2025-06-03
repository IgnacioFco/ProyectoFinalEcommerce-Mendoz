//Usuario

document.addEventListener('DOMContentLoaded', () => {

const nombreGuardado = localStorage.getItem('nombreUsuario');

if (!nombreGuardado) {
    const nombre = prompt('Bienvenido! Como es tu usuario?');

    if (nombre) {
        localStorage.setItem('nombreUsuario', nombre);
        alert(`Hola, ${nombre}`);
    }
} else {
    alert(`Bienvenido de nuevo, ${nombreGuardado}.`);
}
});




// Formulario

const form = document.querySelector('.contacto-form');

form.addEventListener('submit', function(event) {
    event.preventDefault();

    const emailInput = document.querySelector('.contacto-input');
    const email = emailInput.value.trim();

   
    if (email === '' || !email.includes('@')) {
        alert('Por favor, ingresa un email válido.');
        return;
    }

    localStorage.setItem('suscriptorEmail', email);

    alert(`¡Gracias por suscribirte, ${email}!`);

    emailInput.value = '';

});


//Carrito

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function agregarAlCarrito(producto) {
    const index = carrito.findIndex(item => item.id === producto.id);
    if (index !== -1) {
        carrito[index].cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    guardarCarrito();
    actualizarContador();
    alert(`✅ "${producto.nombre}" fue agregado al carrito`);
}

function actualizarContador() {
    const contador = document.querySelector('.cart-count');
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    contador.textContent = totalItems;
}

//Vaciar carrito

document.getElementById('vaciar-carrito').addEventListener('click', () => {
    carrito = [];
    guardarCarrito();
    actualizarContador();
    alert('🗑 El carrito ha sido vaciado.');
});


document.addEventListener('DOMContentLoaded', () => {

    const botones = document.querySelectorAll('.add-to-cart-btn');

    botones.forEach(boton => {
        boton.addEventListener('click', () => {
            const id = boton.dataset.id;
            const nombre = boton.dataset.nombre;
            const precio = parseFloat(boton.dataset.precio);

            const producto = { id, nombre, precio };
            agregarAlCarrito(producto);
        });
    });

    
    actualizarContador();
});
