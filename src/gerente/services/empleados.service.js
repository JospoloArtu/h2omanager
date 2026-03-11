/**
 * Servicios de Empleados - H2OManager
 */

const KEY = 'h2o_empleados';

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

export const getEmpleados = async () => await request('GET');
export const saveEmpleados = async (data) => await request('POST', data);

export const addEmpleado = async (emp) => {
    const all = await getEmpleados();
    const newItem = { id: Date.now(), status: 'active', createdAt: new Date().toISOString(), ...emp };
    await saveEmpleados([...all, newItem]);
    return newItem;
};

export const updateEmpleado = async (id, data) => {
    const all = await getEmpleados();
    return await saveEmpleados(all.map(e => e.id === id ? { ...e, ...data } : e));
};

export const deleteEmpleado = async (id) => {
    const all = await getEmpleados();
    return await saveEmpleados(all.filter(e => e.id !== id));
};
