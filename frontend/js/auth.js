document.addEventListener('DOMContentLoaded', function() {
    // Telegram Widget Authentication
    window.TelegramLoginWidget = {
        dataOnauth: function(user) {
            fetch('/auth/telegram/callback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.status === 'success') {
                    // Показываем сообщение об успехе только после успешной авторизации
                    document.getElementById('auth-success-message').style.display = 'block';
                    // Перезагружаем страницу для отображения доски
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            })
            .catch(error => {
                console.error('Ошибка при отправке данных:', error);
                // В случае ошибки скрываем сообщение об успехе
                document.getElementById('auth-success-message').style.display = 'none';
            });
        }
    };
});
