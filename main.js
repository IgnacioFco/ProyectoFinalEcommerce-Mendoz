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


