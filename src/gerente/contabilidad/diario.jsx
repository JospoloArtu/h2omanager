import React, { useState } from 'react';
import { FiPlus, FiDownload, FiPrinter, FiUpload, FiCalendar, FiFilter, FiSearch, FiCheckCircle } from 'react-icons/fi';

export default function LibroDiario() {
    // ESTADOS PARA BUSCADOR Y FILTROS
    const [busqueda, setBusqueda] = useState('');
    const [filtroFecha, setFiltroFecha] = useState('Todas');
    const [filtroAsiento, setFiltroAsiento] = useState('Todos');

    // Datos reales extraídos exactamente de tu diseño de H2OManager
    const asientosDiario = [
        { fecha: '12/04/2025', noAsiento: 15, descripcion: 'Venta a Juan Pérez', cuentaDebe: 'Caja / Banco', debe: 50.00, cuentaHaber: 'Ventas', haber: 50.00, referencia: 'Venta #V-00015' },
        { fecha: '12/04/2025', noAsiento: 14, descripcion: 'Compra a AguaPur S.A.', cuentaDebe: 'Inventario', debe: 100.00, cuentaHaber: 'Proveedores', haber: 100.00, referencia: 'Compra #C-00008' },
        { fecha: '11/04/2025', noAsiento: 13, descripcion: 'Venta a María García', cuentaDebe: 'Caja / Banco', debe: 30.00, cuentaHaber: 'Ventas', haber: 30.00, referencia: 'Venta #V-00014' },
        { fecha: '11/04/2025', noAsiento: 12, descripcion: 'Pago de Transporte', cuentaDebe: 'Gastos Transporte', debe: 20.00, cuentaHaber: 'Caja / Banco', haber: 20.00, referencia: 'Recibo #R-00005' },
        { fecha: '10/04/2025', noAsiento: 11, descripcion: 'Compra a AguaPur S.A.', cuentaDebe: 'Inventario', debe: 1000.00, cuentaHaber: 'Proveedores', haber: 1000.00, referencia: 'Compra #C-00007' },
        { fecha: '10/04/2025', noAsiento: 10, descripcion: 'Venta a Carlos López', cuentaDebe: 'Caja / Banco', debe: 100.00, cuentaHaber: 'Ventas', haber: 100.00, referencia: 'Venta #V-00013' },
        { fecha: '09/04/2025', noAsiento: 9, descripcion: 'Gastos de Administración', cuentaDebe: 'Gastos Admin.', debe: 100.00, cuentaHaber: 'Caja / Banco', haber: 100.00, referencia: 'Recibo #R-00004' },
        { fecha: '08/04/2025', noAsiento: 8, descripcion: 'Venta a Ana Ruiz', cuentaDebe: 'Caja / Banco', debe: 40.00, cuentaHaber: 'Ventas', haber: 40.00, referencia: 'Venta #V-00012' },
        { fecha: '07/04/2025', noAsiento: 7, descripcion: 'Pago a Proveedores', cuentaDebe: 'Proveedores', debe: 150.00, cuentaHaber: 'Caja / Banco', haber: 150.00, referencia: 'Pago #P-00003' },
        { fecha: '07/04/2025', noAsiento: 6, descripcion: 'Venta a Pedro Gómez', cuentaDebe: 'Caja / Banco', debe: 60.00, cuentaHaber: 'Ventas', haber: 60.00, referencia: 'Venta #V-00011' }
    ];

    // LÓGICA DE FILTRADO
    const asientosFiltrados = asientosDiario.filter(asiento => {
        const matchesBusqueda = 
            asiento.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
            asiento.cuentaDebe.toLowerCase().includes(busqueda.toLowerCase()) ||
            asiento.cuentaHaber.toLowerCase().includes(busqueda.toLowerCase()) ||
            asiento.referencia.toLowerCase().includes(busqueda.toLowerCase());
            
        const matchesFecha = filtroFecha === 'Todas' || asiento.fecha === filtroFecha;
        const matchesAsiento = filtroAsiento === 'Todos' || asiento.noAsiento.toString() === filtroAsiento;

        return matchesBusqueda && matchesFecha && matchesAsiento;
    });

    // TOTALES DINÁMICOS
    const totalDebe = asientosFiltrados.reduce((sum, item) => sum + item.debe, 0);
    const totalHaber = asientosFiltrados.reduce((sum, item) => sum + item.haber, 0);
    const balance = totalDebe - totalHaber;

    const fechasUnicas = [...new Set(asientosDiario.map(a => a.fecha))];
    const numerosAsientoUnicos = [...new Set(asientosDiario.map(a => a.noAsiento))].sort((a, b) => b - a);

    return (
        <div style={{ padding: '25px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Urbanist, sans-serif' }}>
            
            {/* ==========================================
               ESTILOS CSS ESPECÍFICOS PARA IMPRESIÓN LIMPIA
               ========================================== */}
            <style>{`
                @media print {
                    /* 1. Ocultar todo lo que no sea información contable */
                    aside, nav, header, button, input, select, .no-print, .paginacion-container {
                        display: none !important;
                    }
                    
                    /* 2. Resetear fondos de pantalla a blanco absoluto */
                    body, #root, div[style*="backgroundColor: '#f8fafc'"] {
                        background-color: white !important;
                        color: #0f172a !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        min-height: auto !important;
                    }

                    /* 3. Forzar que las 4 métricas se impriman en filas limpias */
                    .metricas-diario-grid {
                        display: grid !important;
                        grid-template-columns: repeat(4, 1fr) !important;
                        gap: 12px !important;
                        margin-bottom: 20px !important;
                    }

                    .card-metrica-diario {
                        border: 1px solid #cbd5e1 !important;
                        padding: 12px !important;
                        box-shadow: none !important;
                        background-color: white !important;
                    }

                    /* 4. Romper las dos columnas para que la tabla use el 100% de la hoja horizontal */
                    .main-diario-layout {
                        display: block !important;
                    }
                    
                    .tabla-diario-contenedor {
                        width: 100% !important;
                        max-width: 100% !important;
                        box-shadow: none !important;
                        border: 1px solid #cbd5e1 !important;
                        overflow: visible !important; /* Elimina el scroll cortado */
                    }

                    table {
                        min-width: 100% !important;
                        width: 100% !important;
                        table-layout: auto !important;
                    }

                    th, td {
                        padding: 10px 8px !important; /* Reducimos padding para que quepa todo el libro diario */
                        font-size: 11px !important; /* Fuente ligeramente más pequeña para prevenir desbordes en papel */
                        white-space: normal !important; /* Permitir que textos largos bajen de línea si es necesario */
                    }

                    th {
                        background-color: #f1f5f9 !important;
                        color: #0f172a !important;
                        border-bottom: 2px solid #cbd5e1 !important;
                    }
                }
            `}</style>

            {/* ENCABEZADO */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', margin: 0 }}>Libro Diario</h1>
                    <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0' }}>Registro cronológico de todas las operaciones contables</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'white', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', color: '#475569' }}>
                    <FiCalendar /> <span>07/04/2025 - 12/04/2025</span>
                </div>
            </div>

            {/* TARJETAS DE MÉTRICAS */}
            <div className="metricas-diario-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '25px' }}>
                <div className="card-metrica-diario" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '12px', borderRadius: '10px' }}><FiSearch size={20}/></div>
                    <div>
                        <span style={{ color: '#64748b', fontSize: '12px', fontWeight: '600' }}>Total Asientos</span>
                        <h3 style={{ fontSize: '22px', margin: 0, color: '#1e293b', fontWeight: '700' }}>{asientosFiltrados.length}</h3>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>Este período</span>
                    </div>
                </div>
                <div className="card-metrica-diario" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ backgroundColor: '#f0fdf4', color: '#16a34a', padding: '12px', borderRadius: '10px' }}><FiCheckCircle size={20}/></div>
                    <div>
                        <span style={{ color: '#64748b', fontSize: '12px', fontWeight: '600' }}>Total Debe</span>
                        <h3 style={{ fontSize: '22px', margin: 0, color: '#1e293b', fontWeight: '700' }}>${totalDebe.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>Este período</span>
                    </div>
                </div>
                <div className="card-metrica-diario" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '12px', borderRadius: '10px' }}><FiCheckCircle size={20}/></div>
                    <div>
                        <span style={{ color: '#64748b', fontSize: '12px', fontWeight: '600' }}>Total Haber</span>
                        <h3 style={{ fontSize: '22px', margin: 0, color: '#1e293b', fontWeight: '700' }}>${totalHaber.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>Este período</span>
                    </div>
                </div>
                <div className="card-metrica-diario" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ backgroundColor: balance === 0 ? '#f0fdf4' : '#fef2f2', color: balance === 0 ? '#16a34a' : '#dc2626', padding: '12px', borderRadius: '10px' }}><FiCheckCircle size={20}/></div>
                    <div>
                        <span style={{ color: '#64748b', fontSize: '12px', fontWeight: '600' }}>Balance</span>
                        <h3 style={{ fontSize: '22px', margin: 0, color: balance === 0 ? '#16a34a' : '#dc2626', fontWeight: '700' }}>${balance.toFixed(2)}</h3>
                        <span style={{ fontSize: '11px', color: balance === 0 ? '#16a34a' : '#dc2626', fontWeight: '600' }}>{balance === 0 ? "Debe = Haber" : "Descuadrado"}</span>
                    </div>
                </div>
            </div>

            {/* SECCIÓN DE FILTROS (OCULTOS EN IMPRESIÓN) */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <select value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)} style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#475569', fontSize: '14px', backgroundColor: 'white', cursor: 'pointer' }}>
                    <option value="Todas">Todas las Fechas</option>
                    {fechasUnicas.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                <select value={filtroAsiento} onChange={(e) => setFiltroAsiento(e.target.value)} style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#475569', fontSize: '14px', backgroundColor: 'white', cursor: 'pointer' }}>
                    <option value="Todos">Todos los Asientos</option>
                    {numerosAsientoUnicos.map(num => <option key={num} value={num}>Asiento #{num}</option>)}
                </select>
                <input type="text" placeholder="Buscar en el libro diario..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} style={{ flex: 1, padding: '10px 15px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }} />
            </div>

            {/* GRID PRINCIPAL DE DOS COLUMNAS */}
            <div className="main-diario-layout" style={{ display: 'grid', gridTemplateColumns: '1.6fr 0.9fr', gap: '25px', alignItems: 'start' }}>
                
                {/* LADO IZQUIERDO: CONTENEDOR DE LA TABLA */}
                <div className="tabla-diario-contenedor" style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                    
                    <div style={{ width: '100%', overflowX: 'auto' }}>
                        <table style={{ width: '100%', minWidth: '950px', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                    <th style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b', fontWeight: '600', whiteSpace: 'nowrap' }}>Fecha</th>
                                    <th style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b', fontWeight: '600', whiteSpace: 'nowrap', textAlign: 'center' }}>No. Asiento</th>
                                    <th style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b', fontWeight: '600', whiteSpace: 'nowrap' }}>Descripción</th>
                                    <th style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b', fontWeight: '600', whiteSpace: 'nowrap' }}>Cuenta Debe</th>
                                    <th style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b', fontWeight: '600', whiteSpace: 'nowrap' }}>Debe</th>
                                    <th style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b', fontWeight: '600', whiteSpace: 'nowrap' }}>Cuenta Haber</th>
                                    <th style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b', fontWeight: '600', whiteSpace: 'nowrap' }}>Haber</th>
                                    <th style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b', fontWeight: '600', whiteSpace: 'nowrap' }}>Referencia</th>
                                </tr>
                            </thead>
                            <tbody>
                                {asientosFiltrados.map((asiento, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                        <td style={{ padding: '14px 16px', fontSize: '13px', color: '#475569', whiteSpace: 'nowrap' }}>{asiento.fecha}</td>
                                        <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '700', color: '#1e293b', textAlign: 'center' }}>{asiento.noAsiento}</td>
                                        <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '600', color: '#1e293b', whiteSpace: 'nowrap' }}>{asiento.descripcion}</td>
                                        <td style={{ padding: '14px 16px', fontSize: '13px', color: '#475569', whiteSpace: 'nowrap' }}>{asiento.cuentaDebe}</td>
                                        <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '700', color: '#16a34a', whiteSpace: 'nowrap' }}>${asiento.debe.toFixed(2)}</td>
                                        <td style={{ padding: '14px 16px', fontSize: '13px', color: '#475569', whiteSpace: 'nowrap' }}>{asiento.cuentaHaber}</td>
                                        <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '700', color: '#dc2626', whiteSpace: 'nowrap' }}>${asiento.haber.toFixed(2)}</td>
                                        <td style={{ padding: '14px 16px', fontSize: '13px', color: '#64748b', whiteSpace: 'nowrap' }}>{asiento.referencia}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* PAGINACIÓN FIJA ABAJO */}
                    <div className="paginacion-container" style={{ padding: '15px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '13px', color: '#64748b' }}>
                        <span>Mostrando {asientosFiltrados.length} de {asientosDiario.length} asientos</span>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <button style={{ border: '1px solid #e2e8f0', background: 'white', padding: '4px 10px', borderRadius: '4px' }}>&lt;</button>
                            <button style={{ border: 'none', background: '#2563eb', color: 'white', padding: '4px 10px', borderRadius: '4px', fontWeight: '600' }}>1</button>
                            <button style={{ border: '1px solid #e2e8f0', background: 'white', padding: '4px 10px', borderRadius: '4px' }}>&gt;</button>
                        </div>
                    </div>
                </div>

                {/* LADO DERECHO: DETALLES Y ACCIONES (OCULTO AL IMPRIMIR) */}
                <div className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* RESUMEN DEL PERÍODO */}
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', margin: '0 0 16px 0' }}>Resumen del Período</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                                <span style={{ color: '#64748b' }}>Total Debe</span>
                                <span style={{ fontWeight: '700', color: '#16a34a' }}>${totalDebe.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                                <span style={{ color: '#64748b' }}>Total Haber</span>
                                <span style={{ fontWeight: '700', color: '#b91c1c' }}>${totalHaber.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                                <span style={{ color: '#64748b', fontWeight: '600' }}>Balance</span>
                                <span style={{ fontWeight: '700', color: '#16a34a' }}>$0.00</span>
                            </div>
                        </div>
                    </div>

                    {/* ACCIONES RÁPIDAS */}
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', margin: '0 0 16px 0' }}>Acciones Rápidas</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '10px 14px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>
                                <FiPlus /> Nuevo Asiento
                            </button>
                            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '10px 14px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>
                                <FiUpload /> Importar Asientos
                            </button>
                            <button 
                                onClick={() => window.print()}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', padding: '10px 14px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}
                            >
                                <FiPrinter /> Imprimir Libro Diario
                            </button>
                            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f8fafc', color: '#16a34a', border: '1px solid #e2e8f0', padding: '10px 14px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>
                                <FiDownload /> Exportar a Excel
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}