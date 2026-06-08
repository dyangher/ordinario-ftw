// script.js - Carga datos desde XML y genera tarjetas de música y juegos
document.addEventListener('DOMContentLoaded', () => {
    console.log('Script iniciado. Buscando datos.xml...');

    function escapeHTML(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    function mostrarError(contenedor, mensaje) {
        if (contenedor) {
            contenedor.innerHTML = `<div class="panel" style="background: rgba(255,200,200,0.8); border: 1px solid red; text-align:center;">
                <p style="color: darkred;">⚠️ ${mensaje}</p>
                <p style="font-size: 0.8rem;">Revisa la consola (F12) para más detalles.</p>
            </div>`;
        }
        console.error(mensaje);
    }

    fetch('datos.xml')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}: No se pudo cargar datos.xml.`);
            return response.text();
        })
        .then(xmlString => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
            const parseError = xmlDoc.querySelector('parsererror');
            if (parseError) throw new Error('Error de sintaxis en el XML');

            const path = window.location.pathname;
            const isMusica = path.includes('musica.html') || document.querySelector('.music-grid');
            const isJuegos = path.includes('juegos.html') || document.querySelector('.cards-grid');

            if (isMusica) {
                const container = document.querySelector('.music-grid');
                if (container) {
                    container.innerHTML = '';
                    const bandas = xmlDoc.querySelectorAll('banda');
                    if (bandas.length === 0) {
                        container.innerHTML = '<div class="panel"><p>No se encontraron bandas.</p></div>';
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
                    }
                }
            }

            if (isJuegos) {
                const container = document.querySelector('.cards-grid');
                if (container) {
                    container.innerHTML = '';
                    const juegos = xmlDoc.querySelectorAll('juego');
                    if (juegos.length === 0) {
                        container.innerHTML = '<div class="panel"><p>No se encontraron juegos.</p></div>';
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
                    }
                }
            }
        })
        .catch(error => {
            console.error('❌ Error:', error);
            const musicContainer = document.querySelector('.music-grid');
            const gamesContainer = document.querySelector('.cards-grid');
            if (musicContainer) mostrarError(musicContainer, error.message);
            if (gamesContainer) mostrarError(gamesContainer, error.message);
        });

    const btns = document.querySelectorAll('.btn');
    btns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    });
});