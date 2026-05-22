import React, { useState } from 'react';
import { FiPlus, FiDownload, FiEdit2, FiTrash2, FiFileText, FiArrowRight, FiInfo } from 'react-icons/fi';

export default function PlanCuentas() {
    // Datos de prueba basados exactamente en tu prototipo de H2OManager
    const cuentasIniciales = [
        { codigo: '1.1.01', nombre: 'Caja', tipo: 'Activo', naturaleza: 'Deodora', estado: 'Activa', descripcion: 'Representa el dinero en efectivo disponible en caja para operaciones diarias.', saldo: 1250.00, creacion: '01/04/2025', actualizacion: '12/04/2025' },
        { codigo: '1.1.02', nombre: 'Bancos', tipo: 'Activo', naturaleza: 'Deodora', estado: 'Activa', descripcion: 'Fondos disponibles en las cuentas corrientes bancarias de la empresa.', saldo: 8450.00, creacion: '01/04/2025', actualizacion: '12/04/2025' },
        { codigo: '1.1.03', nombre: 'Cuentas por Cobrar', tipo: 'Activo', naturaleza: 'Deodora', estado: 'Activa', descripcion: 'Créditos otorgados a clientes por ventas de botellones pendientes de pago.', saldo: 3100.00, creacion: '01/04/2025', actualizacion: '12/04/2025' },
        { codigo: '1.2.01', nombre: 'Inventario de Botellones', tipo: 'Activo', naturaleza: 'Deodora', estado: 'Activa', descripcion: 'Valoración de los botellones de 19L disponibles para la venta y distribución.', saldo: 2400.00, creacion: '01/04/2025', actualizacion: '12/04/2025' },
        { codigo: '2.1.01', nombre: 'Proveedores', tipo: 'Pasivo', naturaleza: 'Acreedora', estado: 'Activa', descripcion: 'Obligaciones pendientes de pago con los proveedores de materia prima o plástico.', saldo: 1500.00, creacion: '01/04/2025', actualizacion: '12/04/2025' },
        { codigo: '3.1.01', nombre: 'Capital Contable', tipo: 'Capital', naturaleza: 'Acreedora', estado: 'Activa', descripcion: 'Aportaciones iniciales de los socios para la constitución de H2OManager.', saldo: 10000.00, creacion: '01/04/2025', actualizacion: '12/04/2025' },
        { codigo: '4.1.01', nombre: 'Ventas', tipo: 'Ingreso', naturaleza: 'Acreedora', estado: 'Activa', descripcion: 'Ingresos percibidos por la venta directa y distribución de agua potable.', saldo: 14500.00, creacion: '01/04/2025', actualizacion: '12/04/2025' },
        { codigo: '5.1.01', nombre: 'Gastos de Transporte', tipo: 'Gasto', naturaleza: 'Deodora', estado: 'Activa', descripcion: 'Gastos asociados al combustible y mantenimiento de los camiones de reparto.', saldo: 650.00, creacion: '01/04/2025', actualizacion: '12/04/2025' }
    ];

    // Estado para saber qué cuenta está seleccionada y mostrarla a la derecha
    const [cuentaSeleccionada, setCuentaSeleccionada] = useState(cuentasIniciales[0]);

    // Función para dar color dinámico a las etiquetas (badges) de Tipo de cuenta
    const getTipoStyle = (tipo) => {
        const styles = {
            Activo: { bg: '#e0f2fe', text: '#0369a1' },
            Pasivo: { bg: '#f3e8ff', text: '#6b21a8' },
            Capital: { bg: '#ffedd5', text: '#c2410c' },
            Ingreso: { bg: '#dcfce7', text: '#15803d' },
            Gasto: { bg: '#fee2e2', text: '#b91c1c' }
        };
        return styles[tipo] || { bg: '#f1f5f9', text: '#475569' };
    };

    return (
        <div style={{ padding: '30px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Urbanist, sans-serif' }}>
            
            {/* ENCABEZADO SUPERIOR */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', margin: 0 }}>Plan de Cuentas</h1>
                    <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0' }}>Gestiona todas las cuentas contables de tu negocio</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                        <FiPlus /> Nueva Cuenta
                    </button>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'white', color: '#334155', border: '1px solid #e2e8f0', padding: '10px 16px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                        <FiDownload /> Exportar
                    </button>
                </div>
            </div>

            {/* TARJETAS METRICAS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '25px' }}>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <span style={{ color: '#64748b', fontSize: '13px', fontWeight: '600' }}>Total de Cuentas</span>
                    <h3 style={{ fontSize: '28px', margin: '5px 0 0', color: '#1e293b', fontWeight: '700' }}>23</h3>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Cuentas registradas</span>
                </div>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <span style={{ color: '#64748b', fontSize: '13px', fontWeight: '600' }}>Activas</span>
                    <h3 style={{ fontSize: '28px', margin: '5px 0 0', color: '#22c55e', fontWeight: '700' }}>23</h3>
                    <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: '600' }}>100% del total</span>
                </div>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <span style={{ color: '#64748b', fontSize: '13px', fontWeight: '600' }}>Deudoras</span>
                    <h3 style={{ fontSize: '28px', margin: '5px 0 0', color: '#f59e0b', fontWeight: '700' }}>13</h3>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Cuentas deudoras</span>
                </div>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <span style={{ color: '#64748b', fontSize: '13px', fontWeight: '600' }}>Acreedoras</span>
                    <h3 style={{ fontSize: '28px', margin: '5px 0 0', color: '#a855f7', fontWeight: '700' }}>10</h3>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Cuentas acreedoras</span>
                </div>
            </div>

            {/* AREA PRINCIPAL CONTENEDORA (TABLA IZQ | DETALLE DER) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 0.9fr', gap: '25px', alignItems: 'start' }}>
                
                {/* SECCIÓN TABLA */}
                <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: 0 }}>Lista de Cuentas</h2>
                    </div>
                    
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <th style={{ padding: '14px 20px', fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Código</th>
                                <th style={{ padding: '14px 20px', fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Nombre de la Cuenta</th>
                                <th style={{ padding: '14px 20px', fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Tipo</th>
                                <th style={{ padding: '14px 20px', fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Naturaleza</th>
                                <th style={{ padding: '14px 20px', fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Estado</th>
                                <th style={{ padding: '14px 20px', fontSize: '13px', fontWeight: '600', color: '#64748b', textAlign: 'center' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cuentasIniciales.map((item) => {
                                const styleTipo = getTipoStyle(item.tipo);
                                const isSelected = cuentaSeleccionada.codigo === item.codigo;
                                
                                return (
                                    <tr 
                                        key={item.codigo} 
                                        onClick={() => setCuentaSeleccionada(item)}
                                        style={{ 
                                            borderBottom: '1px solid #e2e8f0', 
                                            cursor: 'pointer',
                                            backgroundColor: isSelected ? '#f0f5ff' : 'transparent',
                                            transition: 'background-color 0.2s'
                                        }}
                                    >
                                        <td style={{ padding: '14px 20px', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{item.codigo}</td>
                                        <td style={{ padding: '14px 20px', fontSize: '14px', color: '#334155' }}>{item.nombre}</td>
                                        <td style={{ padding: '14px 20px' }}>
                                            <span style={{ backgroundColor: styleTipo.bg, color: styleTipo.text, padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}>
                                                {item.tipo}
                                            </span>
                                        </td>
                                        <td style={{ padding: '14px 20px', fontSize: '14px', color: '#475569' }}>{item.naturaleza}</td>
                                        <td style={{ padding: '14px 20px' }}>
                                            <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}>
                                                {item.estado}
                                            </span>
                                        </td>
                                        <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }} onClick={(e) => e.stopPropagation()}>
                                                <button style={{ border: 'none', background: 'transparent', color: '#2563eb', cursor: 'pointer', padding: '4px' }} title="Editar"><FiEdit2 size={16} /></button>
                                                <button style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer', padding: '4px' }} title="Eliminar"><FiTrash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* DETALLE PANEL LATERAL DERECHO */}
                <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', position: 'sticky', top: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: 0 }}>Detalle de la Cuenta</h2>
                        <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}>
                            {cuentaSeleccionada.estado}
                        </span>
                    </div>

                    {/* Fila Identificadora con Icono */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px', backgroundColor: '#f8fafc', padding: '15px', borderRadius: '10px' }}>
                        <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
                            <FiFileText size={22} />
                        </div>
                        <div>
                            <div style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b' }}>{cuentaSeleccionada.codigo}</div>
                            <div style={{ fontSize: '15px', color: '#475569', fontWeight: '600' }}>{cuentaSeleccionada.nombre}</div>
                        </div>
                    </div>

                    {/* Fichas de metadatos */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '25px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                            <span style={{ color: '#64748b', fontSize: '14px' }}>Tipo de Cuenta:</span>
                            <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>{cuentaSeleccionada.tipo}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                            <span style={{ color: '#64748b', fontSize: '14px' }}>Naturaleza:</span>
                            <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>{cuentaSeleccionada.naturaleza}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                            <span style={{ color: '#64748b', fontSize: '14px' }}>Descripción:</span>
                            <span style={{ color: '#475569', fontSize: '13.5px', lineHeight: '1.5' }}>{cuentaSeleccionada.descripcion}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                            <span style={{ color: '#64748b', fontSize: '14px' }}>Saldo Actual:</span>
                            <span style={{ fontWeight: '800', color: '#166534', fontSize: '15px' }}>${cuentaSeleccionada.saldo.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                            <span style={{ color: '#64748b', fontSize: '14px' }}>Fecha de Creación:</span>
                            <span style={{ fontWeight: '500', color: '#475569', fontSize: '14px' }}>{cuentaSeleccionada.creacion}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px' }}>
                            <span style={{ color: '#64748b', fontSize: '14px' }}>Última Actualización:</span>
                            <span style={{ fontWeight: '500', color: '#475569', fontSize: '14px' }}>{cuentaSeleccionada.actualizacion}</span>
                        </div>
                    </div>

                    {/* Botones de acción rápida */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                        <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', backgroundColor: 'white', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '8px', color: '#334155', fontWeight: '600', cursor: 'pointer', fontSize: '13.5px' }}>
                            <FiEdit2 size={14} /> Editar Cuenta
                        </button>
                        <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', backgroundColor: '#f0f5ff', border: 'none', padding: '10px', borderRadius: '8px', color: '#2563eb', fontWeight: '600', cursor: 'pointer', fontSize: '13.5px' }}>
                            <FiArrowRight size={14} /> Ver Movimientos
                        </button>
                    </div>

                    <button style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', backgroundColor: '#fef2f2', border: 'none', padding: '10px', borderRadius: '8px', color: '#ef4444', fontWeight: '600', cursor: 'pointer', fontSize: '13.5px' }}>
                        <FiTrash2 size={14} /> Eliminar Cuenta
                    </button>

                    {/* Mensaje de Información del pie */}
                    <div style={{ display: 'flex', gap: '10px', backgroundColor: '#eff6ff', padding: '12px', borderRadius: '8px', marginTop: '20px', border: '1px solid #bfdbfe' }}>
                        <FiInfo color="#1d4ed8" size={20} style={{ shrink: 0 }} />
                        <p style={{ margin: 0, fontSize: '11.5px', color: '#1e40af', lineHeight: '1.4' }}>
                            Las cuentas contables permiten clasificar y organizar las operaciones financieras de tu negocio.
                        </p>
                    </div>

                </div>

            </div>

        </div>
    );
}