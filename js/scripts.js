let productos = []; // Variable global para almacenar los productos


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
    const eventData = JSON.parse(event.data);

    // Mostrar mensaje de carga
    document.getElementById('loading').style.display = 'flex';
    // document.getElementById('resumen').style.display = 'none';

    //let productos = []; // Variable global para almacenar los productos

    // Enviar los datos a n8n y esperar la respuesta
    fetch('https://n8n.weppa.co/webhook/productos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(eventData)
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