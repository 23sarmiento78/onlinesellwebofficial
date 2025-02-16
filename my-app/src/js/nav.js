document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger-menu');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');
    const body = document.body;

    function toggleMenu() {
        hamburger.classList.toggle('active');
        sidebar.classList.toggle('show');
        overlay.classList.toggle('active');
        body.classList.toggle('menu-open');
    }

    // Toggle menu cuando se hace clic en el hamburger
    hamburger.addEventListener('click', toggleMenu);

    // Cerrar menú cuando se hace clic en el overlay
    overlay.addEventListener('click', toggleMenu);

    // Cerrar menú cuando se hace clic en un enlace
    sidebar.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // Cerrar menú cuando se presiona la tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('show')) {
            toggleMenu();
        }
    });

    // Ajustar la altura del sidebar al cambiar el tamaño de la ventana
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            hamburger.classList.remove('active');
            sidebar.classList.remove('show');
            overlay.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });
});
