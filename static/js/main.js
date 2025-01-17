// Функция для загрузки HTML-частей
async function loadPartial(url) {
    try {
        const response = await fetch(url);
        return await response.text();
    } catch (error) {
        console.error('Ошибка загрузки частичного HTML:', error);
        return '';
    }
}

// Функция инициализации приложения
async function initApp() {
    // Загружаем прелоадер
    const preloaderContainer = document.getElementById('preloader-container');
    preloaderContainer.innerHTML = await loadPartial('/static/html/partials/preloader.partial.html');

    // Загружаем форму авторизации
    const authContainer = document.getElementById('auth-container');
    authContainer.innerHTML = await loadPartial('/static/html/partials/main.partial.html');
    authContainer.style.display = 'none';

    // Через 1 секунду скрываем прелоадер и показываем форму авторизации
    setTimeout(() => {
        preloaderContainer.style.display = 'none';
        authContainer.style.display = 'block';

        // Через 2 секунды скрываем форму авторизации и показываем основной контент
        setTimeout(() => {
            authContainer.style.display = 'none';
            document.getElementById('main-content').style.display = 'block';
        }, 2000);
    }, 1000);
}

// Запускаем инициализацию при загрузке страницы
document.addEventListener('DOMContentLoaded', initApp);
