/**
 * Servicios de Gestión de Clientes - H2OManager
 * Implementación asíncrona con fallback en LocalStorage
 */

const BASE_URL = import.meta.env.VITE_API_URL || '';
const USE_API = false;

const KEY = 'h2o_clients';

/**
 * Helper para peticiones API con fallback a LocalStorage
 */
const request = async (method = 'GET', body = null) => {
    // Simulación de delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    if (USE_API && BASE_URL) {
        try {
            const response = await fetch(`${BASE_URL}/clients`, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: body ? JSON.stringify(body) : null
            });
            if (!response.ok) throw new Error('Error en la petición API');
            return await response.json();
        } catch (error) {
            console.error(`API Error (clients):`, error);
        }
    }

    // Lógica LocalStorage
    if (method === 'GET') {
        const data = localStorage.getItem(KEY);
        return data ? JSON.parse(data) : [];
    } else {
        localStorage.setItem(KEY, JSON.stringify(body));
        return true;
    }
};

export const getClients = async () => {
    return await request('GET');
};

export const saveClients = async (clients) => {
    return await request('POST', clients);
};

export const addClient = async (client) => {
    const clients = await getClients();
    const newClient = {
        id: Date.now(),
        saldo: 0,
        status: 'active',
        ...client
    };
    const updatedClients = [...clients, newClient];
    await saveClients(updatedClients);
    return newClient;
};

export const updateClient = async (id, updatedData) => {
    const clients = await getClients();
    const updatedClients = clients.map(c => c.id === id ? { ...c, ...updatedData } : c);
    return await saveClients(updatedClients);
};

export const deleteClient = async (id) => {
    const clients = await getClients();
    const updatedClients = clients.filter(c => c.id !== id);
    return await saveClients(updatedClients);
};
