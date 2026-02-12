// ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==========
let animeData = [];
let currentUser = null;
let allGenres = [];

// ========== ЦЕНТРАЛИЗОВАННОЕ СОХРАНЕНИЕ ==========
function saveAnimeData(data) {
    if (data !== undefined) animeData = data;
    localStorage.setItem('animeData', JSON.stringify(animeData));
    window.dispatchEvent(new Event('storage'));
    return animeData;
}

function syncAnimeData(newData) {
    animeData = newData;
    localStorage.setItem('animeData', JSON.stringify(animeData));
    window.dispatchEvent(new Event('storage'));
    return animeData;
}

// ========== ЗАГРУЗКА ДАННЫХ ==========
async function loadAnimeData() {
    try {
        const saved = localStorage.getItem('animeData');
        if (saved) {
            animeData = JSON.parse(saved);
        } else {
            const response = await fetch('data.json');
            const data = await response.json();
            animeData = data.anime || [];
            localStorage.setItem('animeData', JSON.stringify(animeData));
        }
        loadGenres();
        displayAnime(animeData);
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        animeData = [];
        displayAnime([]);
    }
}

// ========== ГЕНЕРАЦИЯ SVG-ЗАГЛУШКИ ==========
function generateSvgThumbnail(title, width = 300, height = 450, bgColor = '6c5ce7') {
    if (!title) title = 'Anime';
    const short = title.slice(0, 15).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const fontSize = Math.min(20, width / 10);
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'%3E%3Crect width='${width}' height='${height}' fill='%23${bgColor}'/%3E%3Ctext x='50%25' y='50%25' font-size='${fontSize}' fill='white' text-anchor='middle' dy='.3em'%3E${encodeURIComponent(short)}%3C/text%3E%3C/svg%3E`;
}

// ========== ЭКРАНИРОВАНИЕ ==========
function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ========== УПРАВЛЕНИЕ ЖАНРАМИ ==========
function loadGenres() {
    const savedGenres = localStorage.getItem('animeGenres');
    if (savedGenres) {
        allGenres = JSON.parse(savedGenres);
    } else {
        const genreSet = new Set();
        animeData.forEach(a => genreSet.add(a.genre));
        allGenres = Array.from(genreSet).sort();
        localStorage.setItem('animeGenres', JSON.stringify(allGenres));
    }
    renderFilterButtons();
    if (typeof updateGenreSelects === 'function') updateGenreSelects();
}

function saveGenres() {
    localStorage.setItem('animeGenres', JSON.stringify(allGenres));
    window.dispatchEvent(new Event('storage'));
    renderFilterButtons();
    if (typeof updateGenreSelects === 'function') updateGenreSelects();
}

function addGenre(newGenre) {
    if (!newGenre) return false;
    const normalized = newGenre.trim().toLowerCase();
    if (allGenres.includes(normalized)) return false;
    allGenres.push(normalized);
    allGenres.sort();
    saveGenres();
    return true;
}

function deleteGenre(genreToDelete) {
    const isUsed = animeData.some(a => a.genre === genreToDelete);
    if (isUsed) return false;
    const index = allGenres.indexOf(genreToDelete);
    if (index !== -1) {
        allGenres.splice(index, 1);
        saveGenres();
        return true;
    }
    return false;
}

// ========== ДИНАМИЧЕСКИЕ ФИЛЬТРЫ ==========
function renderFilterButtons() {
    const container = document.querySelector('.filters');
    if (!container) return;
    const activeBtn = container.querySelector('.filter-btn.active');
    const activeFilter = activeBtn ? activeBtn.dataset.filter : 'all';
    let html = '<button class="filter-btn active" data-filter="all">Все</button>';
    allGenres.forEach(genre => {
        html += `<button class="filter-btn" data-filter="${genre}">${genre.charAt(0).toUpperCase() + genre.slice(1)}</button>`;
    });
    container.innerHTML = html;
    container.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.dataset.filter === activeFilter) btn.classList.add('active');
        btn.addEventListener('click', filterHandler);
    });
}

function filterHandler(e) {
    const btn = e.currentTarget;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    if (filter === 'all') displayAnime(animeData);
    else displayAnime(animeData.filter(a => a.genre === filter));
}

// ========== ОТОБРАЖЕНИЕ АНИМЕ ==========
function displayAnime(animeList) {
    const grid = document.getElementById('animeGrid');
    if (!grid) return;
    if (animeList.length === 0) {
        grid.innerHTML = '<p style="color: white; text-align: center;">Аниме не найдено</p>';
        return;
    }
    let html = '';
    for (const anime of animeList) {
        const imgSrc = anime.image || generateSvgThumbnail(anime.title);
        const isFavorite = currentUser && currentUser.favorites && currentUser.favorites.includes(anime.id);
        const favButton = currentUser 
            ? `<button class="fav-btn ${isFavorite ? 'active' : ''}" data-id="${anime.id}" onclick="toggleFavorite(event, ${anime.id})">❤️</button>`
            : '';
        html += `
            <div class="anime-card" data-id="${anime.id}">
                <div class="card-image-wrapper">
                    <img src="${imgSrc}" alt="${escapeHtml(anime.title)}" loading="lazy" onerror="this.src='${generateSvgThumbnail(anime.title)}'">
                    ${favButton}
                </div>
                <div class="anime-info">
                    <h3>${escapeHtml(anime.title)}</h3>
                    <div class="anime-meta">
                        <span>⭐ ${anime.rating || '?'}</span>
                        <span>📅 ${anime.year || '?'}</span>
                    </div>
                </div>
            </div>
        `;
    }
    grid.innerHTML = html;
}

