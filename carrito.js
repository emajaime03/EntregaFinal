const carritoAlmacenado = localStorage.getItem("carrito")
const carritoVacio = document.querySelector('#carrito-vacio')
const listaCarrito = document.querySelector('#carrito')
const verificarContenido = document.querySelector('#seccion-carrito-pago')

let arrayCarrito = []

arrayCarrito = JSON.parse(carritoAlmacenado)

let precioTotal = 0

actualizarCarrito()

function actualizarCarrito() {

    if (arrayCarrito == null || arrayCarrito.length == 0) {
        verificarContenido.remove()
        listaCarrito.remove()

        let contenedor = document.createElement('div')
        contenedor.className = 'carrito-vacio'
        contenedor.innerHTML = `
        <h3>El carrito está vacio 🙁</h3>
        `
        carritoVacio.appendChild(contenedor)

    }
    else {

        precioTotal = actualizarTotal()

        agregarElementosCarrito(precioTotal)
    }
}

function agregarElementosCarrito(total) {
    listaCarrito.innerHTML = ''
    arrayCarrito.forEach(producto => {
        let lista = document.createElement('li')
        lista.classList.add('carrito')
        lista.innerHTML = `
                <h3>${producto.nombre}</h3>
                <p>CANTIDAD: ${producto.cantidad}</p> 
                <p class="carrito-precio">$${producto.precio}</p>
                <p>Subtotal: $${producto.precio * producto.cantidad}</p>
                <button class="btnEliminarCarrito" id="${producto.id}"><i class="bi bi-trash icono-basura"></i></button>
            `
        listaCarrito.appendChild(lista)
    });

    let precio = document.createElement('div')
    precio.classList.add('carrito')
    precio.innerHTML = `
                <h3>Total: </h3>
                <p>$${total}</p>
            `
    listaCarrito.appendChild(precio)

    actualizarBotonesEliminar()
}

function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".btnEliminarCarrito")

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito)
    })
}

function eliminarDelCarrito(e) {
    let idBoton = e.currentTarget.id
    const index = arrayCarrito.findIndex(producto => producto.id == idBoton)
    arrayCarrito.splice(index, 1)
    actualizarCarrito()
    localStorage.setItem("carrito", JSON.stringify(arrayCarrito))
}

// PAGO -------------------------

const listaTarjetas = document.querySelector('#tarjetas')
const confirmarCompra = document.querySelector('#confirmarCompra')
const tarjetaInput = document.querySelector('#tarjetaInput');

let arrayTarjetas = []

obtenerDatos()

async function obtenerDatos() {

    try {
        const respuesta = await fetch("./data.json")

        const datos = await respuesta.json()

        arrayTarjetas = datos.tarjetas

        agregarTarjetas()
    }
    catch {

    }
}

function agregarTarjetas() {
    arrayTarjetas.forEach(t => {
        let tarjetas = document.createElement('li')
        tarjetas.className = 'tarjetas'
        tarjetas.id = `${t.id}`
        tarjetas.innerHTML = `

        <h3>${t.proveedor}</h3>
        <p>Descuento: ${t.descuento * 100}%</p>
        `
        listaTarjetas.appendChild(tarjetas)
    })

    actualizarBotonesTarjetas()
}

if (arrayCarrito == null || arrayCarrito.length == 0) {
    verificarContenido.remove()
}

function actualizarBotonesTarjetas() {
    btnTarjetas = document.querySelectorAll(".tarjetas")

    btnTarjetas.forEach(boton => {
        boton.addEventListener("click", (e) => {
            const idBoton = e.currentTarget.id

            tarjetaElegida = arrayTarjetas.find((t) => t.id == idBoton)

            tarjetaInput.value = tarjetaElegida.proveedor
        })
    })
}

confirmarCompra.addEventListener('click', () => {

    const tarjetaElegida = tarjetaInput.value;

    let tarjeta = arrayTarjetas.find((t) => t.proveedor == tarjetaElegida.toUpperCase())

    if (tarjeta != undefined) {
        localStorage.removeItem("carrito")
        arrayCarrito = []
        actualizarCarrito()
        Swal.fire({
            title: `Compra realizada`,
            text: `El total de la compra es $${calcularTotal(precioTotal, tarjeta.descuento)}`,
            icon: "success"
        });
    }
    else {
        Swal.fire({
            title: `Esa tarjeta no existe`,
            text: `Intente de nuevo`,
            icon: "error"
        });
    }
    tarjetaInput.value = ''
})

function actualizarTotal() {
    const totalCalculado = arrayCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    return totalCalculado
}

function calcularTotal(total, tarjeta) {

    let final = total * tarjeta
    final = total - final

    return final
}