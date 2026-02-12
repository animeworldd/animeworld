// ========== ЯЗЫКОВОЙ МОДУЛЬ ==========
const LANGUAGES = {
    ru: 'Русский',
    en: 'English'
};

const TRANSLATIONS = {
    ru: {
        'app.name': '🍥 AnimeWorld',
        'search.placeholder': 'Поиск аниме...',
        'search.button': '🔍',
        'filters.all': 'Все',
        'user.login': 'Войти',
        'user.register': 'Регистрация',
        'user.profile': 'Профиль',
        'user.logout': 'Выйти',
        'user.admin': '⚡ Админка',
        'footer.copyright': '© 2026 AnimeWorld',
        'nav.home': 'Главная',
        'nav.popular': 'Популярное',
        'nav.new': 'Новинки',
        'profile.info': '👤 Информация',
        'profile.favorites': '❤️ Избранное',
        'profile.themes': '🎨 Темы',
        'profile.stats': '📊 Статистика',
        'profile.admin.badge': 'Администратор',
        'profile.admin.panel': 'Перейти в админ-панель',
        'profile.no.favorites': 'У вас пока нет добавленных аниме.',
        'profile.no.history': 'У вас пока нет истории просмотров. Посмотрите аниме, чтобы появилась статистика.',
        'theme.default': '☀️ Светлая',
        'theme.dark': '🌙 Тёмная',
        'theme.blue': '🔵 Синяя',
        'theme.purple': '🟣 Фиолетовая',
        'theme.cyberpunk': '🤖 Киберпанк',
        'theme.sunset': '🌅 Закат',
        'theme.forest': '🌲 Лесная',
        'theme.ocean': '🌊 Океан',
        'theme.candy': '🍬 Карамель',
        'theme.coffee': '☕ Кофе',
        'theme.mint': '🌿 Мята',
        'theme.lavender': '💜 Лаванда',
        'player.play': 'Воспроизвести',
        'player.pause': 'Пауза',
        'player.lock': 'Заблокировать',
        'player.unlock': 'Разблокировать',
        'player.speed': 'Скорость',
        'player.fullscreen': 'На весь экран',
        'player.episodes': '📋 Список серий',
        'player.episode': 'Серия',
        'admin.dashboard': '📊 Дашборд',
        'admin.anime': '🎬 Управление аниме',
        'admin.videos': '📹 Загрузка видео',
        'admin.genres': '🏷️ Жанры',
        'admin.users': '👥 Пользователи',
        'admin.logout': '🚪 Выйти',
        'admin.add.anime': '➕ Добавить новое аниме',
        'admin.add.video': '➕ Добавить серию',
        'admin.add.genre': '➕ Добавить жанр',
        'admin.edit': '✏️ Редактировать',
        'admin.delete': '🗑️ Удалить',
        'admin.save': '💾 Сохранить',
        'admin.cancel': 'Отмена',
        'quote.button': '🎲 Цитата дня',
        'quote.title': 'Цитата дня',
        'quote1': 'Аниме — это не просто мультфильмы, это целая вселенная эмоций.',
        'quote2': 'Каждая серия — маленькая жизнь.',
        'quote3': 'Иногда аниме учит большему, чем школа.',
        'quote4': 'Найди своё аниме — найди себя.',
        'quote5': 'Даже у героев бывают плохие дни, но они продолжают сражаться.',
        'quote6': 'Аниме объединяет людей со всего мира.',
        'quote7': 'Самые тёплые воспоминания — это те, что мы создаём за просмотром.',
        'quote8': 'В каждом из нас живёт маленький Сайтама.',
        'quote9': 'Никогда не сдавайся — это закон Наруто.',
        'quote10': 'Даже если мир против тебя, у тебя есть аниме.'
    },
    en: {
        'app.name': '🍥 AnimeWorld',
        'search.placeholder': 'Search anime...',
        'search.button': '🔍',
        'filters.all': 'All',
        'user.login': 'Login',
        'user.register': 'Register',
        'user.profile': 'Profile',
        'user.logout': 'Logout',
        'user.admin': '⚡ Admin',
        'footer.copyright': '© 2026 AnimeWorld',
        'nav.home': 'Home',
        'nav.popular': 'Popular',
        'nav.new': 'New',
        'profile.info': '👤 Info',
        'profile.favorites': '❤️ Favorites',
        'profile.themes': '🎨 Themes',
        'profile.stats': '📊 Statistics',
        'profile.admin.badge': 'Administrator',
        'profile.admin.panel': 'Go to admin panel',
        'profile.no.favorites': 'You haven\'t added any anime to favorites yet.',
        'profile.no.history': 'You have no viewing history yet. Watch anime to see statistics.',
        'theme.default': '☀️ Light',
        'theme.dark': '🌙 Dark',
        'theme.blue': '🔵 Blue',
        'theme.purple': '🟣 Purple',
        'theme.cyberpunk': '🤖 Cyberpunk',
        'theme.sunset': '🌅 Sunset',
        'theme.forest': '🌲 Forest',
        'theme.ocean': '🌊 Ocean',
        'theme.candy': '🍬 Candy',
        'theme.coffee': '☕ Coffee',
        'theme.mint': '🌿 Mint',
        'theme.lavender': '💜 Lavender',
        'player.play': 'Play',
        'player.pause': 'Pause',
        'player.lock': 'Lock',
        'player.unlock': 'Unlock',
        'player.speed': 'Speed',
        'player.fullscreen': 'Fullscreen',
        'player.episodes': '📋 Episodes',
        'player.episode': 'Episode',
        'admin.dashboard': '📊 Dashboard',
        'admin.anime': '🎬 Manage Anime',
        'admin.videos': '📹 Upload Video',
        'admin.genres': '🏷️ Genres',
        'admin.users': '👥 Users',
        'admin.logout': '🚪 Logout',
        'admin.add.anime': '➕ Add New Anime',
        'admin.add.video': '➕ Add Episode',
        'admin.add.genre': '➕ Add Genre',
        'admin.edit': '✏️ Edit',
        'admin.delete': '🗑️ Delete',
        'admin.save': '💾 Save',
        'admin.cancel': 'Cancel',
        'quote.button': '🎲 Quote of the Day',
        'quote.title': 'Quote of the Day',
        'quote1': 'Anime is not just cartoons, it\'s a whole universe of emotions.',
        'quote2': 'Every episode is a small life.',
        'quote3': 'Sometimes anime teaches more than school.',
        'quote4': 'Find your anime — find yourself.',
        'quote5': 'Even heroes have bad days, but they keep fighting.',
        'quote6': 'Anime connects people from all over the world.',
        'quote7': 'The warmest memories are those we create while watching.',
        'quote8': 'There\'s a little Saitama inside each of us.',
        'quote9': 'Never give up — that\'s Naruto\'s way.',
        'quote10': 'Even if the world is against you, you have anime.'
    }
};

