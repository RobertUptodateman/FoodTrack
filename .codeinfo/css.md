  # @context[css] Архитектура CSS

  #  # @context[structure] Структура
- @path[static/css] `/static/css/` - корневая директория стилей
- @path[static/css/components] `/static/css/components/` - стили компонентов
- @path[static/css/layouts] `/static/css/layouts/` - макеты страниц
- @path[static/css/themes] `/static/css/themes/` - темы оформления

  #  # @context[methodology] Методология
- @method[bem] Используется BEM (Block Element Modifier)
- @method[mobile] Mobile-first подход
- @method[custom-props] CSS Custom Properties для тем

  #  # @context[components] Компоненты
- @component[buttons] Buttons
- @component[forms] Forms
- @component[cards] Cards
- @component[nav] Navigation
- @component[modals] Modals

  #  # @context[naming] Правила именования
- @rule[block] Блоки: `.block`
- @rule[element] Элементы: `.block__element`
- @rule[modifier] Модификаторы: `.block--modifier`, `.block__element--modifier`

  #  # @context[deps] Зависимости
- @dep[bootstrap] Bootstrap 5.0
- @dep[custom-props] Custom Properties
- @dep[layout] CSS Grid/Flexbox
