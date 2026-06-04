(function() {
    const windows = document.querySelectorAll('.vista-window');

    function attachEvents(win) {
        const minBtn = win.querySelector('.btn.min');
        const maxBtn = win.querySelector('.btn.max');
        const closeBtn = win.querySelector('.btn.close');

        // MINIMIZAR
        if (minBtn) {
            minBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                win.classList.toggle('minimized');
            });
        }

        // MAXIMIZAR (efecto demo visual)
        if (maxBtn) {
            maxBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                win.style.transform = 'scale(1.02)';
                win.style.boxShadow = '0 0 0 2px #9bc9ff, 0 15px 35px rgba(0,0,0,0.3)';
                setTimeout(() => {
                    win.style.transform = '';
                    win.style.boxShadow = '';
                }, 200);

                // Toast estilo aero
                const toast = document.createElement('div');
                toast.innerText = '✨ Vista máxima (Aero Glass) — solo efecto ✨';
                toast.style.position = 'fixed';
                toast.style.bottom = '20px';
                toast.style.left = '50%';
                toast.style.transform = 'translateX(-50%)';
                toast.style.backgroundColor = '#eef3fc';
                toast.style.color = '#135b8d';
                toast.style.padding = '8px 20px';
                toast.style.borderRadius = '40px';
                toast.style.fontSize = '12px';
                toast.style.fontWeight = 'bold';
                toast.style.border = '1px solid white';
                toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                toast.style.backdropFilter = 'blur(6px)';
                toast.style.zIndex = '9999';
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 1500);
            });
        }

        // CERRAR VENTANA
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                win.style.transition = 'all 0.2s ease';
                win.style.opacity = '0';
                win.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    win.remove();
                    const remaining = document.querySelectorAll('.vista-window').length;
                    if (remaining === 0) {
                        const msg = document.createElement('div');
                        msg.style.position = 'fixed';
                        msg.style.top = '40%';
                        msg.style.left = '50%';
                        msg.style.transform = 'translate(-50%, -50%)';
                        msg.style.backgroundColor = 'rgba(255,255,240,0.95)';
                        msg.style.backdropFilter = 'blur(16px)';
                        msg.style.padding = '30px';
                        msg.style.borderRadius = '32px';
                        msg.style.fontWeight = 'bold';
                        msg.style.fontSize = '1.2rem';
                        msg.style.border = '2px solid #b0e0ff';
                        msg.innerHTML = '🎶 Todas las ventanas cerradas 🎶<br>🔄 Recarga la página para ver las 10 ventanas musicales.';
                        msg.style.color = '#045c8c';
                        msg.style.textAlign = 'center';
                        msg.style.zIndex = '10000';
                        document.body.appendChild(msg);
                    }
                }, 150);
            });
        }
    }

    windows.forEach(win => attachEvents(win));

    // Doble clic en la barra de título = minimizar
    windows.forEach(win => {
        const titleBar = win.querySelector('.title-bar');
        if (titleBar) {
            titleBar.addEventListener('dblclick', () => {
                win.classList.toggle('minimized');
            });
        }
    });
})();