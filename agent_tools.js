// @ts-check

/**
 * Этот файл содержит реализацию инструментов, доступных для Агента "Контакт".
 * В реальном workflow n8n, эти функции были бы реализованы как отдельные узлы
 * (например, Google Sheets Read/Write) или внутри узла "Code".
 */

// --- Имитация наших баз данных (Google Sheets) ---
const mockDatabase = {
  products: [
    { sku: 'PLT-001', name: 'Платье "Вечерний Бриз"', description: 'Элегантное вечернее платье из шелка.', price: 3500, stock: 150 },
    { sku: 'BLZ-005', name: 'Блузка "Деловой Шик"', description: 'Строгая блузка для офиса из хлопка.', price: 1800, stock: 300 },
    { sku: 'UBK-002', name: 'Юбка "Летний Полдень"', description: 'Легкая юбка-солнце из вискозы.', price: 2200, stock: 250 },
  ],
  clients: [
    { telegram_id: '123456789', name: 'Иван Петров', history: '2025-08-05: Интересовался платьями. Сказал, что подумает.' }
  ]
};
// ----------------------------------------------------

/**
 * ИНСТРУМЕНТ: Получение информации о продукте по его артикулу (SKU).
 * @param {string} sku Артикул товара.
 * @returns {Promise<string>} JSON-строка с информацией о товаре или сообщение об ошибке.
 */
async function get_product_info(sku) {
  console.log(`[Tool Executing]: get_product_info with SKU: ${sku}`);
  const product = mockDatabase.products.find(p => p.sku.toLowerCase() === sku.toLowerCase());

  if (product) {
    return JSON.stringify(product);
  } else {
    return `Товар с артикулом "${sku}" не найден. Пожалуйста, проверьте правильность артикула.`;
  }
}

/**
 * ИНСТРУМЕНТ: Поиск клиента и его истории по Telegram ID.
 * @param {string} telegram_id ID пользователя в Telegram.
 * @returns {Promise<string>} JSON-строка с информацией о клиенте или null, если клиент не найден.
 */
async function find_client_history(telegram_id) {
  console.log(`[Tool Executing]: find_client_history with ID: ${telegram_id}`);
  const client = mockDatabase.clients.find(c => c.telegram_id === telegram_id);

  if (client) {
    return JSON.stringify(client);
  } else {
    return null;
  }
}

/**
 * ИНСТРУМЕНТ: Создание новой записи о клиенте.
 * @param {string} name Имя клиента.
 * @param {string} telegram_id ID пользователя в Telegram.
 * @returns {Promise<string>} Сообщение об успешном создании.
 */
async function create_new_client(name, telegram_id) {
  console.log(`[Tool Executing]: create_new_client for ${name} (${telegram_id})`);

  const existingClient = mockDatabase.clients.find(c => c.telegram_id === telegram_id);
  if (existingClient) {
    return `Клиент с ID ${telegram_id} уже существует.`;
  }

  const newClient = { telegram_id, name, history: 'Первый контакт.' };
  mockDatabase.clients.push(newClient);

  return `Новый клиент "${name}" успешно создан.`;
}

// В реальном n8n эти функции были бы доступны для вызова из узла LangChain Agent.
// module.exports = { get_product_info, find_client_history, create_new_client };
