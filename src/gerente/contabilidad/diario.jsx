import React from 'react';
import { FiPlus, FiDownload, FiPrinter, FiUpload, FiCalendar, FiFilter, FiSearch, FiCheckCircle } from 'react-icons/fi';

export default function LibroDiario() {
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

    return (
        <div style={{ padding: '25px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Urbanist, sans-serif' }}>
            
            {/* ENCABEZADO */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', margin: 0 }}>Libro Diario</h1>
                    <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0' }}>Registro cronológico de todas las operaciones contables</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'white', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', color: '#475569' }}>
                    <FiCalendar /> <span>12/04/2025 - 12/04/2025</span>
                </div>
            </div>

            {/* TARJETAS DE MÉTRICAS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '25px' }}>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '12px', borderRadius: '10px' }}><FiSearch size={20}/></div>
                    <div>
                        <span style={{ color: '#64748b', fontSize: '12px', fontWeight: '600' }}>Total Asientos</span>
                        <h3 style={{ fontSize: '22px', margin: 0, color: '#1e293b', fontWeight: '700' }}>15</h3>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>Este período</span>
                    </div>
                </div>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ backgroundColor: '#f0fdf4', color: '#16a34a', padding: '12px', borderRadius: '10px' }}><FiCheckCircle size={20}/></div>
                    <div>
                        <span style={{ color: '#64748b', fontSize: '12px', fontWeight: '600' }}>Total Debe</span>
                        <h3 style={{ fontSize: '22px', margin: 0, color: '#1e293b', fontWeight: '700' }}>$2,660.00</h3>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>Este período</span>
                    </div>
                </div>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '12px', borderRadius: '10px' }}><FiCheckCircle size={20}/></div>
                    <div>
                        <span style={{ color: '#64748b', fontSize: '12px', fontWeight: '600' }}>Total Haber</span>
                        <h3 style={{ fontSize: '22px', margin: 0, color: '#1e293b', fontWeight: '700' }}>$2,660.00</h3>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>Este período</span>
                    </div>
                </div>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ backgroundColor: '#f5f3ff', color: '#7c3aed', padding: '12px', borderRadius: '10px' }}><FiCheckCircle size={20}/></div>
                    <div>
                        <span style={{ color: '#64748b', fontSize: '12px', fontWeight: '600' }}>Balance</span>
                        <h3 style={{ fontSize: '22px', margin: 0, color: '#16a34a', fontWeight: '700' }}>$0.00</h3>
                        <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: '600' }}>Debe = Haber</span>
                    </div>
                </div>
            </div>

            {/* SECCIÓN DE FILTROS */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <select style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#475569', fontSize: '14px', backgroundColor: 'white' }}>
                    <option>Todas las Fechas</option>
                </select>
                <select style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#475569', fontSize: '14px', backgroundColor: 'white' }}>
                    <option>Todos los Asientos</option>
                </select>
                <input type="text" placeholder="Buscar en el libro diario..." style={{ flex: 1, padding: '10px 15px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }} />
                <button style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'white', border: '1px solid #e2e8f0', padding: '10px 15px', borderRadius: '8px', color: '#475569', fontWeight: '600', cursor: 'pointer' }}>
                    <FiFilter /> Filtros
                </button>
            </div>

            {/* GRID PRINCIPAL DE DOS COLUMNAS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 0.9fr', gap: '25px', alignItems: 'start' }}>
                
                {/* LADO IZQUIERDO: CONTENEDOR DE LA TABLA */}
                <div style={{ 
                    backgroundColor: 'white', 
                    borderRadius: '12px', 
                    border: '1px solid #e2e8f0', 
                    overflow: 'hidden', 
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    
                    {/* CONTENEDOR CON SCROLL HORIZONTAL PROPIO */}
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
                                {asientosDiario.map((asiento, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background-color 0.2s' }}>
                                        <td style={{ padding: '14px 16px', fontSize: '13px', color: '#475569', whiteSpace: 'nowrap' }}>{asiento.fecha}</td>
                                        <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '700', color: '#1e293b', textAlign: 'center' }}>{asiento.noAsiento}</td>
                                        <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '600', color: '#1e293b', whiteSpace: 'nowrap' }}>{asiento.descripcion}</td>
                                        <td style={{ padding: '14px 16px', fontSize: '13px', color: '#475569', whiteSpace: 'nowrap' }}>{asiento.cuentaDebe}</td>
                                        <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '700', color: '#1e293b', whiteSpace: 'nowrap' }}>${asiento.debe.toFixed(2)}</td>
                                        <td style={{ padding: '14px 16px', fontSize: '13px', color: '#475569', whiteSpace: 'nowrap' }}>{asiento.cuentaHaber}</td>
                                        <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '700', color: '#1e293b', whiteSpace: 'nowrap' }}>${asiento.haber.toFixed(2)}</td>
                                        <td style={{ padding: '14px 16px', fontSize: '13px', color: '#64748b', whiteSpace: 'nowrap' }}>{asiento.referencia}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* SECCIÓN DE PAGINACIÓN FIJA ABAJO */}
                    <div style={{ padding: '15px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '13px', color: '#64748b' }}>
                        <span>Mostrando 1 a 10 de 15 asientos</span>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <button style={{ border: '1px solid #e2e8f0', background: 'white', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }}>&lt;</button>
                            <button style={{ border: 'none', background: '#2563eb', color: 'white', padding: '4px 10px', borderRadius: '4px', fontWeight: '600' }}>1</button>
                            <button style={{ border: '1px solid #e2e8f0', background: 'white', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }}>2</button>
                            <button style={{ border: '1px solid #e2e8f0', background: 'white', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }}>&gt;</button>
                        </div>
                    </div>
                </div>

                {/* LADO DERECHO: DETALLES Y ACCIONES */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* RESUMEN DEL PERÍODO */}
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', margin: '0 0 16px 0' }}>Resumen del Período</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                                <span style={{ color: '#64748b' }}>Total Debe</span>
                                <span style={{ fontWeight: '700', color: '#16a34a' }}>$2,660.00</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                                <span style={{ color: '#64748b' }}>Total Haber</span>
                                <span style={{ fontWeight: '700', color: '#b91c1c' }}>$2,660.00</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                                <span style={{ color: '#64748b', fontWeight: '600' }}>Balance</span>
                                <span style={{ fontWeight: '700', color: '#16a34a' }}>$0.00</span>
                            </div>
                            <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: '700', backgroundColor: '#dcfce7', padding: '6px', borderRadius: '6px', marginTop: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px' }}>
                                 ✓ Debe = Haber
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
                            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', padding: '10px 14px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>
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