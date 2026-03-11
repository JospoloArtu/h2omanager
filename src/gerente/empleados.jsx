import { useState, useEffect } from 'react';
import {
    FiUserCheck, FiSearch, FiRefreshCw, FiPlus, FiEdit2, FiTrash2, FiX,
    FiPhone, FiMail, FiCheck, FiChevronLeft, FiChevronRight, FiUsers
} from 'react-icons/fi';
import Swal from 'sweetalert2';
import * as empleadoService from './services/empleados.service';
import '../assets/css/modulos.css';

export default function Empleados() {
    const [empleados, setEmpleados] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [form, setForm] = useState({ name: '', cedula: '', phone: '', email: '', role: 'Repartidor', status: 'active' });
    const rowsPerPage = 8;

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        setIsLoading(true);
        try { setEmpleados(await empleadoService.getEmpleados()); }
        catch (e) { Swal.fire('Error', 'No se pudieron cargar los empleados', 'error'); }
        finally { setIsLoading(false); }
    };

    const handleSave = async () => {
        if (!form.name || !form.cedula) { Swal.fire('Campos requeridos', 'Nombre y cédula son obligatorios', 'warning'); return; }
        try {
            if (editingItem) { await empleadoService.updateEmpleado(editingItem.id, form); }
            else { await empleadoService.addEmpleado(form); }
            setShowModal(false); setEditingItem(null);
            setForm({ name: '', cedula: '', phone: '', email: '', role: 'Repartidor', status: 'active' });
            await loadData();
            Swal.fire({ icon: 'success', title: '¡Guardado!', timer: 1500, showConfirmButton: false });
        } catch (e) { Swal.fire('Error', e.message, 'error'); }
    };

    const handleDelete = async (id) => {
        const res = await Swal.fire({ title: '¿Eliminar empleado?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444', confirmButtonText: 'Eliminar' });
        if (res.isConfirmed) { await empleadoService.deleteEmpleado(id); loadData(); }
    };

    const openEdit = (item) => {
        setEditingItem(item);
        setForm({ name: item.name || '', cedula: item.cedula || '', phone: item.phone || '', email: item.email || '', role: item.role || 'Repartidor', status: item.status || 'active' });
        setShowModal(true);
    };

    const filtered = empleados.filter(e => {
        const q = searchTerm.toLowerCase();
        const matchSearch = !q || e.name?.toLowerCase().includes(q) || e.cedula?.includes(q) || e.email?.toLowerCase().includes(q);
        const matchStatus = statusFilter === 'all' || e.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const totalPages = Math.ceil(filtered.length / rowsPerPage);
    const paginated = filtered.slice((currentPage-1)*rowsPerPage, currentPage*rowsPerPage);
    useEffect(()=>{setCurrentPage(1);},[searchTerm,statusFilter]);

    const activos = empleados.filter(e=>e.status==='active').length;
    const COLORS = ['blue','green','purple','amber','cyan'];

    return (
        <div className="module-container">
            <div className="module-header">
                <div className="title-section"><h1>Empleados</h1><p>Gestión del personal de la empresa</p></div>
                <div className="module-header-actions">
                    <button className="btn-mod" onClick={loadData}><FiRefreshCw /> Actualizar</button>
                    <button className="btn-mod primary" onClick={()=>{setEditingItem(null);setForm({name:'',cedula:'',phone:'',email:'',role:'Repartidor',status:'active'});setShowModal(true);}}>
                        <FiPlus /> Nuevo Empleado
                    </button>
                </div>
            </div>

            <div className="mod-stats">
                <div className="mod-stat-card"><div className="mod-stat-icon blue"><FiUsers /></div><div className="mod-stat-info"><p className="mod-val">{empleados.length}</p><p className="mod-lbl">Total</p></div></div>
                <div className="mod-stat-card"><div className="mod-stat-icon green"><FiUserCheck /></div><div className="mod-stat-info"><p className="mod-val">{activos}</p><p className="mod-lbl">Activos</p></div></div>
                <div className="mod-stat-card"><div className="mod-stat-icon red"><FiUserCheck /></div><div className="mod-stat-info"><p className="mod-val">{empleados.length - activos}</p><p className="mod-lbl">Inactivos</p></div></div>
            </div>

            <div className="mod-controls">
                <div className="search-box"><FiSearch className="search-icon" /><input className="search-input" placeholder="Buscar por nombre, cédula o email..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} /></div>
                <select className="filter-select" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
                    <option value="all">Todos</option><option value="active">Activos</option><option value="inactive">Inactivos</option>
                </select>
            </div>

            <div className="mod-table-wrap">
                {filtered.length === 0 ? (
                    <div className="mod-empty"><FiUsers /><h3>{isLoading?'Cargando...':'Sin empleados'}</h3><p>Agrega un empleado para comenzar</p></div>
                ) : (
                    <>
                        <table className="mod-table">
                            <thead><tr><th>Empleado</th><th>Cédula</th><th>Teléfono</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr></thead>
                            <tbody>
                                {paginated.map((e,i)=>(
                                    <tr key={e.id}>
                                        <td>
                                            <div className="mod-cell-info">
                                                <div className={`mod-avatar ${COLORS[i%COLORS.length]}`}>{e.name?.charAt(0)?.toUpperCase()||'?'}</div>
                                                <div className="cell-text"><p style={{fontWeight:600}}>{e.name}</p><p className="cell-sub">{e.email||'—'}</p></div>
                                            </div>
                                        </td>
                                        <td style={{fontWeight:600}}>{e.cedula||'—'}</td>
                                        <td><div style={{display:'flex',alignItems:'center',gap:'6px',fontSize:'13px'}}><FiPhone style={{color:'var(--muted)'}} />{e.phone||'—'}</div></td>
                                        <td><span className="mod-badge active" style={{background:'#eff6ff',color:'#1d4ed8'}}>{e.role}</span></td>
                                        <td><span className={`mod-badge ${e.status}`}>{e.status==='active'?'Activo':'Inactivo'}</span></td>
                                        <td>
                                            <div className="mod-actions">
                                                <button onClick={()=>openEdit(e)}><FiEdit2 /></button>
                                                <button className="del" onClick={()=>handleDelete(e.id)}><FiTrash2 /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {totalPages>1&&(
                            <div className="mod-pagination">
                                <span>{(currentPage-1)*rowsPerPage+1}–{Math.min(currentPage*rowsPerPage,filtered.length)} de {filtered.length}</span>
                                <div className="page-btns"><button disabled={currentPage<=1} onClick={()=>setCurrentPage(p=>p-1)}><FiChevronLeft /></button><button disabled={currentPage>=totalPages} onClick={()=>setCurrentPage(p=>p+1)}><FiChevronRight /></button></div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {showModal && (
                <div className="mod-modal-overlay" onClick={()=>setShowModal(false)}>
                    <div className="mod-modal" onClick={ev=>ev.stopPropagation()}>
                        <div className="mod-modal-header"><h2>{editingItem?'Editar Empleado':'Nuevo Empleado'}</h2><button className="btn-close" onClick={()=>setShowModal(false)}><FiX /></button></div>
                        <div className="mod-modal-body">
                            <div className="mod-form-row">
                                <div className="mod-form-group"><label>Nombre Completo</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Nombre y Apellido" /></div>
                                <div className="mod-form-group"><label>Cédula</label><input value={form.cedula} onChange={e=>setForm({...form,cedula:e.target.value})} placeholder="V-12345678" /></div>
                            </div>
                            <div className="mod-form-row">
                                <div className="mod-form-group"><label>Teléfono</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="0414-1234567" /></div>
                                <div className="mod-form-group"><label>Email</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="correo@ejemplo.com" /></div>
                            </div>
                            <div className="mod-form-row">
                                <div className="mod-form-group"><label>Rol</label>
                                    <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
                                        <option>Repartidor</option><option>Administrativo</option><option>Operador</option><option>Supervisor</option>
                                    </select>
                                </div>
                                <div className="mod-form-group"><label>Estado</label>
                                    <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
                                        <option value="active">Activo</option><option value="inactive">Inactivo</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mod-modal-footer"><button className="btn-mod" onClick={()=>setShowModal(false)}>Cancelar</button><button className="btn-mod primary" onClick={handleSave}><FiCheck /> Guardar</button></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
