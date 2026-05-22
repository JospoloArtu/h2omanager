import React, { useState } from 'react';
import { FiPlus, FiDownload, FiCheckCircle, FiAlertCircle, FiEye, FiEdit3, FiXCircle, FiCalendar, FiFilter, FiSearch } from 'react-icons/fi';

export default function AsientosContables() {
    // Datos maestros de los asientos contables principales (según tu prototipo)
    const asientosIniciales = [
        { id: 15, fecha: '12/04/2025', descripcion: 'Venta a Juan Pérez', referencia: 'V-00015', tipo: 'Venta', debe: 2120.00, haber: 2120.00, estado: 'Publicado',
          detallesCuentas: [
              { no: 1, codigo: '1.1.01', cuenta: 'Caja', descripcion: 'Ingreso por venta de botellones a Juan Pérez', debe: 2120.00, haber: 0.00 },
              { no: 2, codigo: '4.1.01', cuenta: 'Ventas', descripcion: 'Venta de 10 botellones de agua', debe: 0.00, haber: 1843.48 },
              { no: 3, codigo: '2.1.03', cuenta: 'IVA por Pagar', descripcion: 'IVA 15% sobre venta', debe: 0.00, haber: 276.52 }
          ]
        },
        { id: 14, fecha: '12/04/2025', descripcion: 'Compra a AguaPur S.A.', referencia: 'C-00008', tipo: 'Compra', debe: 1630.00, haber: 1630.00, estado: 'Publicado',
          detallesCuentas: [
              { no: 1, codigo: '1.2.01', cuenta: 'Inventario de Botellones', descripcion: 'Compra de botellones vacíos de repuesto', debe: 1630.00, haber: 0.00 },
              { no: 2, codigo: '1.1.02', cuenta: 'Bancos', descripcion: 'Pago transferencia a AguaPur S.A.', debe: 0.00, haber: 1630.00 }
          ]
        },
        { id: 13, fecha: '11/04/2025', descripcion: 'Pago de Transporte', referencia: 'P-00005', tipo: 'Gasto', debe: 220.00, haber: 220.00, estado: 'Publicado',
          detallesCuentas: [
              { no: 1, codigo: '5.1.01', cuenta: 'Gastos de Transporte', descripcion: 'Flete de distribución rutas largas', debe: 220.00, haber: 0.00 },
              { no: 2, codigo: '1.1.01', cuenta: 'Caja', descripcion: 'Efectivo chófer despacho', debe: 0.00, haber: 220.00 }
          ]
        }
    ];

    // Estado para manejar la selección del asiento
    const [asientoSeleccionado, setAsientoSeleccionado] = useState(asientosIniciales[0]);

    return (
        <div style={{ padding: '25px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Urbanist, sans-serif' }}>
            
            {/* ENCABEZADO */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', margin: 0 }}>Asientos Contables</h1>
                    <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0' }}>Registra y consulta los asientos contables del sistema</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'white', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', color: '#475569' }}>
                        <FiCalendar /> <span>01/04/2025 - 12/04/2025</span>
                    </div>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                        <FiPlus /> Nuevo Asiento
                    </button>
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
                        <h3 style={{ fontSize: '22px', margin: 0, color: '#1e293b', fontWeight: '700' }}>$14,250.00</h3>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>Este período</span>
                    </div>
                </div>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '12px', borderRadius: '10px' }}><FiAlertCircle size={20}/></div>
                    <div>
                        <span style={{ color: '#64748b', fontSize: '12px', fontWeight: '600' }}>Total Haber</span>
                        <h3 style={{ fontSize: '22px', margin: 0, color: '#1e293b', fontWeight: '700' }}>$14,250.00</h3>
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

            {/* FILTROS DE BÚSQUEDA */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <input type="text" placeholder="Buscar por referencia o descripción..." style={{ flex: 1, padding: '10px 15px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }} />
                <select style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#475569', fontSize: '14px', backgroundColor: 'white' }}>
                    <option>Todos los Tipos</option>
                    <option>Venta</option>
                    <option>Compra</option>
                    <option>Gasto</option>
                </select>
                <button style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'white', border: '1px solid #e2e8f0', padding: '10px 15px', borderRadius: '8px', color: '#475569', fontWeight: '600', cursor: 'pointer' }}>
                    <FiFilter /> Filtros
                </button>
            </div>

            {/* MALLA PRINCIPAL LAYOUT ESTRUCTURAL */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 0.9fr', gap: '25px', alignItems: 'start' }}>
                
                {/* LADO IZQUIERDO: TABLA DE ASIENTOS Y TABLA DE DETALLES */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    
                    {/* TABLA PRINCIPAL DE ASIENTOS */}
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                    <th style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Fecha</th>
                                    <th style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b', fontWeight: '600' }}>No. Asiento</th>
                                    <th style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Descripción</th>
                                    <th style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Referencia</th>
                                    <th style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Tipo</th>
                                    <th style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Debe</th>
                                    <th style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Haber</th>
                                    <th style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {asientosIniciales.map((asiento) => {
                                    const isSelected = asientoSeleccionado.id === asiento.id;
                                    return (
                                        <tr 
                                            key={asiento.id}
                                            onClick={() => setCuentaSeleccionada(asiento) /* Rompe la propagación si es necesario */ || setAsientoSeleccionado(asiento)}
                                            style={{ 
                                                borderBottom: '1px solid #e2e8f0', 
                                                cursor: 'pointer',
                                                backgroundColor: isSelected ? '#f0f5ff' : 'transparent',
                                                transition: 'background-color 0.2s'
                                            }}
                                        >
                                            <td style={{ padding: '14px 16px', fontSize: '13.5px', color: '#475569' }}>{asiento.fecha}</td>
                                            <td style={{ padding: '14px 16px', fontSize: '13.5px', fontWeight: '700', color: '#1e293b', textAlign: 'center' }}>{asiento.id}</td>
                                            <td style={{ padding: '14px 16px', fontSize: '13.5px', fontWeight: '600', color: '#1e293b' }}>{asiento.descripcion}</td>
                                            <td style={{ padding: '14px 16px', fontSize: '13.5px', color: '#64748b' }}>{asiento.referencia}</td>
                                            <td style={{ padding: '14px 16px', fontSize: '13.5px', color: '#475569' }}>{asiento.tipo}</td>
                                            <td style={{ padding: '14px 16px', fontSize: '13.5px', fontWeight: '600', color: '#475569' }}>${asiento.debe.toFixed(2)}</td>
                                            <td style={{ padding: '14px 16px', fontSize: '13.5px', fontWeight: '600', color: '#475569' }}>${asiento.haber.toFixed(2)}</td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}>{asiento.estado}</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* TABLA INFERIOR: DETALLE DE CUENTAS DEL ASIENTO SELECCIONADO */}
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', margin: 0 }}>Detalle de Cuentas del Asiento Seleccionado</h3>
                            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Asiento #{asientoSeleccionado.id}</span>
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
                                    <th style={{ padding: '10px', fontSize: '12px', color: '#64748b' }}>No.</th>
                                    <th style={{ padding: '10px', fontSize: '12px', color: '#64748b' }}>Código</th>
                                    <th style={{ padding: '10px', fontSize: '12px', color: '#64748b' }}>Cuenta</th>
                                    <th style={{ padding: '10px', fontSize: '12px', color: '#64748b' }}>Descripción</th>
                                    <th style={{ padding: '10px', fontSize: '12px', color: '#64748b' }}>Debe</th>
                                    <th style={{ padding: '10px', fontSize: '12px', color: '#64748b' }}>Haber</th>
                                </tr>
                            </thead>
                            <tbody>
                                {asientoSeleccionado.detallesCuentas.map((subItem) => (
                                    <tr key={subItem.no} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '12px 10px', fontSize: '13.5px', color: '#64748b' }}>{subItem.no}</td>
                                        <td style={{ padding: '12px 10px', fontSize: '13.5px', fontWeight: '600', color: '#334155' }}>{subItem.codigo}</td>
                                        <td style={{ padding: '12px 10px', fontSize: '13.5px', fontWeight: '600', color: '#1e293b' }}>{subItem.cuenta}</td>
                                        <td style={{ padding: '12px 10px', fontSize: '13.5px', color: '#475569' }}>{subItem.descripcion}</td>
                                        <td style={{ padding: '12px 10px', fontSize: '13.5px', fontWeight: '600', color: subItem.debe > 0 ? '#16a34a' : '#475569' }}>
                                            {subItem.debe > 0 ? `$${subItem.debe.toFixed(2)}` : '$0.00'}
                                        </td>
                                        <td style={{ padding: '12px 10px', fontSize: '13.5px', fontWeight: '600', color: subItem.haber > 0 ? '#b91c1c' : '#475569' }}>
                                            {subItem.haber > 0 ? `$${subItem.haber.toFixed(2)}` : '$0.00'}
                                        </td>
                                    </tr>
                                ))}
                                <tr style={{ backgroundColor: '#f8fafc', fontWeight: '700' }}>
                                    <td colSpan={4} style={{ padding: '12px 10px', textAlign: 'left', color: '#1e293b' }}>Totales</td>
                                    <td style={{ padding: '12px 10px', color: '#16a34a' }}>${asientoSeleccionado.debe.toFixed(2)}</td>
                                    <td style={{ padding: '12px 10px', color: '#b91c1c' }}>${asientoSeleccionado.haber.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* PANEL LATERAL DERECHO: DETALLES GENERALES */}
                <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '22px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', position: 'sticky', top: '25px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', margin: 0 }}>Detalle del Asiento</h3>
                        <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}>{asientoSeleccionado.estado}</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '25px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                            <span style={{ color: '#64748b', fontSize: '13.5px' }}>No. Asiento:</span>
                            <span style={{ fontWeight: '700', color: '#1e293b', fontSize: '13.5px' }}>{asientoSeleccionado.id}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                            <span style={{ color: '#64748b', fontSize: '13.5px' }}>Fecha:</span>
                            <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '13.5px' }}>{asientoSeleccionado.fecha}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                            <span style={{ color: '#64748b', fontSize: '13.5px' }}>Descripción:</span>
                            <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '13.5px', textAlign: 'right' }}>{asientoSeleccionado.descripcion}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                            <span style={{ color: '#64748b', fontSize: '13.5px' }}>Referencia:</span>
                            <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '13.5px' }}>{asientoSeleccionado.referencia}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                            <span style={{ color: '#64748b', fontSize: '13.5px' }}>Tipo:</span>
                            <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '13.5px' }}>{asientoSeleccionado.tipo}</span>
                        </div>
                    </div>

                    <h4 style={{ fontSize: '13px', color: '#64748b', margin: '0 0 12px 0' }}>Totales del Asiento</h4>
                    <div style={{ backgroundColor: '#f8fafc', padding: '14px', borderRadius: '8px', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '13.5px', color: '#475569' }}>Total Debe:</span>
                            <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#16a34a' }}>${asientoSeleccionado.debe.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span style={{ fontSize: '13.5px', color: '#475569' }}>Total Haber:</span>
                            <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#b91c1c' }}>${asientoSeleccionado.haber.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                            <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#1e293b' }}>Diferencia:</span>
                            <span style={{ fontSize: '14px', fontWeight: '800', color: '#16a34a' }}>$0.00 <span style={{ fontSize: '11px', fontWeight: '600' }}>✓ Cuadrado</span></span>
                        </div>
                    </div>

                    {/* ACCIONES RÁPIDAS */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#f0f5ff', color: '#2563eb', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>
                            <FiEye /> Ver Detalle Complete
                        </button>
                        <button style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#fff7ed', color: '#c2410c', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>
                            <FiEdit3 /> Editar Asiento
                        </button>
                        <button style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#fef2f2', color: '#ef4444', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>
                            <FiXCircle /> Anular Asiento
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}