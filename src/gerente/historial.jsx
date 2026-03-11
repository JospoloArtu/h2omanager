import { useState, useEffect } from 'react';
import {
    FiSearch,
    FiRefreshCw,
    FiShoppingCart,
    FiDollarSign,
    FiTruck,
    FiMapPin,
    FiClock,
    FiX,
    FiChevronLeft,
    FiChevronRight,
    FiSmartphone,
    FiCreditCard,
    FiPlus,
    FiHash,
    FiUser,
    FiCalendar
} from 'react-icons/fi';
import * as ventaService from './services/ventas.service';
import * as configService from './services/config.service';
import '../assets/css/historial.css';

const PAYMENT_LABELS = {
    efectivo_usd: 'Efectivo USD',
    efectivo_ves: 'Efectivo Bs',
    pago_movil: 'Pago Móvil',
    transferencia: 'Transferencia',
    punto: 'Punto de Venta',
    mixto: 'Pago Mixto',
};

const PAYMENT_ICONS = {
    efectivo_usd: FiDollarSign,
    efectivo_ves: FiDollarSign,
    pago_movil: FiSmartphone,
    transferencia: FiCreditCard,
    punto: FiCreditCard,
    mixto: FiPlus,
};

export default function Historial() {
    const [sales, setSales] = useState([]);
    const [config, setConfig] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [payFilter, setPayFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all'); // all, today, week, month

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    // Detail modal
    const [selectedSale, setSelectedSale] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [salesData, configData] = await Promise.all([
                ventaService.getSales(),
                configService.getCurrencyConfig(),
            ]);
            setSales(salesData || []);
            setConfig(configData);
        } catch (err) {
            console.error('Error loading historial:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // ─── Date helpers ─────────────
    const isToday = (dateStr) => {
        const d = new Date(dateStr);
        const now = new Date();
        return d.toDateString() === now.toDateString();
    };

    const isThisWeek = (dateStr) => {
        const d = new Date(dateStr);
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        return d >= startOfWeek;
    };

    const isThisMonth = (dateStr) => {
        const d = new Date(dateStr);
        const now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const formatTime = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    // ─── Filter logic ──────────────
    const filteredSales = sales.filter(s => {
        // Search
        const q = searchTerm.toLowerCase();
        const matchSearch = !q
            || s.id?.toLowerCase().includes(q)
            || s.client?.name?.toLowerCase().includes(q)
            || s.client?.cedula?.includes(q);

        // Payment method
        const matchPay = payFilter === 'all' || s.paymentMethod === payFilter;

        // Type
        const matchType = typeFilter === 'all' || s.type === typeFilter;

        // Date
        let matchDate = true;
        if (dateFilter === 'today') matchDate = isToday(s.date);
        else if (dateFilter === 'week') matchDate = isThisWeek(s.date);
        else if (dateFilter === 'month') matchDate = isThisMonth(s.date);

        return matchSearch && matchPay && matchType && matchDate;
    });

    // ─── Stats ──────────────────────
    const totalSalesCount = filteredSales.length;
    const totalUSD = filteredSales.reduce((acc, s) => acc + (s.totalUSD || 0), 0);
    const totalVES = filteredSales.reduce((acc, s) => acc + (s.totalVES || 0), 0);
    const deliveryCount = filteredSales.filter(s => s.type === 'delivery').length;

    // ─── Pagination ─────────────────
    const totalPages = Math.ceil(filteredSales.length / rowsPerPage);
    const paginated = filteredSales.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    // Reset page when filters change
    useEffect(() => { setCurrentPage(1); }, [searchTerm, payFilter, typeFilter, dateFilter]);

    // ─── Render ─────────────────────
    return (
        <div className="historial-container">
            {/* HEADER */}
            <div className="historial-header">
                <div className="title-section">
                    <h1>Historial de Ventas</h1>
                    <p>Consulta y detalle de todas las ventas procesadas</p>
                </div>
                <button className="btn-refresh" onClick={loadData} disabled={isLoading}>
                    <FiRefreshCw className={isLoading ? 'spin' : ''} /> Actualizar
                </button>
            </div>

            {/* STATS */}
            <div className="historial-stats">
                <div className="hist-stat">
                    <div className="hist-stat-icon blue"><FiShoppingCart /></div>
                    <div className="hist-stat-info">
                        <p className="stat-value">{totalSalesCount}</p>
                        <p className="stat-label">Ventas</p>
                    </div>
                </div>
                <div className="hist-stat">
                    <div className="hist-stat-icon green"><FiDollarSign /></div>
                    <div className="hist-stat-info">
                        <p className="stat-value">${totalUSD.toFixed(2)}</p>
                        <p className="stat-label">Total USD</p>
                    </div>
                </div>
                <div className="hist-stat">
                    <div className="hist-stat-icon purple"><FiDollarSign /></div>
                    <div className="hist-stat-info">
                        <p className="stat-value">Bs. {totalVES.toFixed(2)}</p>
                        <p className="stat-label">Total Bs</p>
                    </div>
                </div>
                <div className="hist-stat">
                    <div className="hist-stat-icon amber"><FiTruck /></div>
                    <div className="hist-stat-info">
                        <p className="stat-value">{deliveryCount}</p>
                        <p className="stat-label">Delivery</p>
                    </div>
                </div>
            </div>

            {/* CONTROLS */}
            <div className="historial-controls">
                <div className="search-box">
                    <FiSearch className="search-icon" />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Buscar por ID, cliente o cédula..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select className="filter-select" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
                    <option value="all">Todas las fechas</option>
                    <option value="today">Hoy</option>
                    <option value="week">Esta semana</option>
                    <option value="month">Este mes</option>
                </select>
                <select className="filter-select" value={payFilter} onChange={(e) => setPayFilter(e.target.value)}>
                    <option value="all">Todos los pagos</option>
                    <option value="efectivo_usd">Efectivo USD</option>
                    <option value="efectivo_ves">Efectivo Bs</option>
                    <option value="pago_movil">Pago Móvil</option>
                    <option value="transferencia">Transferencia</option>
                    <option value="punto">Punto de Venta</option>
                    <option value="mixto">Pago Mixto</option>
                </select>
                <select className="filter-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                    <option value="all">Todos los tipos</option>
                    <option value="local">Local</option>
                    <option value="delivery">Delivery</option>
                </select>
            </div>

            {/* TABLE */}
            <div className="historial-table-wrap">
                {filteredSales.length === 0 ? (
                    <div className="hist-empty">
                        <div className="hist-empty-icon"><FiClock /></div>
                        <h3>{isLoading ? 'Cargando...' : 'Sin ventas registradas'}</h3>
                        <p>{isLoading ? 'Obteniendo datos del historial' : 'Procesa tu primera venta para verla aquí'}</p>
                    </div>
                ) : (
                    <>
                        <table className="historial-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Fecha</th>
                                    <th>Cliente</th>
                                    <th>Tipo</th>
                                    <th>Método</th>
                                    <th style={{ textAlign: 'right' }}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.map(sale => {
                                    const PayIcon = PAYMENT_ICONS[sale.paymentMethod] || FiDollarSign;
                                    return (
                                        <tr key={sale.id} onClick={() => setSelectedSale(sale)}>
                                            <td><span className="sale-id-chip">{sale.id}</span></td>
                                            <td>
                                                <div className="sale-date">
                                                    <span className="day">{formatDate(sale.date)}</span>
                                                    <span className="time">{formatTime(sale.date)}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <div style={{
                                                        width: '32px', height: '32px', borderRadius: '8px',
                                                        background: 'var(--accent)', color: '#fff',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontWeight: 700, fontSize: '12px', flexShrink: 0,
                                                    }}>
                                                        {sale.client?.name?.charAt(0)?.toUpperCase() || '?'}
                                                    </div>
                                                    <div>
                                                        <p style={{ margin: 0, fontWeight: 600, fontSize: '13px' }}>
                                                            {sale.client?.name || 'Cliente'}
                                                        </p>
                                                        <p style={{ margin: 0, fontSize: '11px', color: 'var(--muted)' }}>
                                                            {sale.client?.cedula || '—'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`type-badge ${sale.type}`}>
                                                    {sale.type === 'delivery' ? <><FiTruck /> Delivery</> : <><FiMapPin /> Local</>}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`pay-badge ${sale.paymentMethod}`}>
                                                    <PayIcon size={13} />
                                                    {PAYMENT_LABELS[sale.paymentMethod] || sale.paymentMethod}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="sale-amount">
                                                    <span className="usd">${(sale.totalUSD || 0).toFixed(2)}</span>
                                                    <span className="bs">Bs. {(sale.totalVES || 0).toFixed(2)}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {/* PAGINATION */}
                        <div className="historial-pagination">
                            <span className="page-info">
                                {(currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, filteredSales.length)} de {filteredSales.length}
                            </span>
                            <div className="page-btns">
                                <button disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)}>
                                    <FiChevronLeft />
                                </button>
                                <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                                    <FiChevronRight />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* ─── DETAIL MODAL ──────────────────────── */}
            {selectedSale && (
                <div className="hist-modal-overlay" onClick={() => setSelectedSale(null)}>
                    <div className="hist-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="hist-modal-header">
                            <h2>Detalle de Venta</h2>
                            <button className="btn-close" onClick={() => setSelectedSale(null)}>
                                <FiX />
                            </button>
                        </div>
                        <div className="hist-modal-body">
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <span className="detail-label"><FiHash style={{ verticalAlign: 'middle' }} /> ID Venta</span>
                                    <span className="detail-value">{selectedSale.id}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label"><FiCalendar style={{ verticalAlign: 'middle' }} /> Fecha</span>
                                    <span className="detail-value">{formatDate(selectedSale.date)} — {formatTime(selectedSale.date)}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label"><FiUser style={{ verticalAlign: 'middle' }} /> Cliente</span>
                                    <span className="detail-value">{selectedSale.client?.name || 'Cliente sin nombre'}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Cédula</span>
                                    <span className="detail-value">{selectedSale.client?.cedula || '—'}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label"><FiTruck style={{ verticalAlign: 'middle' }} /> Tipo</span>
                                    <span className="detail-value">
                                        <span className={`type-badge ${selectedSale.type}`}>
                                            {selectedSale.type === 'delivery' ? 'Delivery' : 'Local'}
                                        </span>
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label"><FiCreditCard style={{ verticalAlign: 'middle' }} /> Método de Pago</span>
                                    <span className="detail-value">
                                        <span className={`pay-badge ${selectedSale.paymentMethod}`}>
                                            {PAYMENT_LABELS[selectedSale.paymentMethod] || selectedSale.paymentMethod}
                                        </span>
                                    </span>
                                </div>
                            </div>

                            <h4 style={{ fontSize: '13px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.3px', margin: '0 0 10px' }}>
                                Productos ({selectedSale.items?.length || 0})
                            </h4>
                            <div style={{ borderRadius: '10px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                                <table className="detail-items-table">
                                    <thead>
                                        <tr>
                                            <th>Cant.</th>
                                            <th>Descripción</th>
                                            <th className="text-right">Precio</th>
                                            <th className="text-right">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(selectedSale.items || []).map((item, idx) => (
                                            <tr key={idx}>
                                                <td style={{ fontWeight: 700 }}>{item.qty}</td>
                                                <td>{item.title}</td>
                                                <td className="text-right">${(item.price || 0).toFixed(2)}</td>
                                                <td className="text-right" style={{ fontWeight: 600 }}>
                                                    ${((item.price || 0) * (item.qty || 0)).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="detail-totals">
                                <div className="total-row">
                                    <span>Subtotal USD</span>
                                    <span>${(selectedSale.totalUSD || 0).toFixed(2)}</span>
                                </div>
                                <div className="total-row">
                                    <span>Tasa de cambio</span>
                                    <span>× Bs. {config?.exchangeRate || '—'}</span>
                                </div>
                                <div className="total-row">
                                    <span>Total Bs</span>
                                    <span>Bs. {(selectedSale.totalVES || 0).toFixed(2)}</span>
                                </div>
                                <div className="total-row grand">
                                    <span>Total USD</span>
                                    <span>${(selectedSale.totalUSD || 0).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