let currentLanguage = localStorage.getItem('animeLanguage') || 'ru';

function getTranslation(key) {
    return TRANSLATIONS[currentLanguage]?.[key] || key;
}

function setLanguage(lang) {
    if (TRANSLATIONS[lang]) {
        currentLanguage = lang;
        localStorage.setItem('animeLanguage', lang);
        updateAllTexts();
        if (typeof showNotification === 'function') {
            showNotification(`🌐 Язык изменён на ${LANGUAGES[lang]} / Language changed to ${LANGUAGES[lang]}`, 'info');
        }
    }
}

function updateAllTexts() {
    document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.dataset.lang;
        el.textContent = getTranslation(key);
    });

    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.placeholder = getTranslation('search.placeholder');

    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) searchBtn.textContent = getTranslation('search.button');

    const footer = document.querySelector('footer p');
    if (footer) footer.textContent = getTranslation('footer.copyright');

    const logo = document.querySelector('.logo h1');
    if (logo) logo.textContent = getTranslation('app.name');

    const allFilter = document.querySelector('.filter-btn[data-filter="all"]');
    if (allFilter) allFilter.textContent = getTranslation('filters.all');
}

function getRandomQuote() {
    const keys = Object.keys(TRANSLATIONS[currentLanguage]).filter(k => k.startsWith('quote') && k !== 'quote.button' && k !== 'quote.title');
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return TRANSLATIONS[currentLanguage][randomKey];
}

function showRandomQuote() {
    const quote = getRandomQuote();
    if (typeof showNotification === 'function') {
        showNotification(`💬 ${quote}`, 'info');
    } else {
        alert(quote);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => updateAllTexts(), 10);
});

window.LANGUAGES = LANGUAGES;
window.TRANSLATIONS = TRANSLATIONS;
window.currentLanguage = currentLanguage;
window.getTranslation = getTranslation;
window.setLanguage = setLanguage;
window.updateAllTexts = updateAllTexts;
window.getRandomQuote = getRandomQuote;
window.showRandomQuote = showRandomQuote;