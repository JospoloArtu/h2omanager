/**
 * Servicios de Configuración - H2OManager
 * Preparado para conexión con API externa con fallback en LocalStorage
 */

const BASE_URL = import.meta.env.VITE_API_URL || ''; // URL base para la API futura
const USE_API = false; // Toggle para activar/desactivar conexión real

// Claves para LocalStorage (Fallback)
const KEYS = {
    GENERAL: 'h2o_config_general',
    CURRENCY: 'h2o_config_currency',
    PRICING: 'h2o_config_pricing',
    USERS: 'h2o_config_users'
};

/**
 * Helper para peticiones API con fallback a LocalStorage
 */
const request = async (key, method = 'GET', body = null) => {
    // Simulación de delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    if (USE_API && BASE_URL) {
        try {
            const response = await fetch(`${BASE_URL}/config/${key}`, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: body ? JSON.stringify(body) : null
            });
            if (!response.ok) throw new Error('Error en la petición API');
            return await response.json();
        } catch (error) {
            console.error(`API Error (${key}):`, error);
            // Fallback a LocalStorage en caso de error de red
        }
    }

    // Lógica LocalStorage (Fallback)
    if (method === 'GET') {
        const data = localStorage.getItem(KEYS[key.toUpperCase()]);
        return data ? JSON.parse(data) : null;
    } else {
        localStorage.setItem(KEYS[key.toUpperCase()], JSON.stringify(body));
        return true;
    }
};

// --- Configuración General ---
export const getGeneralConfig = async () => {
    const data = await request('general');
    return data || {
        name: 'H2OManager',
        rif: '',
        address: '',
        phone: '',
        email: ''
    };
};

export const saveGeneralConfig = async (config) => {
    return await request('general', 'POST', config);
};

// --- Configuración de Moneda ---
export const getCurrencyConfig = async () => {
    const data = await request('currency');
    return data || {
        currency: 'USD',
        exchangeRate: 54.50,
        iva: 16
    };
};

export const saveCurrencyConfig = async (config) => {
    return await request('currency', 'POST', config);
};

// --- Configuración de Precios y Botellones ---
export const getPricingConfig = async () => {
    const data = await request('pricing');
    return data || {
        waterPrice: 0.5,
        deliveryPrice: 1.5,
        bottles: [
            { id: 1, size: 20, price: 5.0 },
            { id: 2, size: 10, price: 3.0 }
        ]
    };
};

export const savePricingConfig = async (config) => {
    return await request('pricing', 'POST', config);
};

// --- Gestión de Usuarios ---
export const getUsers = async () => {
    const data = await request('users');
    return data || [
        { id: 1, name: 'Admin H2O', email: 'admin@h2omanager.com', role: 'Gerente', status: 'active' }
    ];
};

export const saveUsers = async (users) => {
    return await request('users', 'POST', users);
};
