import { useState } from 'react';
import { FiDownload, FiInfo } from 'react-icons/fi';
import { BiDollarCircle, BiTrendingDown, BiTrendingUp } from 'react-icons/bi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Swal from 'sweetalert2';

export default function EstadoResultados() {
    const [fecha, setFecha] = useState('01/04/2025 - 12/04/2025');

    // Datos para la gráfica comparativa (Ingresos vs Gastos)
    const dataGrafica = [
        { name: 'Ingresos', monto: 2000, color: '#10b981' },
        { name: 'Gastos', monto: 1200, color: '#ef4444' }
    ];

    const handleExportar = (tipo) => {
        Swal.fire({
            icon: 'success',
            title: `Reporte Exportado`,
            text: `El Estado de Resultados se ha descargado en formato ${tipo}.`,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#2563eb'
        });
    };

    return (
        <div style={{ padding: '30px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
            
            {/* ENCABEZADO SUPERIOR */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>Estado de Resultados</h1>
                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>Resumen de ingresos, gastos y utilidad del período</p>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ padding: '8px 12px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>📅 {fecha}</span>
                    </div>
                    <button onClick={() => handleExportar('PDF')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 14px', backgroundColor: '#fde8e8', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600', color: '#dc2626', cursor: 'pointer' }}>
                        <FiDownload /> Exportar PDF
                    </button>
                    <button onClick={() => handleExportar('Excel')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 14px', backgroundColor: '#e6f4ea', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600', color: '#137333', cursor: 'pointer' }}>
                        <FiDownload /> Exportar Excel
                    </button>
                </div>
            </div>

            {/* TARJETAS KPI SUPERIORES */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '25px' }}>
                {/* Ingresos Totales */}
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#10b981', color: 'white', display: 'flex', alignItems: 'center', center: 'center', justifyContent: 'center' }}><BiDollarCircle size={24} /></div>
                    <div>
                        <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Ingresos Totales</p>
                        <h3 style={{ margin: '2px 0', fontSize: '22px', fontWeight: '800', color: '#10b981' }}>$2,000.00</h3>
                        <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>Este período</p>
                    </div>
                </div>

                {/* Gastos Totales */}
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#ef4444', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BiTrendingDown size={24} /></div>
                    <div>
                        <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Gastos Totales</p>
                        <h3 style={{ margin: '2px 0', fontSize: '22px', fontWeight: '800', color: '#ef4444' }}>$1,200.00</h3>
                        <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>Este período</p>
                    </div>
                </div>

                {/* Utilidad Neta */}
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BiTrendingUp size={24} /></div>
                    <div>
                        <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Utilidad Neta</p>
                        <h3 style={{ margin: '2px 0', fontSize: '22px', fontWeight: '800', color: '#2563eb' }}>$800.00</h3>
                        <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>Este período</p>
                    </div>
                </div>
            </div>

            {/* SECCIÓN CENTRAL: TABLA DETALLE Y GRÁFICA */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.1fr', gap: '25px', alignItems: 'start' }}>
                
                {/* Bloque Izquierdo: Detalle del Estado de Resultados */}
                <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>Detalle del Estado de Resultados</h3>
                    
                    {/* Sección INGRESOS */}
                    <div style={{ backgroundColor: '#f0fdf4', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', color: '#16a34a', marginBottom: '10px', letterSpacing: '0.5px' }}>INGRESOS</div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', marginBottom: '20px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #e2e8f0', textTransform: 'uppercase', fontSize: '11px', color: '#64748b' }}>
                                <th style={{ textAlign: 'left', padding: '8px 4px' }}>Cuenta</th>
                                <th style={{ textAlign: 'right', padding: '8px 4px' }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '10px 4px', color: '#475569' }}><span style={{ color: '#94a3b8', marginRight: '8px' }}>4.1.01</span> Ventas de Botellones</td>
                                <td style={{ textAlign: 'right', padding: '10px 4px', fontWeight: '600', color: '#1e293b' }}>$2,000.00</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px 4px', color: '#475569' }}><span style={{ color: '#94a3b8', marginRight: '8px' }}>4.1.02</span> Otros Ingresos</td>
                                <td style={{ textAlign: 'right', padding: '10px 4px', fontWeight: '600', color: '#94a3b8' }}>$0.00</td>
                            </tr>
                            <tr style={{ fontWeight: '700', color: '#16a34a', borderTop: '1px solid #e2e8f0' }}>
                                <td style={{ padding: '12px 4px' }}>TOTAL INGRESOS</td>
                                <td style={{ textAlign: 'right', padding: '12px 4px' }}>$2,000.00</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Sección GASTOS */}
                    <div style={{ backgroundColor: '#fdf2f2', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', color: '#dc2626', marginBottom: '10px', letterSpacing: '0.5px' }}>GASTOS</div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', marginBottom: '25px' }}>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '10px 4px', color: '#475569' }}><span style={{ color: '#94a3b8', marginRight: '8px' }}>5.1.01</span> Gastos de Transporte</td>
                                <td style={{ textAlign: 'right', padding: '10px 4px', fontWeight: '600', color: '#334155' }}>$300.00</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '10px 4px', color: '#475569' }}><span style={{ color: '#94a3b8', marginRight: '8px' }}>5.1.02</span> Gastos de Administración</td>
                                <td style={{ textAlign: 'right', padding: '10px 4px', fontWeight: '600', color: '#334155' }}>$500.00</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '10px 4px', color: '#475569' }}><span style={{ color: '#94a3b8', marginRight: '8px' }}>5.1.03</span> Gastos de Publicidad</td>
                                <td style={{ textAlign: 'right', padding: '10px 4px', fontWeight: '600', color: '#334155' }}>$100.00</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '10px 4px', color: '#475569' }}><span style={{ color: '#94a3b8', marginRight: '8px' }}>5.1.04</span> Gastos de Depreciación</td>
                                <td style={{ textAlign: 'right', padding: '10px 4px', fontWeight: '600', color: '#334155' }}>$200.00</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '10px 4px', color: '#475569' }}><span style={{ color: '#94a3b8', marginRight: '8px' }}>5.1.05</span> Otros Gastos</td>
                                <td style={{ textAlign: 'right', padding: '10px 4px', fontWeight: '600', color: '#334155' }}>$100.00</td>
                            </tr>
                            <tr style={{ fontWeight: '700', color: '#dc2626', borderTop: '1px solid #e2e8f0' }}>
                                <td style={{ padding: '12px 4px' }}>TOTAL GASTOS</td>
                                <td style={{ textAlign: 'right', padding: '12px 4px' }}>$1,200.00</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Banner de Utilidad final */}
                    <div style={{ backgroundColor: '#eff6ff', borderRadius: '10px', padding: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px dashed #bfdbfe' }}>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Utilidad Neta del Período</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                            <h2 style={{ margin: 0, fontSize: '28px', fontWeight: '900', color: '#16a34a' }}>$800.00</h2>
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#d1fae5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BiTrendingUp size={18} /></div>
                        </div>
                    </div>

                </div>

                {/* Bloque Derecho: Gráfica e Indicadores */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* Caja de la Gráfica */}
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px' }}>
                        <h4 style={{ margin: '0 0 15px 0', fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>Comparación Ingresos vs Gastos</h4>
                        <div style={{ width: '100%', height: '180px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dataGrafica} barSize={45}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} domain={[0, 2500]} />
                                    <Tooltip cursor={{ fill: '#f8fafc' }} />
                                    <Bar dataKey="monto" fill="#10b981">
                                        {dataGrafica.map((entry, index) => (
                                            <rect key={`bar-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        {/* Leyendas personalizadas */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px', fontSize: '12px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b' }}><span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#10b981' }}/> Ingresos</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b' }}><span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#ef4444' }}/> Gastos</span>
                        </div>
                    </div>

                    {/* Indicadores del Período */}
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px' }}>
                        <h4 style={{ margin: '0 0 15px 0', fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>Indicadores del Período</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b' }}>Margen de Utilidad</span>
                                <span style={{ fontWeight: '700', color: '#16a34a' }}>40.00%</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b' }}>Relación Gastos / Ingresos</span>
                                <span style={{ fontWeight: '600', color: '#334155' }}>60.00%</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b' }}>Ingresos Promedio Diario</span>
                                <span style={{ fontWeight: '600', color: '#334155' }}>$166.67</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b' }}>Gastos Promedio Diario</span>
                                <span style={{ fontWeight: '600', color: '#334155' }}>$100.00</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Cuadro Informativo de Abajo */}
            <div style={{ marginTop: '20px', padding: '12px 16px', backgroundColor: '#eff6ff', borderRadius: '8px', display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '12px', color: '#1e40af', lineHeight: '1.5' }}>
                <FiInfo size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                    <strong>Información:</strong> El Estado de Resultados muestra el desempeño financiero del negocio durante el período seleccionado, detallando los ingresos, gastos y la utilidad o pérdida neta.
                </div>
            </div>
            
            <p style={{ textAlign: 'center', fontSize: '11px', color: '#94a3b8', marginTop: '35px' }}>
                © 2025 H2OManager · Sistema Administrativo Contable
            </p>
        </div>
    );
}