// ========== ПЕРЕКЛЮЧЕНИЕ ИЗБРАННОГО ==========
function toggleFavorite(event, animeId) {
    event.stopPropagation();
    if (!currentUser) {
        showNotification('🔒 Войдите, чтобы добавлять в избранное', 'warning');
        return;
    }
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex === -1) return;
    const user = users[userIndex];
    if (!user.favorites) user.favorites = [];
    const index = user.favorites.indexOf(animeId);
    if (index === -1) {
        user.favorites.push(animeId);
        showNotification('❤️ Добавлено в избранное', 'success');
    } else {
        user.favorites.splice(index, 1);
        showNotification('💔 Удалено из избранного', 'success');
    }
    localStorage.setItem('users', JSON.stringify(users));
    currentUser = { ...user };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    const btn = event.currentTarget;
    btn.classList.toggle('active');
}

// ========== КЛИК ПО КАРТОЧКЕ ==========
function setupCardClick() {
    const grid = document.getElementById('animeGrid');
    if (!grid) return;
    grid.addEventListener('click', (e) => {
        const card = e.target.closest('.anime-card');
        if (card && !e.target.classList.contains('fav-btn')) {
            const animeId = card.dataset.id;
            if (animeId) window.location.href = `video-player.html?id=${animeId}`;
        }
    });
}

// ========== ПОИСК ==========
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    if (!searchInput || !searchBtn) return;
    let timeout;
    function searchAnime() {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            const query = searchInput.value.toLowerCase().trim();
            if (!query) displayAnime(animeData);
            else displayAnime(animeData.filter(a => a.title.toLowerCase().includes(query)));
        }, 150);
    }
    searchBtn.addEventListener('click', searchAnime);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') searchAnime();
        else searchAnime();
    });
}

// ========== АВТОРИЗАЦИЯ ==========
function checkAuth() {
    const user = localStorage.getItem('currentUser');
    currentUser = user ? JSON.parse(user) : null;
    updateUserMenu();
}

// ========== МЕНЮ ПОЛЬЗОВАТЕЛЯ ==========
function updateUserMenu() {
    const userMenu = document.getElementById('userMenu');
    if (!userMenu) return;
    if (currentUser) {
        let adminLink = '';
        if (currentUser.role === 'admin') {
            adminLink = '<a href="admin-panel.html" class="admin-link">⚡ Админка</a>';
        }
        let avatarHtml = '';
        if (currentUser.avatar && currentUser.avatar.startsWith('data:image')) {
            avatarHtml = `<img src="${currentUser.avatar}" style="width:24px; height:24px; border-radius:50%; object-fit:cover;">`;
        } else {
            avatarHtml = `<span>${escapeHtml(currentUser.avatar || '👤')}</span>`;
        }
        userMenu.innerHTML = `
            <div style="display:flex; align-items:center; gap:0.5rem;">
                <button class="user-btn" onclick="window.location.href='profile.html'">
                    ${avatarHtml}
                    <span>${escapeHtml(currentUser.username)}</span>
                </button>
                ${adminLink}
            </div>
        `;
    } else {
        userMenu.innerHTML = `
            <a href="login.html" class="login-btn">Войти</a>
            <a href="register.html" class="register-btn">Регистрация</a>
        `;
    }
}

// ========== УВЕДОМЛЕНИЯ (ГАРАНТИРОВАННО ПО ЦЕНТРУ) ==========
function showNotification(message, type = 'success') {
    const oldNotifications = document.querySelectorAll('.notification-dynamic');
    oldNotifications.forEach(el => el.remove());
    const notification = document.createElement('div');
    notification.className = `notification-dynamic ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        if (notification.parentNode) notification.remove();
    }, 3000);
}

// ========== МОДАЛЬНЫЕ ОКНА ==========
function showAlertModal(message, callback) {
    const oldModal = document.querySelector('.modal-overlay');
    if (oldModal) oldModal.remove();
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay active';
    overlay.innerHTML = `
        <div class="modal-content">
            <div class="modal-icon">ℹ️</div>
            <div class="modal-title">Сообщение</div>
            <div class="modal-message">${escapeHtml(message)}</div>
            <div class="modal-buttons">
                <button class="modal-btn ok">ОК</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector('.ok').addEventListener('click', () => {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
        if (callback) callback();
    });
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 300);
        }
    });
}

