// @ts-check

/**
 * Тестовый скрипт для имитации диалога с уже существующим клиентом,
 * который запрашивает информацию о конкретном товаре.
 */

// --- Имитация загрузки модулей ---
const mockDatabase = {
  products: [
    { sku: 'PLT-001', name: 'Платье "Вечерний Бриз"', description: 'Элегантное вечернее платье из шелка.', price: 3500, stock: 150 },
    { sku: 'BLZ-005', name: 'Блузка "Деловой Шик"', description: 'Строгая блузка для офиса из хлопка.', price: 1800, stock: 300 },
  ],
  clients: [
    { telegram_id: '123456789', name: 'Иван Петров', history: '2025-08-05: Интересовался платьями. Сказал, что подумает.' }
  ]
};

async function get_product_info(sku) {
  const product = mockDatabase.products.find(p => p.sku.toLowerCase() === sku.toLowerCase());
  if (product) return JSON.stringify(product);
  return `Товар с артикулом "${sku}" не найден.`;
}

async function find_client_history(telegram_id) {
  const client = mockDatabase.clients.find(c => c.telegram_id === telegram_id);
  if (client) return JSON.stringify(client);
  return null;
}
// --- Конец имитации загрузки ---


console.log("▶️  [WORKFLOW START] Получено новое сообщение в Telegram.");

// 1. Входящие данные от Telegram
const incomingMessage = {
  telegram_id: '123456789', // ID существующего клиента
  user_name: 'Иван Петров',
  text: 'Добрый день. Расскажите подробнее про PLT-001.'
};
console.log(`- Входящие данные: ID=${incomingMessage.telegram_id}, Имя=${incomingMessage.user_name}, Текст="${incomingMessage.text}"`);

// 2. Логика Workflow: Поиск клиента
console.log("▶️  [TOOL CALL] Вызов find_client_history...");
// const clientJSON = await find_client_history(incomingMessage.telegram_id);
const clientJSON = await find_client_history(incomingMessage.telegram_id); // Используем реальную функцию
const clientRecord = JSON.parse(clientJSON);
console.log(`- Результат: Клиент найден. История: "${clientRecord.history}"`);

// 3. Логика Workflow: Подготовка и вызов LLM (первый раз)
console.log("▶️  [LLM CALL] Вызов LLM для определения намерения...");
// LLM анализирует сообщение "Расскажите подробнее про PLT-001" и решает, что нужно использовать инструмент.
const llmDecision = { tool_to_use: 'get_product_info', tool_params: { sku: 'PLT-001' } };
console.log(`- Решение LLM: Использовать инструмент '${llmDecision.tool_to_use}' с параметром SKU='${llmDecision.tool_params.sku}'`);

// 4. Логика Workflow: Выполнение инструмента
console.log(`▶️  [TOOL CALL] Выполнение инструмента ${llmDecision.tool_to_use}...`);
// const productInfoJSON = await get_product_info(llmDecision.tool_params.sku);
const productInfoJSON = await get_product_info(llmDecision.tool_params.sku); // Используем реальную функцию
console.log(`- Результат от инструмента: ${productInfoJSON}`);

// 5. Логика Workflow: Финальный вызов LLM с полной информацией
console.log("▶️  [LLM CALL] Финальный вызов LLM для генерации ответа...");
// LLM получает всю информацию: личность, историю клиента, его вопрос и данные от инструмента.

// 6. Имитация ответа от LLM (Агента "Юлиан")
const llmResponse = `
Иван, рад снова вас слышать!

Конечно, по артикулу PLT-001 — это наше платье "Вечерний Бриз". Отличный выбор, одна из самых популярных моделей.

Краткая информация по нему:
- **Материал:** Элегантное вечернее платье из шелка.
- **Цена для вашего объема:** 3500 руб./шт.
- **Наличие на складе:** 150 шт.

В прошлый раз вы раздумывали над заказом. Сейчас на эту модель повышенный спрос. Могу я забронировать для вас партию, скажем, 30 штук, пока они есть в наличии?
`;

console.log("✅ [LLM RESPONSE] Ответ от Агента 'Юлиан' сгенерирован:");
console.log("----------------------------------------------------");
console.log(llmResponse.trim());
console.log("----------------------------------------------------");

console.log("▶️  [WORKFLOW END] Ответ отправлен пользователю. История диалога обновлена.");
