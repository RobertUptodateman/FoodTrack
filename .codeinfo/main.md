  # @context[root] Общая архитектура проекта

  #  # @context[structure] Структура проекта
/cmd
  /web  # @path[cmd/web] Точка входа веб-приложения и серверная логика
/static
  /css  # @path[static/css] Файлы стилей
  /html  # @path[static/html] HTML шаблоны и страницы
  /js  # @path[static/js] JavaScript файлы и модули
/docs  # @path[docs] Общая документация проекта
/.codeinfo  # @path[.codeinfo] Техническая документация по архитектуре

  #  # @context[components] Основные компоненты
1. @component[server] Веб-сервер (cmd/web)
   См. [backend.md] - архитектура серверной части

2. @component[frontend] Фронтенд (static)
   - @module[css] CSS: [css.md] - архитектура стилей
   - @module[js] JS: [javascript.md] - архитектура клиентской логики
   - @module[html] HTML: [templates.md] - структура шаблонов

3. @component[database] База данных
   См. [database.md] - схема и миграции

  #  # @context[rules] Правила разработки
- @rule[server] Весь серверный код размещается в cmd/web
- @rule[static] Статические файлы (CSS, JS, HTML) находятся в соответствующих папках /static
- @rule[docs] Документация ведётся в директории /docs
- @rule[go] Следуем стандартной структуре Go-проектов

  #  # @context[docs] Дополнительная документация
- @doc[style] [code-style.md] - стиль кода
- @doc[api] [api.md] - API документация
- @doc[workflow] [workflow.md] - процесс разработки
- @doc[testing] [testing.md] - тестирование
