import { useState, useEffect, useRef } from 'react';
import { 
    FiTruck, 
    FiMapPin, 
    FiUserPlus, 
    FiUser,
    FiSearch, 
    FiShoppingCart, 
    FiCheck, 
    FiDollarSign, 
    FiCreditCard, 
    FiSmartphone, 
    FiPlus, 
    FiMinus, 
    FiTrash2,
    FiPrinter,
    FiNavigation
} from 'react-icons/fi';
import Swal from 'sweetalert2';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as clientService from './services/clientes.service';
import * as botellonService from './services/botellones.service';
import * as ventaService from './services/ventas.service';
import * as configService from './services/config.service';
import '../assets/css/ventas.css';

// Fix default marker icon for Leaflet + bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icon
const deliveryIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

// Component to handle map click events
function MapClickHandler({ onMapClick }) {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng);
        },
    });
    return null;
}

// Component to fly map to a new center
function FlyToLocation({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, 16, { duration: 1.5 });
        }
    }, [center, map]);
    return null;
}

const STEPS = [
    { id: 1, label: 'Tipo Entrega', icon: FiTruck },
    { id: 2, label: 'Cliente', icon: FiUserPlus },
    { id: 3, label: 'Productos', icon: FiShoppingCart },
    { id: 4, label: 'Pago', icon: FiDollarSign },
    { id: 5, label: 'Confirmación', icon: FiCheck }
];

const BANCOS_VE = [
    'Banco de Venezuela',
    'Banesco',
    'Banco Mercantil',
    'BBVA Provincial',
    'Banco Nacional de Crédito (BNC)',
    'Banco del Tesoro',
    'Banco Bicentenario',
    'Banco Exterior',
    'Banco Caroní',
    'Banco Sofitasa',
    'Banco Plaza',
    'Bancaribe',
    'Banco Activo',
    'Bancamiga',
    'Banco Fondo Común (BFC)',
    'Mi Banco',
    '100% Banco',
    'Banco Agrícola de Venezuela',
];

// Shared input style
const refInputStyle = {
    width: '100%', boxSizing: 'border-box',
    padding: '10px 14px', border: '1px solid #dde3ec',
    borderRadius: '8px', fontSize: '14px', fontWeight: 600,
    outline: 'none', background: '#fff',
};

// Bank/reference fields component — defined OUTSIDE to avoid remount on every render
function BankRefFields({ banco, ref6, onBancoChange, onRefChange }) {
    return (
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>
                    Banco emisor *
                </label>
                <select
                    value={banco}
                    onChange={(e) => onBancoChange(e.target.value)}
                    style={{ ...refInputStyle, fontWeight: 500, color: banco ? '#1e293b' : '#94a3b8' }}
                >
                    <option value="">Seleccionar banco...</option>
                    {BANCOS_VE.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
            </div>
            <div style={{ width: '160px', flexShrink: 0 }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>
                    Referencia (6 dígitos) *
                </label>
                <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={ref6}
                    onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, '').slice(0, 6);
                        onRefChange(v);
                    }}
                    placeholder="000000"
                    style={{
                        ...refInputStyle,
                        letterSpacing: '3px', textAlign: 'center',
                        border: ref6.length > 0 && ref6.length < 6 ? '1px solid #f59e0b' : ref6.length === 6 ? '1px solid #22c55e' : '1px solid #dde3ec',
                    }}
                />
                {ref6.length > 0 && ref6.length < 6 && (
                    <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#f59e0b', textAlign: 'center' }}>
                        {6 - ref6.length} dígitos restantes
                    </p>
                )}
            </div>
        </div>
    );
}