function showConfirmModal(message, onConfirm, onCancel) {
    const oldModal = document.querySelector('.modal-overlay');
    if (oldModal) oldModal.remove();
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay active';
    overlay.innerHTML = `
        <div class="modal-content">
            <div class="modal-icon">❓</div>
            <div class="modal-title">Подтверждение</div>
            <div class="modal-message">${escapeHtml(message)}</div>
            <div class="modal-buttons">
                <button class="modal-btn confirm">Да</button>
                <button class="modal-btn cancel">Нет</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector('.confirm').addEventListener('click', () => {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
        if (onConfirm) onConfirm();
    });
    overlay.querySelector('.cancel').addEventListener('click', () => {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
        if (onCancel) onCancel();
    });
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 300);
            if (onCancel) onCancel();
        }
    });
}

// ========== УПРАВЛЕНИЕ ТЕМАМИ ==========
function setTheme(themeName) {
    document.body.classList.remove(
        'theme-default','theme-dark','theme-blue','theme-purple',
        'theme-cyberpunk','theme-sunset','theme-forest','theme-custom'
    );
    document.body.classList.add(`theme-${themeName}`);
    localStorage.setItem('animeTheme', themeName);
    const themeBtns = document.querySelectorAll('.theme-btn, .theme-option');
    themeBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.theme === themeName) btn.classList.add('active');
    });
}

function loadTheme() {
    const savedTheme = localStorage.getItem('animeTheme') || 'default';
    setTheme(savedTheme);
}

// ========== БУРГЕР-МЕНЮ ==========
function initBurgerMenu() {
    const burgerBtn = document.getElementById('burgerBtn');
    const navLinks = document.getElementById('navLinks');
    if (burgerBtn && navLinks) {
        const newBurger = burgerBtn.cloneNode(true);
        burgerBtn.parentNode.replaceChild(newBurger, burgerBtn);
        const newNav = document.getElementById('navLinks');
        newBurger.addEventListener('click', function () {
            this.classList.toggle('active');
            newNav.classList.toggle('active');
            document.body.style.overflow = newNav.classList.contains('active') ? 'hidden' : '';
        });
        newNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                newBurger.classList.remove('active');
                newNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                newBurger.classList.remove('active');
                newNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// ========== ИСТОРИЯ ПРОСМОТРОВ ==========
function addToHistory(animeId, episode) {
    if (!currentUser) return;
    const anime = animeData.find(a => a.id === animeId);
    if (!anime) return;
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex === -1) return;
    if (!users[userIndex].history) users[userIndex].history = [];
    users[userIndex].history.push({
        animeId,
        animeTitle: anime.title,
        episode,
        genre: anime.genre,
        timestamp: Date.now(),
        date: new Date().toISOString()
    });
    if (users[userIndex].history.length > 200) {
        users[userIndex].history = users[userIndex].history.slice(-200);
    }
    localStorage.setItem('users', JSON.stringify(users));
    currentUser = { ...users[userIndex] };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

// ========== ФУНКЦИИ ДЛЯ СТАТИСТИКИ ==========
function formatTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'только что';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} мин. назад`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ч. назад`;
    const days = Math.floor(hours / 24);
    return `${days} дн. назад`;
}

function getGenreColor(index) {
    const colors = ['#6c5ce7', '#00b894', '#0984e3', '#e84342', '#fdcb6e', '#a55eea', '#ff6b6b', '#00cec9'];
    return colors[index % colors.length];
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
document.addEventListener('DOMContentLoaded', () => {
    loadAnimeData();
    setupSearch();
    setupCardClick();
    checkAuth();
    loadTheme();
    initBurgerMenu();
    window.addEventListener('storage', (e) => {
        if (e.key === 'animeData') {
            animeData = JSON.parse(e.newValue || '[]');
            displayAnime(animeData);
            loadGenres();
        }
        if (e.key === 'animeGenres') {
            allGenres = JSON.parse(e.newValue || '[]');
            renderFilterButtons();
        }
        if (e.key === 'users' || e.key === 'currentUser') {
            checkAuth();
        }
    });
});

// ========== ГЛОБАЛЬНЫЙ ЭКСПОРТ ==========
window.showNotification = showNotification;
window.generateSvgThumbnail = generateSvgThumbnail;
window.escapeHtml = escapeHtml;
window.setTheme = setTheme;
window.loadTheme = loadTheme;
window.showAlertModal = showAlertModal;
window.showConfirmModal = showConfirmModal;
window.toggleFavorite = toggleFavorite;
window.loadGenres = loadGenres;
window.addGenre = addGenre;
window.deleteGenre = deleteGenre;
window.saveAnimeData = saveAnimeData;
window.syncAnimeData = syncAnimeData;
window.addToHistory = addToHistory;
window.formatTimeAgo = formatTimeAgo;
window.getGenreColor = getGenreColor;