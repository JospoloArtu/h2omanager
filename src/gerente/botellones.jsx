import { useState, useEffect } from 'react';
import { 
    FiPackage, 
    FiPlus, 
    FiMinus, 
    FiClock, 
    FiSearch, 
    FiChevronLeft, 
    FiChevronRight,
    FiAlertTriangle,
    FiRefreshCw,
    FiArrowDownLeft,
    FiArrowUpRight
} from 'react-icons/fi';
import Swal from 'sweetalert2';
import * as botellonService from './services/botellones.service';
import '../assets/css/botellones.css';
import '../assets/css/configuracion.css';

export default function Botellones() {
    const [inventory, setInventory] = useState([]);
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Pagination for history
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [invData, histData] = await Promise.all([
                botellonService.getInventory(),
                botellonService.getHistory()
            ]);
            setInventory(invData);
            setHistory(histData);
        } catch (error) {
            Swal.fire('Error', 'No se pudo cargar el inventario', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleMovement = async (item, type) => {
        const { value: amount } = await Swal.fire({
            title: type === 'in' ? 'Registrar Entrada' : 'Registrar Salida',
            text: `Botellón de ${item.size}L`,
            input: 'number',
            inputAttributes: { min: '1', step: '1' },
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: type === 'in' ? '#22c55e' : '#ef4444',
            inputValidator: (value) => {
                if (!value || parseInt(value) <= 0) {
                    return 'Debes ingresar una cantidad válida';
                }
                if (type === 'out' && parseInt(value) > item.stock) {
                    return 'No hay suficiente stock disponible';
                }
            }
        });

        if (amount) {
            const { value: note } = await Swal.fire({
                title: 'Nota / Motivo (Opcional)',
                input: 'text',
                placeholder: 'Ej: Reposición de inventario...',
                showCancelButton: true,
                confirmButtonText: 'Guardar',
                cancelButtonText: 'Omitir',
                confirmButtonColor: 'var(--accent)',
            });

            setIsLoading(true);
            try {
                await botellonService.updateStock(item.id, parseInt(amount), type, note || '');
                await loadData();
                Swal.fire({
                    icon: 'success',
                    title: '¡Actualizado!',
                    text: `Stock de ${item.size}L actualizado con éxito.`,
                    timer: 2000,
                    showConfirmButton: false
                });
            } catch (error) {
                Swal.fire('Error', error.message, 'error');
            } finally {
                setIsLoading(false);
            }
        }
    };

    // Stats
    const totalBottles = inventory.reduce((acc, curr) => acc + curr.stock, 0);
    const lowStockItems = inventory.filter(i => i.stock <= i.minStock).length;

    // Pagination
    const totalPages = Math.ceil(history.length / rowsPerPage);
    const paginatedHistory = history.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    return (
        <div className="botellones-container">
            {isLoading && (
                <div className="loading-overlay">
                    <FiRefreshCw className="loading-spinner spin" />
                    <p className="loading-text">Cargando inventario...</p>
                </div>
            )}

            <div className="clientes-header">
                <div className="title-section">
                    <h1>Mantenimiento de Botellones</h1>
                    <p>Control de stock y movimiento de envases</p>
                </div>
            </div>

            <div className="inventory-stats">
                <div className="inv-stat-card">
                    <div className="inv-stat-icon icon-blue"><FiPackage /></div>
                    <div className="inv-stat-info">
                        <h3>Total Envases</h3>
                        <p>{totalBottles}</p>
                    </div>
                </div>
                <div className="inv-stat-card">
                    <div className="inv-stat-icon icon-green"><FiRefreshCw /></div>
                    <div className="inv-stat-info">
                        <h3>Disponibles</h3>
                        <p>{totalBottles}</p>
                    </div>
                </div>
                <div className="inv-stat-card">
                    <div className="inv-stat-icon icon-orange">
                        {lowStockItems > 0 ? <FiAlertTriangle /> : <FiPackage />}
                    </div>
                    <div className="inv-stat-info">
                        <h3>Stock Bajo</h3>
                        <p>{lowStockItems}</p>
                    </div>
                </div>
            </div>

            <div className="inventory-grid">
                {inventory.map(item => (
                    <div className="inventory-item-card" key={item.id}>
                        <div className="item-header">
                            <div className="item-title">
                                <h2>{item.size} Litros</h2>
                                <p className="td-muted">Envase {item.unit}</p>
                            </div>
                            <span className={`item-badge ${item.stock <= item.minStock ? 'badge-out' : 'badge-in'}`}>
                                {item.stock <= item.minStock ? 'STOCK BAJO' : 'STOCK OK'}
                            </span>
                        </div>
                        
                        <div className="item-stock-display">
                            <span className="stock-value">{item.stock}</span>
                            <span className="stock-label">En Stock</span>
                        </div>

                        <div className="item-actions">
                            <button className="btn-stock in" onClick={() => handleMovement(item, 'in')}>
                                <FiPlus /> Entrada
                            </button>
                            <button className="btn-stock out" onClick={() => handleMovement(item, 'out')}>
                                <FiMinus /> Salida
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <h2 className="history-section-title">
                <FiClock /> Historial de Movimientos
            </h2>

            <div className="clients-table-wrap">
                <table className="clients-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Capacidad</th>
                            <th>Tipo</th>
                            <th>Cantidad</th>
                            <th>Stock Anterior</th>
                            <th>Stock Nuevo</th>
                            <th>Nota</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedHistory.map(move => (
                            <tr key={move.id}>
                                <td className="td-muted">
                                    {new Date(move.date).toLocaleString('es-VE')}
                                </td>
                                <td style={{ fontWeight: 600 }}>{move.itemSize}L</td>
                                <td>
                                    <div className={`history-badge ${move.type === 'in' ? 'badge-in' : 'badge-out'}`}>
                                        {move.type === 'in' ? <FiArrowDownLeft /> : <FiArrowUpRight />}
                                    </div>
                                </td>
                                <td style={{ fontWeight: 700, color: move.type === 'in' ? '#22c55e' : '#ef4444' }}>
                                    {move.type === 'in' ? '+' : '-'}{move.amount}
                                </td>
                                <td className="td-muted">{move.oldStock}</td>
                                <td style={{ fontWeight: 600 }}>{move.newStock}</td>
                                <td className="td-muted" style={{ fontStyle: 'italic', fontSize: '13px' }}>
                                    {move.note || '---'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {history.length === 0 && (
                    <div className="empty-table-state" style={{ padding: '40px' }}>
                        <FiClock style={{ fontSize: '32px', opacity: 0.2 }} />
                        <p>No hay movimientos registrados</p>
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="pagination-controls">
                    <button 
                        className="btn-pagination" 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                    >
                        <FiChevronLeft /> Anterior
                    </button>
                    <div className="page-indicator">
                        Página <strong>{currentPage}</strong> de {totalPages}
                    </div>
                    <button 
                        className="btn-pagination" 
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                        Siguiente <FiChevronRight />
                    </button>
                </div>
            )}
        </div>
    );
}