export default function VentasWizard() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Data Sources
    const [clients, setClients] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [config, setConfig] = useState({ exchangeRate: 54.50 });

    // Order State
    const [deliveryType, setDeliveryType] = useState(null); // 'local' | 'delivery'
    const [clientMode, setClientMode] = useState('registered'); // 'registered' | 'unregistered'
    const [selectedClient, setSelectedClient] = useState(null);
    const [newClientCedula, setNewClientCedula] = useState('');
    const [newClientName, setNewClientName] = useState('');
    const [cart, setCart] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [searchClient, setSearchClient] = useState('');

    // Payment details state (bank, reference, amounts for mixed)
    const [paymentDetails, setPaymentDetails] = useState({
        banco: '',
        referencia: '',
        // Mixed payment: amounts per method
        mixedMethods: {
            efectivo_usd: 0,
            efectivo_ves: 0,
            pago_movil: 0,
            transferencia: 0,
            punto: 0,
        },
        // Bank/ref per mixed sub-method
        mixedBanco: { pago_movil: '', transferencia: '' },
        mixedRef: { pago_movil: '', transferencia: '' },
    });

    // Delivery map state
    const [deliveryCoords, setDeliveryCoords] = useState(null);
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [mapCenter, setMapCenter] = useState(null);
    const [isLocating, setIsLocating] = useState(false);

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        setIsLoading(true);
        try {
            const [clientData, invData, confData] = await Promise.all([
                clientService.getClients(),
                botellonService.getInventory(),
                configService.getCurrencyConfig()
            ]);
            setClients(clientData);
            setInventory(invData);
            setConfig(confData || { exchangeRate: 54.50 });
        } catch (error) {
            console.error("Error loading data", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Form Controls
    const nextStep = () => {
        // Handle un-registered client creation dynamically
        if (currentStep === 2 && clientMode === 'unregistered') {
            const tempClient = { 
                id: `TEMP-${Date.now()}`, 
                name: newClientName, 
                cedula: newClientCedula,
                type: 'Residencial',
                isTemp: true
            };
            setSelectedClient(tempClient);
        }
        setCurrentStep(prev => Math.min(prev + 1, 5));
    };
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const isStep1Valid = deliveryType === 'local' || (deliveryType === 'delivery' && deliveryCoords !== null);
    const isStep2Valid = clientMode === 'registered' 
        ? selectedClient !== null 
        : (newClientCedula.trim().length > 0 && newClientName.trim().length > 0);
    const isStep3Valid = cart.length > 0;

    // Validate reference: exactly 6 numeric digits
    const isValidRef = (ref) => /^\d{6}$/.test(ref);

    // Check if a single method needs bank/ref and if valid
    const isSingleMethodValid = () => {
        if (!paymentMethod || paymentMethod === 'mixto') return false;
        if (paymentMethod === 'pago_movil' || paymentMethod === 'transferencia') {
            return paymentDetails.banco.length > 0 && isValidRef(paymentDetails.referencia);
        }
        return true;
    };

    // Check if mixed payment is valid
    const isMixedValid = () => {
        if (paymentMethod !== 'mixto') return false;
        const mm = paymentDetails.mixedMethods;
        const hasSomeAmount = Object.values(mm).some(v => v > 0);
        if (!hasSomeAmount) return false;
        // Validate bank/ref for pago_movil and transferencia if used in mixed
        if (mm.pago_movil > 0) {
            if (!paymentDetails.mixedBanco.pago_movil || !isValidRef(paymentDetails.mixedRef.pago_movil)) return false;
        }
        if (mm.transferencia > 0) {
            if (!paymentDetails.mixedBanco.transferencia || !isValidRef(paymentDetails.mixedRef.transferencia)) return false;
        }
        return true;
    };

    const isStep4Valid = paymentMethod !== null && (
        paymentMethod === 'mixto' ? isMixedValid() : isSingleMethodValid()
    );

    // Reverse geocode to get address from coordinates
    const reverseGeocode = async (lat, lng) => {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
                { headers: { 'Accept-Language': 'es' } }
            );
            const data = await res.json();
            return data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        } catch {
            return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        }
    };

    // Handle map click: place marker + get address
    const handleMapClick = async (latlng) => {
        setDeliveryCoords([latlng.lat, latlng.lng]);
        const addr = await reverseGeocode(latlng.lat, latlng.lng);
        setDeliveryAddress(addr);
    };

    // Request browser geolocation
    const requestLocation = () => {
        setIsLocating(true);
        if (!navigator.geolocation) {
            Swal.fire('Error', 'Tu navegador no soporta geolocalización', 'error');
            setIsLocating(false);
            return;
        }
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const coords = [pos.coords.latitude, pos.coords.longitude];
                setMapCenter(coords);
                setDeliveryCoords(coords);
                const addr = await reverseGeocode(coords[0], coords[1]);
                setDeliveryAddress(addr);
                setIsLocating(false);
            },
            (err) => {
                console.warn('Geolocation error:', err);
                // Default to a generic center if denied
                setMapCenter([10.4806, -66.9036]); // Caracas
                setIsLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    // Request location when delivery is selected
    useEffect(() => {
        if (deliveryType === 'delivery' && !mapCenter) {
            requestLocation();
        }
    }, [deliveryType]);

    // Cart Handlers
    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                // if (existing.qty >= product.stock) return prev; // Removed strict stock check for testing
                return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
            }
            // if (product.stock <= 0) return prev; // Removed strict stock check 
            return [...prev, { ...product, qty: 1, price: product.size * 1.5 }]; // Mock price calculation
        });
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const updateQty = (id, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = item.qty + delta;
                if (newQty <= 0) return item;
                // if (newQty > item.stock) return item; // Removed check
                return { ...item, qty: newQty };
            }
            return item;
        }));
    };

    const cartTotalUSD = cart.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);
    const cartTotalVES = cartTotalUSD * (config?.exchangeRate || 54.50);

    // Calculate remaining for mixed payment
    const calcMixedTotalBs = () => {
        const rate = config?.exchangeRate || 1;
        const mm = paymentDetails.mixedMethods;
        return (mm.efectivo_usd * rate) + mm.efectivo_ves + mm.pago_movil + mm.transferencia + mm.punto;
    };
    const mixedTotalBs = calcMixedTotalBs();
    const totalNeededBs = cartTotalUSD * (config?.exchangeRate || 1);
    const mixedRemaining = totalNeededBs - mixedTotalBs;

    // Removed unused handleCreateNewClient function

    const handleConfirmSale = async () => {
        setIsLoading(true);
        try {
            await ventaService.createSale({
                client: selectedClient,
                type: deliveryType,
                items: cart,
                totalUSD: cartTotalUSD,
                totalVES: cartTotalVES,
                paymentMethod
            });
            Swal.fire({
                icon: 'success',
                title: 'Venta Procesada',
                text: 'La orden se ha registrado correctamente.',
                confirmButtonColor: 'var(--accent)'
            }).then(() => {
                // Reset Wizard
                setDeliveryType(null);
                setClientMode('registered');
                setSelectedClient(null);
                setNewClientName('');
                setNewClientCedula('');
                setCart([]);
                setPaymentMethod(null);
                setPaymentDetails({
                    banco: '', referencia: '',
                    mixedMethods: { efectivo_usd: 0, efectivo_ves: 0, pago_movil: 0, transferencia: 0, punto: 0 },
                    mixedBanco: { pago_movil: '', transferencia: '' },
                    mixedRef: { pago_movil: '', transferencia: '' },
                });
                setDeliveryCoords(null);
                setDeliveryAddress('');
                setMapCenter(null);
                setCurrentStep(1);
            });
        } catch (error) {
            Swal.fire('Error', 'No se pudo procesar la venta', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(searchClient.toLowerCase()) ||
        c.cedula?.includes(searchClient)
    );

    // Render Steps
    const renderStep1 = () => (
        <div className="wizard-panel">
            <div className="panel-header">
                <h2>¿Cómo será la entrega?</h2>
                <p>Selecciona si el cliente retirará en tienda o requiere despacho.</p>
            </div>
            <div className="type-selector">
                <div
                    className={`type-card ${deliveryType === 'local' ? 'selected' : ''}`}
                    onClick={() => setDeliveryType('local')}
                >
                    <FiMapPin className="type-icon" />
                    <h3>Compra Local</h3>
                    <p>El cliente retira en la planta</p>
                </div>
                <div
                    className={`type-card ${deliveryType === 'delivery' ? 'selected' : ''}`}
                    onClick={() => setDeliveryType('delivery')}
                >
                    <FiTruck className="type-icon" />
                    <h3>Servicio Delivery</h3>
                    <p>Despacho a domicilio</p>
                </div>
            </div>

            {/* Mini-mapa para delivery */}
            {deliveryType === 'delivery' && (
                <div style={{
                    marginTop: '20px',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    border: '1px solid #e2e8f0',
                    background: '#fff',
                    animation: 'fadeIn 0.35s ease',
                }}>
                    <div style={{
                        padding: '16px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid #f1f5f9',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '10px',
                                background: '#eff6ff', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', color: '#3b82f6', fontSize: '18px',
                            }}>
                                <FiMapPin />
                            </div>
                            <div>
                                <p style={{ margin: 0, fontWeight: 700, fontSize: '14px', color: '#1e293b' }}>
                                    Dirección de entrega
                                </p>
                                <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
                                    Toca el mapa para fijar la ubicación
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={requestLocation}
                            disabled={isLocating}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '8px 14px', border: '1px solid #e2e8f0',
                                borderRadius: '8px', background: '#fff', cursor: 'pointer',
                                fontSize: '13px', fontWeight: 600, color: '#3b82f6',
                                transition: 'all 0.15s',
                            }}
                        >
                            <FiNavigation style={{
                                animation: isLocating ? 'spin 1s linear infinite' : 'none'
                            }} />
                            {isLocating ? 'Localizando...' : 'Mi ubicación'}
                        </button>
                    </div>

                    {/* Map container */}
                    <div style={{ height: '280px', position: 'relative' }}>
                        {mapCenter ? (
                            <MapContainer
                                center={mapCenter}
                                zoom={15}
                                style={{ height: '100%', width: '100%' }}
                                zoomControl={true}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <MapClickHandler onMapClick={handleMapClick} />
                                <FlyToLocation center={mapCenter} />
                                {deliveryCoords && (
                                    <Marker position={deliveryCoords} icon={deliveryIcon} />
                                )}
                            </MapContainer>
                        ) : (
                            <div style={{
                                height: '100%', display: 'flex', flexDirection: 'column',
                                alignItems: 'center', justifyContent: 'center',
                                background: '#f8fafc', color: '#94a3b8', gap: '12px',
                            }}>
                                <FiNavigation style={{ fontSize: '28px', animation: 'spin 1s linear infinite' }} />
                                <p style={{ margin: 0, fontSize: '14px' }}>Solicitando permiso de ubicación...</p>
                            </div>
                        )}
                    </div>

                    {/* Address display */}
                    {deliveryAddress && (
                        <div style={{
                            padding: '14px 20px',
                            borderTop: '1px solid #f1f5f9',
                            display: 'flex', alignItems: 'flex-start', gap: '10px',
                            background: '#f0fdf4',
                        }}>
                            <FiCheck style={{ color: '#22c55e', fontSize: '18px', marginTop: '2px', flexShrink: 0 }} />
                            <div>
                                <p style={{ margin: 0, fontWeight: 600, fontSize: '13px', color: '#15803d' }}>
                                    Ubicación seleccionada
                                </p>
                                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#4b5563', lineHeight: '1.4' }}>
                                    {deliveryAddress}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="wizard-footer">
                <div />
                <button className="btn-wizard btn-wizard-next" disabled={!isStep1Valid} onClick={nextStep}>
                    Siguiente Paso
                </button>
            </div>
        </div>
    );

    const getInitials = (name = '') => name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
    const AVATAR_COLORS = ['#3b82f6','#10b981','#f59e0b','#8b5cf6','#ef4444','#06b6d4'];
    const getAvatarColor = (name = '') => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

    const renderStep2 = () => (
        <div className="wizard-panel">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', margin: '0 0 24px 0' }}>
                Seleccionar Cliente
            </h2>

            {/* ── Toggle buttons ── */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                <button
                    onClick={() => { setClientMode('registered'); setSelectedClient(null); }}
                    style={{
                        flex: 1,
                        height: '88px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        border: clientMode === 'registered' ? '2px solid #3b82f6' : '1px solid #dde3ec',
                        borderRadius: '10px',
                        background: clientMode === 'registered' ? '#eff6ff' : '#fff',
                        color: clientMode === 'registered' ? '#3b82f6' : '#64748b',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                    }}
                >
                    <FiUser style={{ fontSize: '22px' }} />
                    Cliente Registrado
                </button>

                <button
                    onClick={() => { setClientMode('unregistered'); setSelectedClient(null); }}
                    style={{
                        flex: 1,
                        height: '88px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        border: clientMode === 'unregistered' ? '2px solid #3b82f6' : '1px solid #dde3ec',
                        borderRadius: '10px',
                        background: clientMode === 'unregistered' ? '#eff6ff' : '#fff',
                        color: clientMode === 'unregistered' ? '#3b82f6' : '#64748b',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                    }}
                >
                    <FiPlus style={{ fontSize: '22px' }} />
                    Cliente No Registrado
                </button>
            </div>

            {/* ── Content by mode ── */}
            {clientMode === 'registered' ? (
                <>
                    {/* Search bar */}
                    <div style={{ position: 'relative', marginBottom: '20px' }}>
                        <FiSearch style={{
                            position: 'absolute', left: '14px', top: '50%',
                            transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '17px'
                        }} />
                        <input
                            type="text"
                            value={searchClient}
                            onChange={e => setSearchClient(e.target.value)}
                            placeholder="Buscar cliente por nombre, cédula o teléfono..."
                            style={{
                                width: '100%', boxSizing: 'border-box',
                                padding: '13px 16px 13px 44px',
                                border: '1px solid #dde3ec', borderRadius: '10px',
                                fontSize: '14px', outline: 'none', background: '#fff',
                            }}
                        />
                    </div>

                    {/* Client grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                        gap: '14px',
                        maxHeight: '340px',
                        overflowY: 'auto',
                    }}>
                        {(searchClient.length > 0 ? filteredClients : clients).map(c => (
                            <div
                                key={c.id}
                                onClick={() => setSelectedClient(c)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '14px',
                                    padding: '14px 16px',
                                    border: selectedClient?.id === c.id ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                                    borderRadius: '12px',
                                    background: selectedClient?.id === c.id ? '#eff6ff' : '#fff',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s',
                                }}
                            >
                                {/* Avatar */}
                                <div style={{
                                    width: '44px', height: '44px', borderRadius: '50%',
                                    background: getAvatarColor(c.name),
                                    color: 'white', fontWeight: '700', fontSize: '15px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    {getInitials(c.name)}
                                </div>
                                <div>
                                    <div style={{ fontWeight: '700', fontSize: '14px', color: '#1e293b' }}>{c.name}</div>
                                    <div style={{ fontSize: '12px', color: '#64748b' }}>{c.cedula}</div>
                                    <div style={{ fontSize: '12px', color: '#64748b' }}>{c.phone || c.telefono || ''}</div>
                                </div>
                            </div>
                        ))}
                        {clients.length === 0 && (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                                No hay clientes registrados aún.
                            </div>
                        )}
                        {searchClient.length > 0 && filteredClients.length === 0 && (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '20px', color: '#94a3b8' }}>
                                No se encontró ningún cliente. Cambia a "Cliente No Registrado".
                            </div>
                        )}
                    </div>
                </>
            ) : (
                /* Unregistered client form */
                <div style={{
                    background: '#f1f5f9', borderRadius: '12px', padding: '36px 40px',
                    maxWidth: '520px', margin: '0 auto', textAlign: 'center',
                    border: '1px solid #e2e8f0',
                }}>
                    <div style={{
                        width: '56px', height: '56px', borderRadius: '50%',
                        background: '#3b82f6', color: 'white', fontSize: '24px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 14px auto',
                    }}>
                        <FiUser />
                    </div>
                    <h3 style={{ margin: '0 0 6px 0', fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>
                        Datos del Cliente
                    </h3>
                    <p style={{ margin: '0 0 28px 0', color: '#64748b', fontSize: '13px' }}>
                        Ingresa los datos básicos para esta venta
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', textAlign: 'left' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                                Cédula *
                            </label>
                            <input
                                type="text"
                                placeholder="Ej: 20123456"
                                value={newClientCedula}
                                onChange={e => setNewClientCedula(e.target.value)}
                                maxLength={9}
                                style={{
                                    width: '100%', boxSizing: 'border-box',
                                    padding: '12px 14px', border: '1px solid #dde3ec',
                                    borderRadius: '8px', fontSize: '14px', outline: 'none',
                                    background: 'white',
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                                Nombre Completo *
                            </label>
                            <input
                                type="text"
                                placeholder="Ej: Juan Pérez"
                                value={newClientName}
                                maxLength={40}
                                onChange={e => {
                                    // Solo permite letras y espacios
                                    const value = e.target.value;
                                    if (/^[a-zA-Z\s]*$/.test(value)) {
                                        setNewClientName(value);
                                    }
                                }}
                                style={{
                                    width: '100%', boxSizing: 'border-box',
                                    padding: '12px 14px', border: '1px solid #dde3ec',
                                    borderRadius: '8px', fontSize: '14px', outline: 'none',
                                    background: 'white',
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="wizard-footer" style={{ marginTop: '30px' }}>
                <button className="btn-wizard btn-wizard-back" onClick={prevStep}>Anterior</button>
                <button className="btn-wizard btn-wizard-next" disabled={!isStep2Valid} onClick={nextStep}>
                    Continuar a Productos
                </button>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="wizard-panel" style={{ background: 'transparent', border: 'none', padding: 0 }}>
            <div className="products-layout">
                <div className="products-grid">
                    {inventory.map(item => (
                        <div className="product-card" key={item.id}>
                            <span className="bottle-badge">{item.size}L</span>
                            <div className="product-icon-wrap"><FiShoppingCart /></div>
                            <div className="product-info">
                                <h4>Botellón {item.size}L</h4>
                                <p className="product-price">${(item.size * 1.5).toFixed(2)}</p>
                                <p className="product-price-bs">Bs. {(item.size * 1.5 * (config?.exchangeRate || 54.50)).toFixed(2)}</p>
                                <p className="product-stock">Stock: 10{/*item.stock*/}</p>
                            </div>
                            <button 
                                className="btn-add-product" 
                                onClick={() => addToCart({ ...item, title: `Botellón ${item.size}L` })}
                            >
                                <FiPlus /> Agregar
                            </button>
                        </div>
                    ))}
                </div>

                <div className="cart-sidebar">
                    <h3>Items Agregados</h3>
                    <div className="cart-items">
                        {cart.length === 0 ? (
                            <p className="td-muted" style={{ textAlign: 'center' }}>Carrito vacío</p>
                        ) : cart.map(item => (
                            <div className="cart-item" key={item.id}>
                                <div className="cart-item-header">
                                    <span className="cart-item-title">{item.title}</span>
                                    <span className="cart-item-price">${item.price.toFixed(2)} c/u</span>
                                </div>
                                <div className="cart-item-actions">
                                    <div className="qty-controls">
                                        <button className="btn-qty" onClick={() => updateQty(item.id, -1)}><FiMinus /></button>
                                        <span style={{ fontWeight: 600, width: '20px', textAlign: 'center' }}>{item.qty}</span>
                                        <button className="btn-qty" onClick={() => updateQty(item.id, 1)}><FiPlus /></button>
                                    </div>
                                    <button className="btn-remove" onClick={() => removeFromCart(item.id)}><FiTrash2 /></button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-total-box">
                        <span className="total-label">Total:</span>
                        <div>
                            <div className="total-amount">${cartTotalUSD.toFixed(2)}</div>
                            <div className="total-bs">Bs. {cartTotalVES.toFixed(2)}</div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button className="btn-wizard btn-wizard-back" style={{ flex: 1, justifyContent: 'center' }} onClick={prevStep}>Atrás</button>
                        <button 
                            className="btn-wizard btn-wizard-next" 
                            style={{ flex: 1, justifyContent: 'center' }}
                            disabled={!isStep3Valid} 
                            onClick={nextStep}
                        >
                            Pagar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStep4 = () => {
        const rate = config?.exchangeRate || 1;
        const totalBs = cartTotalUSD * rate;

        const paymentMethods = [
            { id: 'efectivo_usd', label: 'Efectivo (USD)', icon: FiDollarSign },
            { id: 'efectivo_ves', label: 'Efectivo (Bs)', icon: FiDollarSign },
            { id: 'pago_movil', label: 'Pago Móvil', icon: FiSmartphone },
            { id: 'transferencia', label: 'Transferencia', icon: FiCreditCard },
            { id: 'punto', label: 'Punto de Venta', icon: FiCreditCard },
            { id: 'mixto', label: 'Pago Mixto', icon: FiPlus }
        ];

        const mixedMethodsList = [
            { id: 'efectivo_usd', label: 'Efectivo USD ($)', currency: 'USD' },
            { id: 'efectivo_ves', label: 'Efectivo Bs', currency: 'BS' },
            { id: 'pago_movil', label: 'Pago Móvil', currency: 'BS', needsBank: true },
            { id: 'transferencia', label: 'Transferencia', currency: 'BS', needsBank: true },
            { id: 'punto', label: 'Punto de Venta', currency: 'BS' },
        ];

        // Shared input style for mixed payment
        const inputStyle = refInputStyle;


        return (
            <div className="wizard-panel">
                <div className="panel-header">
                    <h2>Método de Pago</h2>
                    <p>Selecciona cómo el cliente pagará el total de <strong>${cartTotalUSD.toFixed(2)}</strong> / <strong>Bs. {totalBs.toFixed(2)}</strong>.</p>
                </div>
                
                <div className="payment-methods">
                    {paymentMethods.map(method => (
                        <div 
                            key={method.id}
                            className={`payment-card ${paymentMethod === method.id ? 'selected' : ''}`}
                            onClick={() => {
                                setPaymentMethod(method.id);
                                setPaymentDetails(prev => ({ ...prev, banco: '', referencia: '' }));
                            }}
                        >
                            <method.icon className="payment-icon" />
                            <h4>{method.label}</h4>
                        </div>
                    ))}
                </div>

                {/* ═══ Single Method Details ═══ */}
                {paymentMethod && paymentMethod !== 'mixto' && (
                    <div style={{
                        marginTop: '24px', borderRadius: '14px',
                        border: '1px solid #e2e8f0', overflow: 'hidden',
                        animation: 'fadeIn 0.3s ease',
                    }}>
                        {/* Total display */}
                        <div style={{
                            padding: '20px 24px',
                            background: paymentMethod === 'efectivo_usd' ? '#eff6ff' : '#f0fdf4',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '44px', height: '44px', borderRadius: '12px',
                                    background: paymentMethod === 'efectivo_usd' ? '#3b82f6' : '#22c55e',
                                    color: 'white', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', fontSize: '20px',
                                }}>
                                    <FiDollarSign />
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontWeight: 600, fontSize: '13px', color: '#64748b' }}>Total a pagar</p>
                                    <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
                                        {paymentMethod === 'efectivo_usd' ? 'Efectivo en dólares'
                                            : paymentMethod === 'efectivo_ves' ? 'Efectivo en bolívares'
                                            : paymentMethod === 'pago_movil' ? 'Pago móvil en bolívares'
                                            : paymentMethod === 'transferencia' ? 'Transferencia en bolívares'
                                            : 'Punto de venta en bolívares'}
                                    </p>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                {paymentMethod === 'efectivo_usd' ? (
                                    <>
                                        <p style={{ margin: 0, fontSize: '28px', fontWeight: 800, color: '#1e293b' }}>${cartTotalUSD.toFixed(2)}</p>
                                        <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>Ref: Bs. {totalBs.toFixed(2)}</p>
                                    </>
                                ) : (
                                    <>
                                        <p style={{ margin: 0, fontSize: '28px', fontWeight: 800, color: '#15803d' }}>Bs. {totalBs.toFixed(2)}</p>
                                        <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>Tasa: 1 USD = Bs. {rate}</p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Bank/Ref for pago_movil or transferencia */}
                        {(paymentMethod === 'pago_movil' || paymentMethod === 'transferencia') && (
                            <div style={{ padding: '16px 24px', background: '#fff', borderTop: '1px solid #f1f5f9' }}>
                                <BankRefFields
                                    banco={paymentDetails.banco}
                                    ref6={paymentDetails.referencia}
                                    onBancoChange={(v) => setPaymentDetails(prev => ({ ...prev, banco: v }))}
                                    onRefChange={(v) => setPaymentDetails(prev => ({ ...prev, referencia: v }))}
                                />
                            </div>
                        )}

                        {/* Desglose for non-USD */}
                        {paymentMethod !== 'efectivo_usd' && (
                            <div style={{ padding: '14px 24px', background: '#fff', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b' }}>
                                    <span>Subtotal USD</span><span>${cartTotalUSD.toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b' }}>
                                    <span>Tasa de cambio</span><span>× Bs. {rate}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 700, color: '#1e293b', paddingTop: '8px', borderTop: '1px dashed #e2e8f0' }}>
                                    <span>Total Bs</span><span>Bs. {totalBs.toFixed(2)}</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ═══ Pago Mixto ═══ */}
                {paymentMethod === 'mixto' && (
                    <div style={{ marginTop: '24px', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden', animation: 'fadeIn 0.3s ease' }}>
                        <div style={{ padding: '16px 24px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                            <p style={{ margin: 0, fontWeight: 700, fontSize: '15px', color: '#1e293b' }}>Pago Mixto</p>
                            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>
                                Divide el pago entre los diferentes métodos. Total a cubrir: <strong>Bs. {totalNeededBs.toFixed(2)}</strong>
                            </p>
                        </div>

                        <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {mixedMethodsList.map(m => {
                                const val = paymentDetails.mixedMethods[m.id] || 0;
                                return (
                                    <div key={m.id} style={{
                                        padding: '14px 16px', borderRadius: '10px',
                                        border: val > 0 ? '1.5px solid #3b82f6' : '1px solid #e2e8f0',
                                        background: val > 0 ? '#fafbff' : '#fff',
                                        transition: 'all 0.15s',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                                            <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155', whiteSpace: 'nowrap' }}>
                                                {m.label}
                                            </label>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>
                                                    {m.currency === 'USD' ? '$' : 'Bs.'}
                                                </span>
                                                <input
                                                    type="number" min="0" step="0.01"
                                                    value={val || ''}
                                                    onChange={(e) => {
                                                        const newVal = parseFloat(e.target.value) || 0;
                                                        setPaymentDetails(prev => ({
                                                            ...prev,
                                                            mixedMethods: { ...prev.mixedMethods, [m.id]: newVal }
                                                        }));
                                                    }}
                                                    placeholder="0.00"
                                                    style={{ ...inputStyle, width: '140px', textAlign: 'right' }}
                                                />
                                            </div>
                                        </div>
                                        {m.currency === 'USD' && val > 0 && (
                                            <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#94a3b8', textAlign: 'right' }}>
                                                Equivale a Bs. {(val * rate).toFixed(2)}
                                            </p>
                                        )}
                                        {/* Bank/ref for pago_movil and transferencia inside mixed */}
                                        {m.needsBank && val > 0 && (
                                            <BankRefFields
                                                banco={paymentDetails.mixedBanco[m.id]}
                                                ref6={paymentDetails.mixedRef[m.id]}
                                                onBancoChange={(v) => setPaymentDetails(prev => ({
                                                    ...prev,
                                                    mixedBanco: { ...prev.mixedBanco, [m.id]: v }
                                                }))}
                                                onRefChange={(v) => setPaymentDetails(prev => ({
                                                    ...prev,
                                                    mixedRef: { ...prev.mixedRef, [m.id]: v }
                                                }))}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Resumen del pago mixto */}
                        <div style={{
                            padding: '16px 24px',
                            background: mixedRemaining <= 0.01 && mixedRemaining >= -0.01 ? '#f0fdf4' : '#fff7ed',
                            borderTop: '1px solid #f1f5f9',
                            display: 'flex', flexDirection: 'column', gap: '6px',
                        }}>
                            {mixedMethodsList.map(m => {
                                const val = paymentDetails.mixedMethods[m.id] || 0;
                                if (val <= 0) return null;
                                const bsVal = m.currency === 'USD' ? val * rate : val;
                                return (
                                    <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b' }}>
                                        <span>{m.label}</span>
                                        <span>
                                            {m.currency === 'USD' ? `$${val.toFixed(2)} → ` : ''}
                                            Bs. {bsVal.toFixed(2)}
                                        </span>
                                    </div>
                                );
                            })}
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 700, paddingTop: '8px', borderTop: '1px dashed #e2e8f0', color: '#1e293b' }}>
                                <span>Total cubierto</span>
                                <span>Bs. {mixedTotalBs.toFixed(2)} / Bs. {totalNeededBs.toFixed(2)}</span>
                            </div>
                            {mixedRemaining > 0.01 && (
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    marginTop: '6px', padding: '10px 14px',
                                    borderRadius: '8px', background: '#fef3c7',
                                    fontSize: '13px', fontWeight: 600, color: '#92400e',
                                }}>
                                    ⚠️ Faltan Bs. {mixedRemaining.toFixed(2)} por cubrir
                                </div>
                            )}
                            {mixedRemaining <= 0.01 && mixedRemaining >= -0.01 && Object.values(paymentDetails.mixedMethods).some(v => v > 0) && (
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    marginTop: '6px', padding: '10px 14px',
                                    borderRadius: '8px', background: '#dcfce7',
                                    fontSize: '13px', fontWeight: 600, color: '#15803d',
                                }}>
                                    <FiCheck /> Monto completo cubierto
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="wizard-footer">
                    <button className="btn-wizard btn-wizard-back" onClick={prevStep}>Anterior</button>
                    <button className="btn-wizard btn-wizard-next" disabled={!isStep4Valid} onClick={nextStep}>
                        Verificar Orden
                    </button>
                </div>
            </div>
        );
    };

    const renderStep5 = () => (
        <div className="wizard-panel">
            <div className="panel-header" style={{ textAlign: 'center' }}>
                <h2>Confirmación de la Venta</h2>
                <p>Revisa los detalles antes de imprimir el comprobante.</p>
            </div>

            <div className="receipt-wrapper">
                <div className="receipt-paper">
                    <div className="receipt-header">
                        <h3>H2O MANAGER</h3>
                        <p>Rif: J-12345678-9</p>
                        <p>Fecha: {new Date().toLocaleString('es-VE')}</p>
                        <p>Cliente: {selectedClient?.name}</p>
                        <p>C.I: {selectedClient?.cedula}</p>
                        <p>Tipo: {deliveryType === 'local' ? 'Retiro en Tienda' : 'Despacho/Delivery'}</p>
                        {deliveryType === 'delivery' && deliveryAddress && (
                            <p>Dirección: {deliveryAddress}</p>
                        )}
                    </div>
                    
                    <table className="receipt-table">
                        <thead>
                            <tr>
                                <th>CANT</th>
                                <th>DESCRIPCION</th>
                                <th className="text-right">TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((item, idx) => (
                                <tr key={idx}>
                                    <td>{item.qty}</td>
                                    <td>{item.title}</td>
                                    <td className="text-right">${(item.price * item.qty).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="receipt-totals">
                        <div>
                            <span>SUBTOTAL:</span>
                            <span>${cartTotalUSD.toFixed(2)}</span>
                        </div>
                        <div className="bold">
                            <span>TOTAL USD:</span>
                            <span>${cartTotalUSD.toFixed(2)}</span>
                        </div>
                        <div className="bold" style={{ fontSize: '13px', marginTop: '5px' }}>
                            <span>TOTAL BS:</span>
                            <span>Bs. {cartTotalVES.toFixed(2)}</span>
                        </div>
                        <div style={{ fontSize: '12px', marginTop: '10px' }}>
                            Tasa Ref: Bs. {config?.exchangeRate}
                        </div>
                        <div style={{ fontSize: '12px' }}>
                            Pago: {paymentMethod?.replace('_', ' ').toUpperCase()}
                        </div>
                    </div>

                    <div className="receipt-footer">
                        ¡Gracias por su compra!<br/>
                        www.h2omanager.com
                    </div>
                </div>
            </div>

            <div className="wizard-footer">
                <button className="btn-wizard btn-wizard-back" onClick={() => {
                    setDeliveryType(null);
                    setClientMode('registered');
                    setSelectedClient(null);
                    setNewClientName('');
                    setNewClientCedula('');
                    setCart([]);
                    setPaymentMethod(null);
                    setPaymentDetails({
                        banco: '', referencia: '',
                        mixedMethods: { efectivo_usd: 0, efectivo_ves: 0, pago_movil: 0, transferencia: 0, punto: 0 },
                        mixedBanco: { pago_movil: '', transferencia: '' },
                        mixedRef: { pago_movil: '', transferencia: '' },
                    });
                    setDeliveryCoords(null);
                    setDeliveryAddress('');
                    setMapCenter(null);
                    setCurrentStep(1);
                }}><FiPlus /> Nueva Venta</button>
                <button className="btn-wizard btn-wizard-next" disabled={isLoading} onClick={handleConfirmSale} style={{ background: '#10b981' }}>
                    <FiPrinter /> Procesar e Imprimir
                </button>
            </div>
        </div>
    );

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1: return renderStep1();
            case 2: return renderStep2();
            case 3: return renderStep3();
            case 4: return renderStep4();
            case 5: return renderStep5();
            default: return renderStep1();
        }
    };

    return (
        <div className="ventas-container">
            <div className="wizard-stepper">
                {STEPS.map((step) => {
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;
                    return (
                        <div key={step.id} className={`wizard-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                            <div className="step-icon-wrap">
                                {isCompleted ? <FiCheck /> : <step.icon />}
                            </div>
                            <span className="step-label">{step.label}</span>
                        </div>
                    );
                })}
            </div>

            {renderCurrentStep()}
        </div>
    );
}
