let productos = []; // Variable global para almacenar los productos
let eventData ={};

// Función para validar si el JSON es correcto
function isJSONValid(str) {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}

// Escuchar eventos del objeto Window
window.addEventListener("message", function (event) {
    console.log('Received event data:', event.data);

    if (!isJSONValid(event.data)) {
        console.error('Invalid JSON:', event.data);
        return;
    }

    // Procesar los datos del evento
    eventData = JSON.parse(event.data);

    // Mostrar mensaje de carga
    // document.getElementById('loading').style.display = 'flex';
    // document.getElementById('resumen').style.display = 'none';



    // Enviar los datos a n8n y esperar la respuesta
    fetch('https://n8n.weppa.co/webhook/productos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
    })
    .then(response => response.json())
    .then(n8nResponse => {
        console.log('Received response from n8n:', n8nResponse);

        // Verifica si el campo result contiene el array de objetos
        productos = n8nResponse.result || [];
        mostrarProductos(productos); // Mostrar todos los productos inicialmente
        
        

        // Aquí puedes procesar la respuesta de n8n y modificar los datos si es necesario
        // const chatwootData = {
        //     ...eventData, 
        //     reply: n8nResponse.reply || ''
        // };
    })
    .catch((error) => {
        console.error('Error sending data to n8n:', error);
        document.getElementById('loading').style.display = 'none';
    });

    
});




// Función para mostrar los productos
function mostrarProductos(productos) {
    let html = '';
    if (productos.length === 0) {
        html += '<p>No hay resultados para la búsqueda.</p>';
    } else {
        productos.forEach(producto => {
            const name = producto.name || 'Sin título';
            const description = producto.description || 'Sin descripción';
            const price = producto.list_price || '---';
            const imageBase64 = producto.image_128;
            const imageUrl = imageBase64 ? `data:image/jpeg;base64,${imageBase64}` : './assets/images/default_image.png'; // URL de la imagen
            
            const id = producto.id

            
            html += `
                <div class="card">
                    <img src="${imageUrl}" alt="${name}">
                    <h2>${name}</h2>
                    <p>${description}</p>
                    <div class="price">$${price}</div>
                    <button onclick="enviarProducto(${id})">Enviar</button>
                </div>
            `;
        });
    }

    document.getElementById('resumen').innerHTML = html;
    document.getElementById('loading').style.display = 'none';
    document.getElementById('resumen').style.display = 'flex';
    
}


// Función para filtrar los productos por nombre
function filterProducts() {
    const query = document.getElementById('search').value.toLowerCase();
    const filteredProducts = productos.filter(producto => 
        producto.name.toLowerCase().includes(query)
    );

    mostrarProductos(filteredProducts); // Mostrar los productos filtrados
}

// Añadir event listener al cuadro de búsqueda
document.getElementById('search').addEventListener('input', filterProducts);


function enviarProducto(idProducto) {
    // Obtener el producto correspondiente
    const productoSeleccionado = productos.find(producto => producto.id === idProducto);

    if (!productoSeleccionado) {
        console.error('Producto no encontrado');
        return;
    }
    
    console.log("Id conversacion: " + eventData.data.conversation.id);
    // const id_conversacion = eventData.data.conversation.id;
    const id_conversacion = eventData.data.conversation.id;
    

    // Aquí puedes agregar la información que llega con el evento inicial
    const data = {
        
        // ...productoSeleccionado,
        // Agregar cualquier otra información necesaria
        "content": `Producto: ${productoSeleccionado.name}\nDescripción: ${productoSeleccionado.description}\nPrecio: ${productoSeleccionado.list_price}`,
        "message_type": "outgoing"
    };

    // Realizar la solicitud POST
    fetch(`https://chat.weppa.co/api/v1/accounts/1/conversations/${id_conversacion}/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'api_access_token': 'JMWFcKWqAHtAUsrFrMqrzeVX'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(responseData => {
        console.log('Producto enviado con éxito:', responseData);
        // Aquí puedes manejar la respuesta de tu servidor
    })
    .catch(error => {
        console.error('Error al enviar el producto:', error);
    });
}
