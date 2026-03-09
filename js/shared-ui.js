(function () {
    function getHeaderTemplate(activePage) {
        var dashboardActive = activePage === 'dashboard' ? 'active' : '';
        var projectsActive = activePage === 'projects' ? 'active' : '';

        return (
            '<div class="header-left">' +
            '  <button class="icon-btn mobile-menu-btn d-lg-none" type="button" aria-label="Menu" id="mobileMenuBtn">' +
            '    <i class="bi bi-list"></i>' +
            '    <i class="bi bi-x-lg"></i>' +
            '  </button>' +
            '  <div class="header-logos">' +
            '    <img class="header-gov-logo" src="assets/images/govt-logo-dark.png" alt="Government logo">' +
            '    <img class="header-ft-logo" src="assets/images/fasttrack-logo-dark.png" alt="FastTrack logo">' +
            '  </div>' +
            '</div>' +
            '<div class="header-center">' +
            '  <div class="helpline">' +
            '    <div class="helpline-ic"><i class="fa-solid fa-headset"></i></div>' +
            '    <div class="helpline-txt">' +
            '      <div class="small text-muted fw-semibold">HELP LINE : 0172-4866999</div>' +
            '      <div class="small text-muted">9:00 AM TO 5:00 PM</div>' +
            '    </div>' +
            '  </div>' +
            '</div>' +
            '<div class="header-right">' +
            '  <button class="icon-btn d-none d-lg-grid" type="button" aria-label="Theme">' +
            '    <i class="fa-regular fa-moon"></i>' +
            '  </button>' +
            '  <div class="dropdown">' +
            '    <button class="icon-btn shortcut-btn" type="button" aria-label="Shortcut" data-bs-toggle="dropdown" aria-expanded="false">' +
            '      <i class="fa-solid fa-plus"></i>' +
            '    </button>' +
            '    <ul class="dropdown-menu dropdown-menu-end shortcut-menu">' +
            '      <li><a class="dropdown-item" href="#"><i class="bi bi-file-earmark-text"></i>Fill CAF</a></li>' +
            '      <li><a class="dropdown-item" href="#"><i class="bi bi-file-earmark-richtext"></i>Fill S-CAF</a></li>' +
            '      <li><a class="dropdown-item" href="#"><i class="bi bi-clock-history"></i>Applied Application</a></li>' +
            '      <li><a class="dropdown-item" href="#"><i class="bi bi-patch-check"></i>Issued Application</a></li>' +
            '      <li><a class="dropdown-item" href="#"><i class="bi bi-x-circle"></i>Rejected Application</a></li>' +
            '      <li><a class="dropdown-item" href="#"><i class="bi bi-arrow-counterclockwise"></i>Withdrawn Application</a></li>' +
            '      <li><a class="dropdown-item" href="#"><i class="bi bi-list-ul"></i>View Logs</a></li>' +
            '    </ul>' +
            '  </div>' +
            '  <div class="dropdown">' +
            '    <button class="user-pill" type="button" data-bs-toggle="dropdown" aria-expanded="false">' +
            '      <span class="user-ic"><i class="fa-solid fa-user"></i></span>' +
            '      <span class="user-name">Welcome Ankit Kumar</span>' +
            '      <span class="user-caret"><i class="fa-solid fa-chevron-down"></i></span>' +
            '    </button>' +
            '    <ul class="dropdown-menu dropdown-menu-end user-menu">' +
            '      <li><a class="dropdown-item" href="#"><i class="bi bi-translate"></i>Change Language</a></li>' +
            '      <li><a class="dropdown-item" href="#"><i class="bi bi-person"></i>My Account</a></li>' +
            '      <li><a class="dropdown-item" href="#"><i class="bi bi-key"></i>Change Password</a></li>' +
            '      <li><hr class="dropdown-divider"></li>' +
            '      <li><a class="dropdown-item" href="#"><i class="bi bi-box-arrow-right"></i>Logout</a></li>' +
            '    </ul>' +
            '  </div>' +
            '</div>'
        );
    }

    function mountHeader() {
        var header = document.querySelector('.app-header');
        if (!header) return;

        var activePage = header.getAttribute('data-active-page') || '';
        header.innerHTML = getHeaderTemplate(activePage);
    }

    function setupMobileCardNavigation() {
        var cards = document.querySelectorAll('.dash-card');
        if (!cards.length) return;

        function shouldNavigate() {
            return window.matchMedia('(max-width: 991.98px)').matches;
        }

        cards.forEach(function (card) {
            card.addEventListener('click', function (e) {
                if (!shouldNavigate()) return;

                var target = e.target;
                if (target && (target.closest('a') || target.closest('button') || target.closest('input') || target.closest('select'))) return;

                var link = card.querySelector('a.pill-btn[href]');
                if (!link) return;

                var href = link.getAttribute('href');
                if (!href || href === '#') return;

                window.location.href = href;
            });
        });
    }

    function setupMobileSidebar() {
        var menuBtn = document.getElementById('mobileMenuBtn');
        var backdrop = document.getElementById('sidebarBackdrop');

        function closeSidebar() { document.body.classList.remove('sidebar-open'); }
        function toggleSidebar() { document.body.classList.toggle('sidebar-open'); }

        if (menuBtn) menuBtn.addEventListener('click', toggleSidebar);
        if (backdrop) backdrop.addEventListener('click', closeSidebar);
        window.addEventListener('resize', function () {
            if (window.innerWidth >= 992) closeSidebar();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            mountHeader();
            setupMobileCardNavigation();
            setupMobileSidebar();
        });
    } else {
        mountHeader();
        setupMobileCardNavigation();
        setupMobileSidebar();
    }
})();
