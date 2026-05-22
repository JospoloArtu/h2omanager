import React, { useState } from 'react';
import { FiSearch, FiFilter, FiPrinter, FiDownload, FiEye, FiCalendar } from 'react-icons/fi';
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function LibroMayor() {
    // 1. Estado para controlar qué cuenta está activa en el sistema
    const [cuentaSeleccionada, setCuentaSeleccionada] = useState('1.1.01');
    const [busqueda, setBusqueda] = useState('');

    // Lista de cuentas con su configuración base
    const cuentas = [
        { codigo: '1.1.01', nombre: 'Caja', tipo: 'Activo', color: '#eff6ff', textColor: '#2563eb', naturaleza: 'Deudora' },
        { codigo: '1.1.02', nombre: 'Bancos', tipo: 'Activo', color: '#eff6ff', textColor: '#2563eb', naturaleza: 'Deudora' },
        { codigo: '1.2.01', nombre: 'Inventario de Botellones', tipo: 'Activo', color: '#eff6ff', textColor: '#2563eb', naturaleza: 'Deudora' },
        { codigo: '2.1.01', nombre: 'Proveedores', tipo: 'Pasivo', color: '#fdf2ff', textColor: '#a855f7', naturaleza: 'Acreedora' },
        { codigo: '4.1.01', nombre: 'Ventas', tipo: 'Ingreso', color: '#f0fdf4', textColor: '#16a34a', naturaleza: 'Acreedora' },
        { codigo: '5.1.01', nombre: 'Gastos de Transporte', tipo: 'Gasto', color: '#fef2f2', textColor: '#dc2626', naturaleza: 'Deudora' },
    ];

    // Base de datos integrada de movimientos (Simulando lo que vendrá de tu backend en PHP)
    const todosLosMovimientos = {
        '1.1.01': [ // Movimientos de Caja
            { fecha: '01/04', descripcion: 'Saldo Inicial', referencia: 'S/I', debe: 0, haber: 0, saldo: 0 },
            { fecha: '07/04', descripcion: 'Venta a Pedro Gómez', referencia: 'V-00011', debe: 60, haber: 0, saldo: 60 },
            { fecha: '08/04', descripcion: 'Venta a Ana Ruiz', referencia: 'V-00012', debe: 40, haber: 0, saldo: 100 },
            { fecha: '09/04', descripcion: 'Gastos de Administración', referencia: 'R-00004', debe: 0, haber: 100, saldo: 0 },
            { fecha: '10/04', descripcion: 'Venta a Carlos López', referencia: 'V-00013', debe: 100, haber: 0, saldo: 100 },
            { fecha: '11/04', descripcion: 'Pago de Transporte', referencia: 'R-00005', debe: 0, haber: 20, saldo: 80 },
            { fecha: '11/04', descripcion: 'Venta a María García', referencia: 'V-00014', debe: 30, haber: 0, saldo: 110 },
            { fecha: '12/04', descripcion: 'Venta a Juan Pérez', referencia: 'V-00015', debe: 50, haber: 0, saldo: 160 },
        ],
        '1.1.02': [ // Movimientos de Bancos (Ejemplo rápido)
            { fecha: '01/04', descripcion: 'Saldo Inicial', referencia: 'S/I', debe: 500, haber: 0, saldo: 500 },
            { fecha: '10/04', descripcion: 'Transferencia Recibida', referencia: 'V-00013', debe: 200, haber: 0, saldo: 700 },
        ],
        '1.2.01': [ // Inventario
            { fecha: '10/04', descripcion: 'Compra a AguaPur S.A.', referencia: 'C-001', debe: 1000, haber: 0, saldo: 1000 },
            { fecha: '12/04', descripcion: 'Compra a AguaPur S.A.', referencia: 'C-002', debe: 100, haber: 0, saldo: 1100 },
        ]
    };

    // Obtener los datos de la cuenta que está actualmente activa
    const infoCuentaActiva = cuentas.find(c => c.codigo === cuentaSeleccionada) || cuentas[0];
    const movimientosActivos = todosLosMovimientos[cuentaSeleccionada] || [
        { fecha: '-', descripcion: 'Sin movimientos en este período', referencia: '-', debe: 0, haber: 0, saldo: 0 }
    ];

    // Calcular los totales del Debe y Haber en tiempo real
    const totalDebe = movimientosActivos.reduce((sum, item) => sum + item.debe, 0);
    const totalHaber = movimientosActivos.reduce((sum, item) => sum + item.haber, 0);
    const saldoFinal = movimientosActivos[movimientosActivos.length - 1]?.saldo || 0;

    // Filtrar cuentas en la barra lateral por la búsqueda del usuario
    const cuentasFiltradas = cuentas.filter(c => 
        c.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
        c.codigo.includes(busqueda)
    );

    // Mapear la estructura exacta para alimentar el gráfico de Recharts de manera dinámica
    const datosGraficoDinamico = movimientosActivos.map(m => ({
        name: m.fecha,
        Debe: m.debe,
        Haber: m.haber,
        Saldo: m.saldo
    }));

    return (
        <div style={{ padding: '25px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Urbanist, sans-serif' }}>
            
            {/* ENCABEZADO */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <div>
                    <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1e293b', margin: 0 }}>Libro Mayor</h1>
                    <p style={{ color: '#64748b', fontSize: '13px', margin: '3px 0 0' }}>Consulta y control de los movimientos por cuenta</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'white', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', color: '#475569' }}>
                    <FiCalendar /> <span>12/04/2025 - 12/04/2025</span>
                </div>
            </div>

            {/* BUSCADOR COLECTIVO */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '15px', marginBottom: '20px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <FiSearch style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                    <input 
                        type="text" 
                        placeholder="Buscar cuenta por código o nombre..." 
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        style={{ width: '100%', padding: '10px 15px 10px 38px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13.5px' }} 
                    />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'white', border: '1px solid #e2e8f0', padding: '10px 16px', borderRadius: '8px', color: '#475569', fontSize: '13.5px', fontWeight: '600', cursor: 'pointer' }}><FiFilter /> Filtros</button>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'white', border: '1px solid #e2e8f0', padding: '10px 16px', borderRadius: '8px', color: '#475569', fontSize: '13.5px', fontWeight: '600', cursor: 'pointer' }}><FiPrinter /> Imprimir</button>
                </div>
            </div>

            {/* GRID PRINCIPAL */}
            <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.5fr 0.7fr', gap: '20px', alignItems: 'start' }}>
                
                {/* INTERFAZ 1: LISTA DINÁMICA */}
                <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#475569', marginTop: 0, marginBottom: '12px' }}>Lista de Cuentas</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '520px', overflowY: 'auto' }}>
                        {cuentasFiltradas.map((cta) => (
                            <div 
                                key={cta.codigo}
                                onClick={() => setCuentaSeleccionada(cta.codigo)}
                                style={{ 
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '8px', 
                                    border: cuentaSeleccionada === cta.codigo ? '1px solid #2563eb' : '1px solid #f1f5f9', 
                                    backgroundColor: cuentaSeleccionada === cta.codigo ? '#f0f6ff' : 'white', cursor: 'pointer'
                                }}
                            >
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#1e293b' }}>{cta.codigo}</span>
                                    <span style={{ fontSize: '13px', color: '#475569' }}>{cta.nombre}</span>
                                </div>
                                <span style={{ backgroundColor: cta.color, color: cta.textColor, padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '700' }}>{cta.tipo}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* INTERFAZ 2: TABLA Y GRÁFICO REACCIONANDO AL ESTADO */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                        <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9' }}>
                            <div>
                                <span style={{ fontSize: '16px', fontWeight: '800', color: '#1e293b' }}>{infoCuentaActiva.codigo} - {infoCuentaActiva.nombre} </span>
                                <span style={{ backgroundColor: infoCuentaActiva.color, color: infoCuentaActiva.textColor, padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', marginLeft: '5px' }}>{infoCuentaActiva.tipo}</span>
                            </div>
                        </div>

                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                    <th style={{ padding: '10px 14px', textLeft: 'left', color: '#64748b' }}>Fecha</th>
                                    <th style={{ padding: '10px 14px', textLeft: 'left', color: '#64748b' }}>Descripción</th>
                                    <th style={{ padding: '10px 14px', textLeft: 'left', color: '#64748b' }}>Ref</th>
                                    <th style={{ padding: '10px 14px', textAlign: 'right', color: '#64748b' }}>Debe</th>
                                    <th style={{ padding: '10px 14px', textAlign: 'right', color: '#64748b' }}>Haber</th>
                                    <th style={{ padding: '10px 14px', textAlign: 'right', color: '#64748b' }}>Saldo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {movimientosActivos.map((mov, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '11px 14px', color: '#64748b' }}>{mov.fecha}</td>
                                        <td style={{ padding: '11px 14px', fontWeight: '500' }}>{mov.descripcion}</td>
                                        <td style={{ padding: '11px 14px', color: '#94a3b8' }}>{mov.referencia}</td>
                                        <td style={{ padding: '11px 14px', textAlign: 'right', color: '#1e293b' }}>{mov.debe > 0 ? `$${mov.debe.toFixed(2)}` : '-'}</td>
                                        <td style={{ padding: '11px 14px', textAlign: 'right', color: '#1e293b' }}>{mov.haber > 0 ? `$${mov.haber.toFixed(2)}` : '-'}</td>
                                        <td style={{ padding: '11px 14px', textAlign: 'right', fontWeight: '600', color: '#16a34a' }}>${mov.saldo.toFixed(2)}</td>
                                    </tr>
                                ))}
                                <tr style={{ backgroundColor: '#f8fafc', fontWeight: '700', borderTop: '2px solid #e2e8f0' }}>
                                    <td colSpan="3" style={{ padding: '12px 14px' }}>Totales</td>
                                    <td style={{ padding: '12px 14px', textAlign: 'right', color: '#2563eb' }}>${totalDebe.toFixed(2)}</td>
                                    <td style={{ padding: '12px 14px', textAlign: 'right', color: '#dc2626' }}>${totalHaber.toFixed(2)}</td>
                                    <td style={{ padding: '12px 14px', textAlign: 'right', color: '#16a34a' }}>${saldoFinal.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* RENDERING DINÁMICO DEL GRÁFICO MIXTO */}
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px' }}>
                        <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#475569', margin: '0 0 15px 0' }}>Gráfico de Movimientos ({infoCuentaActiva.nombre})</h4>
                        <div style={{ width: '100%', height: '200px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={datosGraficoDinamico} margin={{ top: 10, right: -10, left: -20, bottom: 0 }}>
                                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <Tooltip />
                                    <Legend iconSize={10} wrapperStyle={{ fontSize: '11px' }} />
                                    <Bar dataKey="Debe" fill="#16a34a" radius={[3, 3, 0, 0]} barSize={10} />
                                    <Bar dataKey="Haber" fill="#dc2626" radius={[3, 3, 0, 0]} barSize={10} />
                                    <Line type="monotone" dataKey="Saldo" stroke="#2563eb" strokeWidth={2} dot={{ r: 2 }} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* INTERFAZ 3: RESUMEN LATERAL */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px' }}>
                        <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', margin: '0 0 14px 0' }}>Detalle de la Cuenta</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Código:</span><span style={{ fontWeight: '600' }}>{infoCuentaActiva.codigo}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Nombre:</span><span style={{ fontWeight: '600' }}>{infoCuentaActiva.nombre}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Naturaleza:</span><span style={{ fontWeight: '600', color: '#475569' }}>{infoCuentaActiva.naturaleza}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Saldo Actual:</span><span style={{ fontWeight: '700', color: '#16a34a' }}>${saldoFinal.toFixed(2)}</span></div>
                        </div>
                    </div>

                    <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px' }}>
                        <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', margin: '0 0 14px 0' }}>Resumen</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Total Debe:</span><span style={{ fontWeight: '600', color: '#16a34a' }}>${totalDebe.toFixed(2)}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Total Haber:</span><span style={{ fontWeight: '600', color: '#dc2626' }}>${totalHaber.toFixed(2)}</span></div>
                            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                                <span style={{ color: '#475569', fontSize: '12px' }}>Saldo Final:</span>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                    <h3 style={{ fontSize: '20px', color: '#16a34a', margin: 0, fontWeight: '800' }}>${saldoFinal.toFixed(2)}</h3>
                                    <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: '700' }}>({infoCuentaActiva.naturaleza})</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#f0f6ff', color: '#2563eb', border: '1px solid #bfdbfe', padding: '10px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}><FiEye /> Ver Movimientos</button>
                        <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: 'white', color: '#16a34a', border: '1px solid #bbf7d0', padding: '10px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}><FiDownload /> Exportar a Excel</button>
                    </div>
                </div>

            </div>
        </div>
    );
}