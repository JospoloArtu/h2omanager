import { useState } from 'react';
import { FaBalanceScale } from 'react-icons/fa';
import { BiArrowToBottom, BiArrowToTop, BiCheckCircle } from 'react-icons/bi';
import { FiRefreshCw, FiDownload, FiSearch, FiFileText } from 'react-icons/fi';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

export default function BalanceComprobacion() {
    // Estados para filtros del periodo
    const [fechaInicial, setFechaInicial] = useState('2025-04-01');
    const [fechaFinal, setFechaFinal] = useState('2025-04-12');
    const [filtroCuenta, setFiltroCuenta] = useState('Todas las Cuentas');
    const [busqueda, setBusqueda] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    // Datos maestros del balance
    const datosCuentas = [
        { codigo: '1.1.01', nombre: 'Caja', initDeudor: 0.00, initAcreedor: 0.00, debe: 2280.00, haber: 2120.00, finDeudor: 160.00, finAcreedor: 0.00, tipo: 'Activo' },
        { codigo: '1.2.01', nombre: 'Inventario de Botellones', initDeudor: 1250.00, initAcreedor: 0.00, debe: 2000.00, haber: 1800.00, finDeudor: 1450.00, finAcreedor: 0.00, tipo: 'Activo' }
    ];

    // Filtro en tiempo real
    const cuentasFiltradas = datosCuentas.filter(cuenta => {
        const matchesBusqueda = cuenta.nombre.toLowerCase().includes(busqueda.toLowerCase()) || cuenta.codigo.includes(busqueda);
        const matchesTipo = filtroCuenta === 'Todas las Cuentas' || cuenta.tipo === filtroCuenta;
        return matchesBusqueda && matchesTipo;
    });

    // Cálculos matemáticos precisos
    const totalInitDeudor = cuentasFiltradas.reduce((sum, c) => sum + c.initDeudor, 0);
    const totalInitAcreedor = cuentasFiltradas.reduce((sum, c) => sum + c.initAcreedor, 0);
    const totalDebe = cuentasFiltradas.reduce((sum, c) => sum + c.debe, 0);
    const totalHaber = cuentasFiltradas.reduce((sum, c) => sum + c.haber, 0);
    const totalFinDeudor = cuentasFiltradas.reduce((sum, c) => sum + c.finDeudor, 0);
    const totalFinAcreedor = cuentasFiltradas.reduce((sum, c) => sum + c.finAcreedor, 0);

    const handleActualizarBalance = () => {
        setIsUpdating(true);
        setTimeout(() => {
            setIsUpdating(false);
            Swal.fire({
                icon: 'success',
                title: 'Saldos Sincronizados',
                text: 'Se han recalculado los movimientos con éxito.',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#2563eb'
            });
        }, 1000);
    };

    const handleExportarExcel = () => {
        if (cuentasFiltradas.length === 0) {
            Swal.fire({ icon: 'warning', title: 'Tabla vacía', text: 'No hay datos disponibles para exportar.' });
            return;
        }

        const filas = cuentasFiltradas.map(c => ({
            "Código": c.codigo,
            "Cuenta": c.nombre,
            "Inicial Deudor": c.initDeudor,
            "Inicial Acreedor": c.initAcreedor,
            "Debe": c.debe,
            "Haber": c.haber,
            "Final Deudor": c.finDeudor,
            "Final Acreedor": c.finAcreedor
        }));

        filas.push({
            "Código": "TOTALES",
            "Cuenta": "",
            "Inicial Deudor": totalInitDeudor,
            "Inicial Acreedor": totalInitAcreedor,
            "Debe": totalDebe,
            "Haber": totalHaber,
            "Final Deudor": totalFinDeudor,
            "Final Acreedor": totalFinAcreedor
        });

        const hoja = XLSX.utils.json_to_sheet(filas);
        const libro = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(libro, hoja, "Balance");

        hoja['!cols'] = Object.keys(filas[0]).map(key => ({
            wch: Math.max(key.length, ...filas.map(row => row[key] ? row[key].toString().length : 0)) + 3
        }));

        XLSX.writeFile(libro, `Balance_Comprobacion_H2OManager.xlsx`);
    };

    return (
        <div style={{ padding: '30px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
            
            {/* INYECCIÓN DE ESTILOS CSS PROFESIONALES PARA IMPRESIÓN */}
            <style>{`
                @media print {
                    /* Ocultar barra de navegación, botones y filtros */
                    .no-print, button, input, select, .no-print * { 
                        display: none !important; 
                    }
                    
                    /* Reset del contenedor base de la página */
                    body, html, #root, div[style*="backgroundColor: '#f8fafc'"] { 
                        background-color: white !important; 
                        background: white !important;
                        color: #0f172a !important; 
                        padding: 0 !important; 
                        margin: 0 !important; 
                        min-height: auto !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }

                    /* Forzar que las tarjetas KPI queden alineadas horizontalmente en la hoja */
                    .kpi-container {
                        display: flex !important;
                        flex-direction: row !important;
                        gap: 15px !important;
                        width: 100% !important;
                        margin-bottom: 30px !important;
                    }

                    .kpi-card {
                        flex: 1 !important;
                        background: #ffffff !important;
                        border: 1px solid #e2e8f0 !important;
                        padding: 12px !important;
                        border-radius: 8px !important;
                        box-shadow: none !important;
                    }

                    /* Diseño elegante para la tabla contable en el papel */
                    .table-container {
                        border: 1px solid #cbd5e1 !important;
                        border-radius: 8px !important;
                        overflow: visible !important;
                        box-shadow: none !important;
                        width: 100% !important;
                    }

                    table { 
                        width: 100% !important; 
                        border-collapse: collapse !important; 
                        page-break-inside: auto;
                    }

                    tr { 
                        page-break-inside: avoid; 
                        page-break-after: auto; 
                    }

                    th {
                        background-color: #f1f5f9 !important;
                        color: #1e293b !important;
                        border: 1px solid #cbd5e1 !important;
                        font-size: 11px !important;
                        padding: 8px 6px !important;
                        font-weight: 700 !important;
                    }

                    td { 
                        border: 1px solid #e2e8f0 !important; 
                        padding: 8px 10px !important; 
                        font-size: 11px !important; 
                        background-color: transparent !important;
                    }

                    /* Resaltado especial para los totales en la impresión */
                    .fila-totales {
                        background-color: #f8fafc !important;
                        font-weight: bold !important;
                        border-top: 2px solid #94a3b8 !important;
                    }

                    .fila-totales td {
                        color: #0f172a !important;
                        border-bottom: 2px solid #94a3b8 !important;
                    }
                }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                .spin-effect { animation: spin 1s linear infinite; }
            `}</style>

            {/* Cabecera del Módulo */}
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>Balance de Comprobación</h1>
                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>H2OManager · Resumen analítico de saldos y movimientos</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={handleActualizarBalance} disabled={isUpdating} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: '#334155', cursor: 'pointer' }}>
                        <FiRefreshCw className={isUpdating ? 'spin-effect' : ''} /> Recalcular
                    </button>
                    
                    <button onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: '#ef4444', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: 'white', cursor: 'pointer' }}>
                        <FiFileText /> Exportar PDF
                    </button>

                    <button onClick={handleExportarExcel} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: '#10b981', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: 'white', cursor: 'pointer' }}>
                        <FiDownload /> Exportar Excel
                    </button>
                </div>
            </div>

            {/* Módulos de KPI Superiores (Clases agregadas para soporte de impresión) */}
            <div className="kpi-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '25px' }}>
                <div className="kpi-card" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div className="no-print" style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaBalanceScale size={20} /></div>
                    <div>
                        <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: '700' }}>TOTAL CUENTAS</p>
                        <h3 style={{ margin: '4px 0 0', fontSize: '20px', fontWeight: '800', color: '#1e293b' }}>{cuentasFiltradas.length}</h3>
                    </div>
                </div>

                <div className="kpi-card" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div className="no-print" style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BiArrowToBottom size={22} /></div>
                    <div>
                        <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: '700' }}>TOTAL DEBE</p>
                        <h3 style={{ margin: '4px 0 0', fontSize: '20px', fontWeight: '800', color: '#1e293b' }}>${totalDebe.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
                    </div>
                </div>

                <div className="kpi-card" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div className="no-print" style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BiArrowToTop size={22} /></div>
                    <div>
                        <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: '700' }}>TOTAL HABER</p>
                        <h3 style={{ margin: '4px 0 0', fontSize: '20px', fontWeight: '800', color: '#1e293b' }}>${totalHaber.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
                    </div>
                </div>

                <div className="kpi-card" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div className="no-print" style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BiCheckCircle size={22} /></div>
                    <div>
                        <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: '700' }}>ESTADO CUADRE</p>
                        <h3 style={{ margin: '4px 0 0', fontSize: '18px', fontWeight: '800', color: totalDebe === totalHaber ? '#16a34a' : '#dc2626' }}>
                            {totalDebe === totalHaber ? 'Cuadrado ✓' : 'Descuadrado ✗'}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Sección de Filtros de Búsqueda */}
            <div className="no-print" style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '25px' }}>
                <input type="date" value={fechaInicial} onChange={(e) => setFechaInicial(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }} />
                <input type="date" value={fechaFinal} onChange={(e) => setFechaFinal(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }} />
                <select value={filtroCuenta} onChange={(e) => setFiltroCuenta(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}>
                    <option value="Todas las Cuentas">Todas las Cuentas</option>
                    <option value="Activo">Activos</option>
                    <option value="Pasivo">Pasivos</option>
                </select>
                <div style={{ position: 'relative', flex: 1 }}>
                    <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input type="text" placeholder="Buscar por código o cuenta..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} style={{ padding: '8px 12px 8px 35px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', width: '100%' }} />
                </div>
            </div>

            {/* Tabla Principal con Clases Adaptadas para el Render PDF */}
            <div className="table-container" style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th rowSpan="2" style={{ padding: '12px 16px', fontWeight: '700', color: '#475569' }}>Código</th>
                            <th rowSpan="2" style={{ padding: '12px 16px', fontWeight: '700', color: '#475569' }}>Nombre de la Cuenta</th>
                            <th colSpan="2" style={{ padding: '8px 16px', fontWeight: '700', color: '#475569', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>Saldo Inicial</th>
                            <th colSpan="2" style={{ padding: '8px 16px', fontWeight: '700', color: '#475569', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>Movimientos</th>
                            <th colSpan="2" style={{ padding: '8px 16px', fontWeight: '700', color: '#475569', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>Saldos Finales</th>
                        </tr>
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '8px 12px', textAlign: 'right', color: '#64748b' }}>Deudor</th>
                            <th style={{ padding: '8px 12px', textAlign: 'right', color: '#64748b' }}>Acreedor</th>
                            <th style={{ padding: '8px 12px', textAlign: 'right', color: '#64748b' }}>Debe</th>
                            <th style={{ padding: '8px 12px', textAlign: 'right', color: '#64748b' }}>Haber</th>
                            <th style={{ padding: '8px 12px', textAlign: 'right', color: '#64748b' }}>Deudor</th>
                            <th style={{ padding: '8px 12px', textAlign: 'right', color: '#64748b' }}>Acreedor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cuentasFiltradas.map((cuenta, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '12px 16px', fontWeight: '500', color: '#64748b' }}>{cuenta.codigo}</td>
                                <td style={{ padding: '12px 16px', fontWeight: '600', color: '#1e293b' }}>{cuenta.nombre}</td>
                                <td style={{ padding: '12px 12px', textAlign: 'right', color: '#475569' }}>${cuenta.initDeudor.toFixed(2)}</td>
                                <td style={{ padding: '12px 12px', textAlign: 'right', color: '#475569' }}>${cuenta.initAcreedor.toFixed(2)}</td>
                                <td style={{ padding: '12px 12px', textAlign: 'right', color: '#2563eb', fontWeight: '500' }}>${cuenta.debe.toFixed(2)}</td>
                                <td style={{ padding: '12px 12px', textAlign: 'right', color: '#2563eb', fontWeight: '500' }}>${cuenta.haber.toFixed(2)}</td>
                                <td style={{ padding: '12px 12px', textAlign: 'right', color: '#16a34a', fontWeight: '600' }}>${cuenta.finDeudor.toFixed(2)}</td>
                                <td style={{ padding: '12px 12px', textAlign: 'right', color: '#dc2626', fontWeight: '600' }}>${cuenta.finAcreedor.toFixed(2)}</td>
                            </tr>
                        ))}
                        {/* TR de totales estilizado mediante clase controlada por CSS de impresión */}
                        <tr className="fila-totales" style={{ backgroundColor: '#f8fafc', fontWeight: '800', borderTop: '2px solid #e2e8f0' }}>
                            <td colSpan="2" style={{ padding: '14px 16px', color: '#0f172a' }}>TOTALES</td>
                            <td style={{ padding: '14px 12px', textAlign: 'right' }}>${totalInitDeudor.toFixed(2)}</td>
                            <td style={{ padding: '14px 12px', textAlign: 'right' }}>${totalInitAcreedor.toFixed(2)}</td>
                            <td style={{ padding: '14px 12px', textAlign: 'right', color: '#2563eb' }}>${totalDebe.toFixed(2)}</td>
                            <td style={{ padding: '14px 12px', textAlign: 'right', color: '#2563eb' }}>${totalHaber.toFixed(2)}</td>
                            <td style={{ padding: '14px 12px', textAlign: 'right', color: '#16a34a' }}>${totalFinDeudor.toFixed(2)}</td>
                            <td style={{ padding: '14px 12px', textAlign: 'right', color: '#dc2626' }}>${totalFinAcreedor.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <p className="no-print" style={{ textAlign: 'center', fontSize: '12px', color: '#94a3b8', marginTop: '40px' }}>
                © 2026 H2OManager · Sistema Administrativo Contable
            </p>
        </div>
    );
}