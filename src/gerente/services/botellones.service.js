/**
 * Servicios de Gestión de Botellones (Inventario) - H2OManager
 * Implementación asíncrona con fallback en LocalStorage
 */

const BASE_URL = import.meta.env.VITE_API_URL || '';
const USE_API = false;

const KEY_INVENTORY = 'h2o_inventory';
const KEY_HISTORY = 'h2o_inventory_history';

/**
 * Helper para peticiones API con fallback a LocalStorage
 */
const request = async (key, method = 'GET', body = null) => {
    // Simulación de delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    if (USE_API && BASE_URL) {
        // Aquí iría la lógica real de fetch
    }

    // Lógica LocalStorage
    if (method === 'GET') {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } else {
        localStorage.setItem(key, JSON.stringify(body));
        return true;
    }
};

export const getInventory = async () => {
    const data = await request(KEY_INVENTORY, 'GET');
    // Si no hay datos, inicializar con algunos tamaños comunes
    if (data.length === 0) {
        return [
            { id: 1, size: 20, stock: 100, minStock: 10, unit: 'Litros' },
            { id: 2, size: 10, stock: 100, minStock: 5, unit: 'Litros' },
            { id: 3, size: 5,  stock: 100, minStock: 5, unit: 'Litros' }
        ];
    }
    return data;
};

export const getHistory = async () => {
    return await request(KEY_HISTORY, 'GET');
};

export const updateStock = async (itemId, amount, type, note = '') => {
    const inventory = await getInventory();
    const history = await getHistory();
    
    const itemIndex = inventory.findIndex(i => i.id === itemId);
    if (itemIndex === -1) throw new Error('Item no encontrado');

    const item = inventory[itemIndex];
    const oldStock = item.stock;
    const newStock = type === 'in' ? oldStock + amount : oldStock - amount;

    if (newStock < 0) throw new Error('Stock insuficiente');

    // Actualizar inventario
    inventory[itemIndex] = { ...item, stock: newStock };
    await request(KEY_INVENTORY, 'POST', inventory);

    // Registrar en historial
    const movement = {
        id: Date.now(),
        itemId,
        itemSize: item.size,
        type, // 'in' o 'out'
        amount,
        oldStock,
        newStock,
        note,
        date: new Date().toISOString()
    };
    await request(KEY_HISTORY, 'POST', [movement, ...history]);

    return movement;
};

export const saveInventoryConfig = async (config) => {
    return await request(KEY_INVENTORY, 'POST', config);
};