/**
 * Servicios de Proveedores - H2OManager
 */

const KEY = 'h2o_proveedores';

const request = async (method = 'GET', body = null) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (method === 'GET') {
        const data = localStorage.getItem(KEY);
        return data ? JSON.parse(data) : [];
    } else {
        localStorage.setItem(KEY, JSON.stringify(body));
        return true;
    }
};

export const getProveedores = async () => await request('GET');
export const saveProveedores = async (data) => await request('POST', data);

export const addProveedor = async (prov) => {
    const all = await getProveedores();
    const newItem = { id: Date.now(), status: 'active', createdAt: new Date().toISOString(), ...prov };
    await saveProveedores([...all, newItem]);
    return newItem;
};

export const updateProveedor = async (id, data) => {
    const all = await getProveedores();
    return await saveProveedores(all.map(p => p.id === id ? { ...p, ...data } : p));
};

export const deleteProveedor = async (id) => {
    const all = await getProveedores();
    return await saveProveedores(all.filter(p => p.id !== id));
};