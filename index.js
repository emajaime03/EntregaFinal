let arrayProductos = []

async function obtenerDatos() {

    try {
        const respuesta = await fetch("./data.json")

        const datos = await respuesta.json()

        arrayProductos = datos.productos

        crearCatalogo()
    }
    catch {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Error al cargar los productos",
        });
    }

}

obtenerDatos()

let arrayCarrito = []

let contenedorProductos = document.querySelector('#catalogo')

function crearCatalogo() {
    arrayProductos.forEach(prod => {
        let lista = document.createElement('li')
        lista.className = ''
        lista.innerHTML = `

        <div class="card btnAgregarCarrito" id="${prod.id}">
            <img src="${prod.imagen}" class="image"></img>
            <span class="title">${prod.nombre}</span>
            <span class="price">$${prod.precio}</span>
        </div>
        `
        contenedorProductos.appendChild(lista)
    })

    actualizarBotonesAgregar()
}

function actualizarBotonesAgregar() {
    const btnAgregarCarrito = document.querySelectorAll(".btnAgregarCarrito")

    btnAgregarCarrito.forEach(boton => {
        boton.addEventListener('click', (e) => {

            Toastify({
                text: "Producto agregado",
                duration: 3000,
                close: true,
                offset: {
                    x: 30, // horizontal axis - can be a number or a string indicating unity. eg: '2em'
                    y: 70 // vertical axis - can be a number or a string indicating unity. eg: '2em'
                },
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                    background: "linear-gradient(27deg, rgba(60,61,82,1) 8%, rgba(24,26,72,1) 100%)",
                },
                onClick: function () { } // Callback after click
            }).showToast();

            const productoElegido = e.currentTarget.id;

            agregarCarrito(productoElegido)
        })
    })
}

if (localStorage.getItem("carrito") !== null) {
    let tjsonArrayCarrito = localStorage.getItem("carrito")
    arrayCarrito = JSON.parse(tjsonArrayCarrito)
}

function agregarCarrito(productoElegido) {

    productoAgregado = arrayProductos.find((p) => p.id == productoElegido)

    if (arrayCarrito.some(producto => producto.id == productoElegido)) {
        const index = arrayCarrito.findIndex(producto => producto.id == productoElegido);
        arrayCarrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        arrayCarrito.push(productoAgregado);
    }

    let jsonArrayCarrito = JSON.stringify(arrayCarrito)

    localStorage.setItem("carrito", jsonArrayCarrito)
}