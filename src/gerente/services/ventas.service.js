/**
 * Servicios de Gestión de Ventas - H2OManager
 * Implementación asíncrona con fallback en LocalStorage
 */

const BASE_URL = import.meta.env.VITE_API_URL || '';
const USE_API = false;

const KEY_SALES = 'h2o_sales';

/**
 * Helper para peticiones API con fallback a LocalStorage
 */
const request = async (key, method = 'GET', body = null) => {
    // Simulación de delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    if (USE_API && BASE_URL) {
        // Lógica real de fetch
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

export const getSales = async () => {
    return await request(KEY_SALES, 'GET');
};

export const createSale = async (saleData) => {
    const sales = await getSales();
    const newSale = {
        id: `VEN-${Date.now().toString().slice(-6)}`,
        date: new Date().toISOString(),
        ...saleData
    };
    await request(KEY_SALES, 'POST', [newSale, ...sales]);
    return newSale;
};