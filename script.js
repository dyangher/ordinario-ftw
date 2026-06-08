// script.js - Carga datos desde XML y genera tarjetas de música y juegos
document.addEventListener('DOMContentLoaded', () => {
    console.log('Script iniciado. Buscando datos.xml...');

    // Función auxiliar para escapar HTML
    function escapeHTML(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    // Función para mostrar errores dentro de los contenedores
    function mostrarError(contenedor, mensaje) {
        if (contenedor) {
            contenedor.innerHTML = `<div class="panel" style="background: rgba(255,200,200,0.8); border: 1px solid red; text-align:center;">
                <p style="color: darkred;">⚠️ ${mensaje}</p>
                <p style="font-size: 0.8rem;">Revisa la consola (F12) para más detalles.</p>
            </div>`;
        }
        console.error(mensaje);
    }

    // Cargar el XML
    fetch('datos.xml')
        .then(response => {
            console.log('Respuesta del fetch:', response.status, response.statusText);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: No se pudo cargar datos.xml. Asegúrate de que el archivo existe en la misma carpeta.`);
            }
            return response.text();
        })
        .then(xmlString => {
            console.log('XML cargado, longitud:', xmlString.length);
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

            // Detectar error de sintaxis en el XML
            const parseError = xmlDoc.querySelector('parsererror');
            if (parseError) {
                throw new Error('Error de sintaxis en el XML: ' + parseError.textContent.substring(0, 150));
            }

            console.log('XML parseado correctamente');

            // Determinar en qué página estamos
            const path = window.location.pathname;
            const isMusica = path.includes('musica.html') || document.querySelector('.music-grid');
            const isJuegos = path.includes('juegos.html') || document.querySelector('.cards-grid');

            // --- Cargar MÚSICA (si estamos en musica.html o hay .music-grid) ---
            if (isMusica) {
                const container = document.querySelector('.music-grid');
                if (container) {
                    container.innerHTML = ''; // limpiar
                    const bandas = xmlDoc.querySelectorAll('banda');
                    console.log(`Bandas encontradas: ${bandas.length}`);
                    if (bandas.length === 0) {
                        container.innerHTML = '<div class="panel"><p>No se encontraron bandas en el XML.</p></div>';
                    } else {
                        bandas.forEach(banda => {
                            const nombre = banda.querySelector('nombre')?.textContent || 'Sin nombre';
                            const imagen = banda.querySelector('imagen')?.textContent || 'https://placehold.co/200x200';
                            const descripcion = banda.querySelector('descripcion')?.textContent || '';
                            const card = document.createElement('div');
                            card.className = 'music-card';
                            card.innerHTML = `
                                <img src="${imagen}" alt="${nombre}" loading="lazy" onerror="this.src='https://placehold.co/200x200?text=Error+imagen'">
                                <h3>${escapeHTML(nombre)}</h3>
                                <p>${escapeHTML(descripcion)}</p>
                            `;
                            container.appendChild(card);
                        });
                        console.log(`✅ Se generaron ${bandas.length} tarjetas de música.`);
                    }
                }
            }

            // --- Cargar JUEGOS (si estamos en juegos.html o hay .cards-grid) ---
            if (isJuegos) {
                const container = document.querySelector('.cards-grid');
                if (container) {
                    container.innerHTML = '';
                    const juegos = xmlDoc.querySelectorAll('juego');
                    console.log(`Juegos encontrados: ${juegos.length}`);
                    if (juegos.length === 0) {
                        container.innerHTML = '<div class="panel"><p>No se encontraron juegos en el XML.</p></div>';
                    } else {
                        juegos.forEach(juego => {
                            const nombre = juego.querySelector('nombre')?.textContent || 'Sin título';
                            const imagen = juego.querySelector('imagen')?.textContent || 'https://placehold.co/300x300';
                            const descripcion = juego.querySelector('descripcion')?.textContent || '';
                            const card = document.createElement('div');
                            card.className = 'game-card';
                            card.innerHTML = `
                                <img src="${imagen}" alt="${nombre}" loading="lazy" onerror="this.src='https://placehold.co/300x300?text=Error+imagen'">
                                <h3>${escapeHTML(nombre)}</h3>
                                <p>${escapeHTML(descripcion)}</p>
                            `;
                            container.appendChild(card);
                        });
                        console.log(`✅ Se generaron ${juegos.length} tarjetas de juegos.`);
                    }
                }
            }

            // Si no hay contenedor en esta página, no pasa nada (ej: index.html)
        })
        .catch(error => {
            console.error('❌ Error al procesar el XML:', error);
            // Mostrar error visual en los contenedores si existen
            const musicContainer = document.querySelector('.music-grid');
            const gamesContainer = document.querySelector('.cards-grid');
            const msg = error.message;
            if (musicContainer) mostrarError(musicContainer, msg);
            if (gamesContainer) mostrarError(gamesContainer, msg);
        });

    // Desactivar funcionalidad de los botones de ventana (decorativos)
    const btns = document.querySelectorAll('.btn');
    btns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            // No hacen nada
        });
    });
});