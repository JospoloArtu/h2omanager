import { useState } from 'react';
// Cambiamos el icono conflictivo a FaBalanceScale de 'react-icons/fa'
import { FaBalanceScale } from 'react-icons/fa';
import { BiArrowToBottom, BiArrowToTop, BiCheckCircle } from 'react-icons/bi';
import { FiRefreshCw, FiDownload, FiSearch, FiFileText } from 'react-icons/fi';
import Swal from 'sweetalert2';

export default function BalanceComprobacion() {
    // Estados para los filtros y búsquedas
    const [fechaInicial, setFechaInicial] = useState('2025-04-01');
    const [fechaFinal, setFechaFinal] = useState('2025-04-12');
    const [filtroCuenta, setFiltroCuenta] = useState('Todas las Cuentas');
    const [busqueda, setBusqueda] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    // Función para simular la actualización del balance
    const handleActualizarBalance = () => {
        setIsUpdating(true);
        setTimeout(() => {
            setIsUpdating(false);
            Swal.fire({
                icon: 'success',
                title: 'Balance Updated',
                text: 'Los saldos de las cuentas se han recalculado correctamente.',
                confirmButtonText: 'Aceptar',
                customClass: {
                    popup: 'swal-popup',
                    title: 'swal-title',
                    text: 'swal-text',
                    confirmButton: 'swal-confirm-btn'
                },
                buttonsStyling: false
            });
        }, 1200);
    };

    // Función para simular exportaciones
    const handleExportar = (tipo) => {
        Swal.fire({
            icon: 'info',
            title: `Exportando a ${tipo}`,
            text: `Tu reporte en formato ${tipo} se está generando de forma automática.`,
            timer: 2000,
            showConfirmButton: false,
            customClass: {
                popup: 'swal-popup',
                title: 'swal-title',
                text: 'swal-text'
            }
        });
    };

    return (
        <div style={{ padding: '30px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
            
            {/* Encabezado del Módulo */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>Balance de Comprobación</h1>
                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>Verifica la igualdad del saldo total deudor y acreedor</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                        onClick={handleActualizarBalance} 
                        disabled={isUpdating}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: '#334155', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                        <FiRefreshCw className={isUpdating ? 'spin-animation' : ''} /> Actualizar
                    </button>
                    <button 
                        onClick={() => handleExportar('Excel')}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: '#334155', cursor: 'pointer' }}
                    >
                        <FiDownload /> Exportar
                    </button>
                </div>
            </div>

            {/* Fila de Tarjetas Informativas / Indicadores KPI */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '25px' }}>
                
                {/* Tarjeta 1: Total Cuentas (CON EL ICONO DE FONT AWESOME SEGURO) */}
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FaBalanceScale size={20} />
                    </div>
                    <div>
                        <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Total de Cuentas</p>
                        <h3 style={{ margin: '4px 0 0', fontSize: '20px', fontWeight: '800', color: '#1e293b' }}>23</h3>
                        <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>Cuentas en el plan</p>
                    </div>
                </div>

                {/* Tarjeta 2: Total Deudor */}
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BiArrowToBottom size={22} />
                    </div>
                    <div>
                        <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Total Deudor</p>
                        <h3 style={{ margin: '4px 0 0', fontSize: '20px', fontWeight: '800', color: '#1e293b' }}>$7,890.00</h3>
                        <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>Saldo total deudor</p>
                    </div>
                </div>

                {/* Tarjeta 3: Total Acreedor */}
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BiArrowToTop size={22} />
                    </div>
                    <div>
                        <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Total Acreedor</p>
                        <h3 style={{ margin: '4px 0 0', fontSize: '20px', fontWeight: '800', color: '#1e293b' }}>$7,890.00</h3>
                        <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>Saldo total acreedor</p>
                    </div>
                </div>

                {/* Tarjeta 4: Estado del Balance */}
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BiCheckCircle size={22} />
                    </div>
                    <div>
                        <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Resultado</p>
                        <h3 style={{ margin: '4px 0 0', fontSize: '20px', fontWeight: '800', color: '#16a34a' }}>Igualado</h3>
                        <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>Deudor = Acreedor</p>
                    </div>
                </div>

            </div>

            {/* Barra de Filtros y Búsqueda */}
            <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569' }}>Fecha Inicial</label>
                    <input type="date" value={fechaInicial} onChange={(e) => setFechaInicial(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', color: '#334155' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569' }}>Fecha Final</label>
                    <input type="date" value={fechaFinal} onChange={(e) => setFechaFinal(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', color: '#334155' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569' }}>Filtro de Cuentas</label>
                    <select value={filtroCuenta} onChange={(e) => setFiltroCuenta(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', color: '#334155', minWidth: '160px' }}>
                        <option>Todas las Cuentas</option>
                        <option>Activo</option>
                        <option>Pasivo</option>
                        <option>Patrimonio</option>
                        <option>Ingresos</option>
                        <option>Gastos</option>
                    </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '200px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569' }}>Buscar Cuenta</label>
                    <div style={{ position: 'relative' }}>
                        <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input 
                            type="text" 
                            placeholder="Buscar cuenta por código o nombre..." 
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            style={{ padding: '8px 12px 8px 35px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', color: '#334155', width: '100%' }} 
                        />
                    </div>
                </div>
            </div>

            {/* Contenedor Principal de Datos (Tabla + Lateral de Resumen) */}
            <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '25px', alignItems: 'start' }}>
                
                {/* Estructura de la Tabla Contable */}
                <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <th rowSpan="2" style={{ padding: '12px 16px', fontWeight: '700', color: '#475569' }}>Código</th>
                                <th rowSpan="2" style={{ padding: '12px 16px', fontWeight: '700', color: '#475569' }}>Nombre de la Cuenta</th>
                                <th colSpan="2" style={{ padding: '8px 16px', fontWeight: '700', color: '#475569', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>Saldo Inicial</th>
                                <th colSpan="2" style={{ padding: '8px 16px', fontWeight: '700', color: '#475569', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>Movimientos del Período</th>
                                <th colSpan="2" style={{ padding: '8px 16px', fontWeight: '700', color: '#475569', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>Saldos Finales</th>
                            </tr>
                            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <th style={{ padding: '8px 12px', fontWeight: '600', color: '#64748b', textAlign: 'right' }}>Deudor</th>
                                <th style={{ padding: '8px 12px', fontWeight: '600', color: '#64748b', textAlign: 'right' }}>Acreedor</th>
                                <th style={{ padding: '8px 12px', fontWeight: '600', color: '#64748b', textAlign: 'right' }}>Debe</th>
                                <th style={{ padding: '8px 12px', fontWeight: '600', color: '#64748b', textAlign: 'right' }}>Haber</th>
                                <th style={{ padding: '8px 12px', fontWeight: '600', color: '#64748b', textAlign: 'right' }}>Deudor</th>
                                <th style={{ padding: '8px 12px', fontWeight: '600', color: '#64748b', textAlign: 'right' }}>Acreedor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Fila de ejemplo: Caja */}
                            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '12px 16px', color: '#64748b', fontWeight: '500' }}>1.1.01</td>
                                <td style={{ padding: '12px 16px', color: '#1e293b', fontWeight: '600' }}>Caja</td>
                                <td style={{ padding: '12px 12px', textAlign: 'right', color: '#94a3b8' }}>$0.00</td>
                                <td style={{ padding: '12px 12px', textAlign: 'right', color: '#94a3b8' }}>$0.00</td>
                                <td style={{ padding: '12px 12px', textAlign: 'right', color: '#334155' }}>$2,280.00</td>
                                <td style={{ padding: '12px 12px', textAlign: 'right', color: '#334155' }}>$2,120.00</td>
                                <td style={{ padding: '12px 12px', textAlign: 'right', color: '#16a34a', fontWeight: '600' }}>$160.00</td>
                                <td style={{ padding: '12px 12px', textAlign: 'right', color: '#94a3b8' }}>$0.00</td>
                            </tr>
                            {/* Fila de ejemplo: Inventario de Botellones */}
                            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '12px 16px', color: '#64748b', fontWeight: '500' }}>1.2.01</td>
                                <td style={{ padding: '12px 16px', color: '#1e293b', fontWeight: '600' }}>Inventario de Botellones</td>
                                <td style={{ padding: '12px 12px', textAlign: 'right', color: '#334155' }}>$1,250.00</td>
                                <td style={{ padding: '12px 12px', textAlign: 'right', color: '#94a3b8' }}>$0.00</td>
                                <td style={{ padding: '12px 12px', textAlign: 'right', color: '#334155' }}>$2,000.00</td>
                                <td style={{ padding: '12px 12px', textAlign: 'right', color: '#334155' }}>$1,800.00</td>
                                <td style={{ padding: '12px 12px', textAlign: 'right', color: '#16a34a', fontWeight: '600' }}>$1,450.00</td>
                                <td style={{ padding: '12px 12px', textAlign: 'right', color: '#94a3b8' }}>$0.00</td>
                            </tr>
                            {/* Fila de Totales */}
                            <tr style={{ backgroundColor: '#f8fafc', fontWeight: '700', borderTop: '2px solid #e2e8f0' }}>
                                <td colSpan="2" style={{ padding: '14px 16px', color: '#0f172a', textTransform: 'uppercase' }}>Totales</td>
                                <td style={{ padding: '14px 12px', textAlign: 'right', color: '#2563eb' }}>$1,250.00</td>
                                <td style={{ padding: '14px 12px', textAlign: 'right', color: '#2563eb' }}>$4,150.00</td>
                                <td style={{ padding: '14px 12px', textAlign: 'right', color: '#2563eb' }}>$7,340.00</td>
                                <td style={{ padding: '14px 12px', textAlign: 'right', color: '#2563eb' }}>$7,450.00</td>
                                <td style={{ padding: '14px 12px', textAlign: 'right', color: '#16a34a' }}>$2,070.00</td>
                                <td style={{ padding: '14px 12px', textAlign: 'right', color: '#dc2626' }}>$8,080.00</td>
                            </tr>
                        </tbody>
                    </table>
                    <div style={{ padding: '12px 16px', fontSize: '12px', color: '#64748b', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                        Mostrando 1 a 2 de 23 cuentas
                    </div>
                </div>

                {/* Panel Lateral de Resumen y Acciones Rápidas */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* Caja de Cuadrícula Contable */}
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <h4 style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>Resumen del Balance</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b' }}>Total Saldo Deudor</span>
                                <span style={{ fontWeight: '600', color: '#16a34a' }}>$7,890.00</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b' }}>Total Saldo Acreedor</span>
                                <span style={{ fontWeight: '600', color: '#dc2626' }}>$7,890.00</span>
                            </div>
                            <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '5px 0' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700' }}>
                                <span style={{ color: '#1e293b' }}>Diferencia</span>
                                <span style={{ color: '#2563eb' }}>$0.00</span>
                            </div>
                        </div>
                        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#15803d', fontWeight: '500' }}>
                            <BiCheckCircle size={16} /> El Balance está Igualado correctamente
                        </div>
                    </div>

                    {/* Caja de Acciones Directas */}
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <h4 style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>Acciones Rápidas</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button onClick={handleActualizarBalance} style={{ width: '100%', padding: '10px', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', color: '#334155', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FiRefreshCw /> Recalcular Saldos
                            </button>
                            <button onClick={() => handleExportar('PDF')} style={{ width: '100%', padding: '10px', backgroundColor: '#fdf2f2', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', color: '#dc2626', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FiFileText /> Exportar a PDF Financiero
                            </button>
                        </div>
                    </div>

                </div>

            </div>

            {/* Pie de Página Operativo */}
            <p style={{ textAlign: 'center', fontSize: '12px', color: '#94a3b8', marginTop: '40px', margin: 0 }}>
                © 2025 H2OManager · Sistema Administrativo Contable
            </p>

            {/* Inyección de estilos CSS para la animación del botón de carga */}
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .spin-animation {
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </div>
    );
}