// script.js - Carga datos del XML y los muestra en paneles adicionales
document.addEventListener('DOMContentLoaded', () => {
    fetch('datos.xml')
        .then(response => response.text())
        .then(xmlString => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
            
            // Detectar en qué página estamos por el título o el body
            const pagina = document.title.toLowerCase();
            
            // Función para agregar un panel extra con datos del XML
            function agregarPanel(contenido, titulo) {
                const contentDiv = document.querySelector('.content');
                if (!contentDiv) return;
                const nuevoPanel = document.createElement('div');
                nuevoPanel.className = 'panel';
                nuevoPanel.innerHTML = `<h2>📄 Datos desde XML: ${titulo}</h2>${contenido}`;
                contentDiv.appendChild(nuevoPanel);
            }

            // ---------------- MÚSICA ----------------
            if (pagina.includes('música') || document.body.innerHTML.includes('musica.html')) {
                const bandas = xmlDoc.querySelectorAll('entrada');
                let lista = '<ul class="styled-list">';
                bandas.forEach(b => {
                    const nombre = b.querySelector('banda')?.textContent || '?';
                    const album = b.querySelector('album')?.textContent || '?';
                    lista += `<li><strong>${nombre}</strong> - ${album}</li>`;
                });
                lista += '</ul>';
                agregarPanel(lista, 'Bandas desde XML');
            }
            
            // ---------------- JUEGOS ----------------
            if (pagina.includes('juego') || document.body.innerHTML.includes('juegos.html')) {
                const juegos = xmlDoc.querySelectorAll('juego');
                let lista = '<ul class="styled-list">';
                juegos.forEach(j => {
                    const titulo = j.querySelector('titulo')?.textContent || '?';
                    const plataforma = j.querySelector('plataforma')?.textContent || '?';
                    lista += `<li><strong>${titulo}</strong> (${plataforma})</li>`;
                });
                lista += '</ul>';
                agregarPanel(lista, 'Juegos desde XML');
            }
            
            // ---------------- DYANGHER (perfil) ----------------
            if (pagina.includes('dyangher') || document.body.innerHTML.includes('dyangher.html')) {
                const bio = xmlDoc.querySelector('bio')?.textContent || 'No hay biografía en XML';
                const habilidades = xmlDoc.querySelectorAll('habilidad');
                let listaHab = '<ul class="styled-list">';
                habilidades.forEach(h => listaHab += `<li>${h.textContent}</li>`);
                listaHab += '</ul>';
                const contacto = xmlDoc.querySelector('contacto');
                const email = contacto?.getAttribute('email') || 'No especificado';
                const redes = contacto?.getAttribute('red_social') || 'No especificado';
                const contenido = `
                    <p><strong>Biografía:</strong> ${bio}</p>
                    <p><strong>Habilidades:</strong></p>${listaHab}
                    <p><strong>Email:</strong> ${email}<br><strong>Redes:</strong> ${redes}</p>
                `;
                agregarPanel(contenido, 'Perfil desde XML');
            }
            
            // Opcional: mostrar en consola que se cargó
            console.log('XML cargado correctamente');
        })
        .catch(error => console.error('Error al cargar el XML:', error));
});
// Pestañas internas de la página música.html
document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.music-tab-btn');
    const panes = document.querySelectorAll('.music-tab-pane');
    
    if (tabs.length) {
        tabs.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.getAttribute('data-tab');
                tabs.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                panes.forEach(pane => {
                    pane.classList.remove('active');
                    if (pane.id === target) pane.classList.add('active');
                });
            });
        });
    }
    
    // Pequeño efecto: si hay botones de ventana, no hacen nada (solo decorativos)
    const closeBtns = document.querySelectorAll('.btn.close');
    closeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // no hace nada, solo decorativo
        });
    });
});