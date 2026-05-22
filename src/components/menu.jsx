import { useState } from 'react'
import {
    FiHome,
    FiUsers,
    FiPackage,
    FiTruck,
    FiMap,
    FiBarChart2,
    FiSettings,
    FiShoppingCart,
    FiUserCheck,
    FiClock,
    FiTool,
    FiChevronLeft,
    FiChevronRight,
    FiMenu,
    FiDollarSign,
    FiChevronDown
} from 'react-icons/fi'
import { useNavigate, useLocation } from 'react-router-dom'
import '../assets/css/menu.css'
import Logo from '../../public/Logo.webp'

const MENU_GERENTE = [
    { id: 'home',        icon: FiHome,        label: 'Dashboard',   link: '/gerente/home' },
    { id: 'clientes',    icon: FiUsers,       label: 'Clientes',    link: '/gerente/clientes' },
    { id: 'botellones',  icon: FiPackage,     label: 'Botellones',  link: '/gerente/botellones' },
    
    // Módulo Contable idéntico a tus prototipos de H2OManager
    { 
        id: 'contabilidad', 
        icon: FiDollarSign,  
        label: 'Contabilidad', 
        link: '/gerente/contabilidad',
        children: [
            { label: 'Plan de Cuentas',           link: '/gerente/contabilidad/cuentas' },
            { label: 'Asientos Contables',       link: '/gerente/contabilidad/asientos' },
            { label: 'Libro Diario',              link: '/gerente/contabilidad/diario' },
            { label: 'Libro Mayor',               link: '/gerente/contabilidad/mayor' },
            { label: 'Balance de Comprobación',   link: '/gerente/contabilidad/balance' },
            { label: 'Estados Financieros',       link: '/gerente/contabilidad/estados' },
        ]
    },

    { id: 'entregas',    icon: FiTruck,       label: 'Entregas',    link: '/gerente/entregas' },
    { id: 'ventas',      icon: FiShoppingCart,label: 'Ventas',      link: '/gerente/ventas' },
    { id: 'empleados',   icon: FiUserCheck,   label: 'Empleados',   link: '/gerente/empleados' },
    { id: 'historial',   icon: FiClock,       label: 'Historial',   link: '/gerente/historial' },
    { id: 'proveedores', icon: FiUserCheck,   label: 'Proveedores', link: '/gerente/proveedores' },
    { id: 'servicios',   icon: FiTool,        label: 'Servicios',   link: '/gerente/servicios' },
    { id: 'rutas',       icon: FiMap,         label: 'Rutas',       link: '/gerente/rutas' },
    { id: 'reportes',    icon: FiBarChart2,   label: 'Reportes',    link: '/gerente/reportes' },
]

const MENU_EMPLEADO = [
    { id: 'home',       icon: FiHome,         label: 'Dashboard',   link: '/empleado/home' },
    { id: 'clientes',   icon: FiUsers,        label: 'Clientes',    link: '/empleado/clientes' },
    { id: 'botellones', icon: FiPackage,      label: 'Botellones',  link: '/empleado/botellones' },
    { id: 'entregas',   icon: FiTruck,        label: 'Entregas',    link: '/empleado/entregas' },
    { id: 'ventas',     icon: FiShoppingCart, label: 'Ventas',      link: '/empleado/ventas' },
    { id: 'historial',  icon: FiClock,        label: 'Historial',   link: '/empleado/historial' },
]

const MENU_BY_ROLE = {
    1: MENU_GERENTE,
    2: MENU_EMPLEADO,
}

export default function Sidebar({ isOpen, onToggle, role }) {
    const navigate = useNavigate()
    const location = useLocation()

    // Estado para saber cuál submenú está desplegado
    const [openSubmenu, setOpenSubmenu] = useState(null)

    const menuItems = MENU_BY_ROLE[role] ?? MENU_GERENTE
    const isConfigPage = location.pathname.includes('configuracion')

    // Lógica para abrir/cerrar acordeón o navegar directo
    const handleItemClick = (item) => {
        if (item.children) {
            setOpenSubmenu(openSubmenu === item.id ? null : item.id)
        } else {
            navigate(item.link)
        }
    }

    return (
        <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>

            {/* Brand */}
            <div className="sidebar-brand">
                <button
                    className="sidebar-toggle"
                    onClick={onToggle}
                    aria-label={isOpen ? "Colapsar menú" : "Expandir menú"}
                >
                    {isOpen ? <FiChevronLeft /> : <FiMenu />}
                </button>
            </div>

            {/* Role badge */}
            {isOpen && (
                <div className="role-badge">
                    <span className={`role-pill role-${role === 2 ? 'empleado' : 'gerente'}`}>
                        {role === 2 ? 'Empleado' : 'Gerente'}
                    </span>
                </div>
            )}

            {isOpen && <p className="nav-section-label">Menú principal</p>}

            {/* Menu */}
            <ul className="menu-list">
                {menuItems.map((item) => {
                    const { id, icon: Icon, label, link, children } = item
                    // El padre se mantiene activo si estás dentro de cualquier sub-módulo contable
                    const isActive = location.pathname.includes(link)
                    const isSubmenuOpen = openSubmenu === id

                    return (
                        <div key={id}>
                            <li
                                className={`menu-item ${isActive ? 'active' : ''}`}
                                onClick={() => handleItemClick(item)}
                                title={!isOpen ? label : ''}
                            >
                                <span className="menu-icon-wrap">
                                    <Icon className="menu-icon" />
                                </span>
                                {isOpen && <span className="menu-label">{label}</span>}
                                
                                {/* Flecha para desplegables */}
                                {isOpen && children && (
                                    <FiChevronDown 
                                        style={{ 
                                            marginLeft: 'auto', 
                                            transition: '0.3s', 
                                            transform: isSubmenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' 
                                        }}
                                    />
                                )}
                                {isOpen && isActive && !children && <span className="active-dot" />}
                            </li>

                            {/* Renderizado limpio de los submódulos contables */}
                            {isOpen && children && isSubmenuOpen && (
                                <ul className="submenu-list" style={{ paddingLeft: '45px', marginTop: '5px', listStyle: 'none' }}>
                                    {children.map((child) => {
                                        const isChildActive = location.pathname === child.link
                                        return (
                                            <li 
                                                key={child.link}
                                                onClick={(e) => {
                                                    e.stopPropagation() // Evita que el clic cierre el menú padre
                                                    navigate(child.link)
                                                }}
                                                style={{ 
                                                    padding: '8px 0', 
                                                    fontSize: '14px', 
                                                    color: isChildActive ? '#2563eb' : '#64748b',
                                                    cursor: 'pointer',
                                                    fontWeight: isChildActive ? '600' : 'normal',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                {child.label}
                                            </li>
                                        )
                                    })}
                                </ul>
                            )}
                        </div>
                    )
                })}
            </ul>

            {/* Footer — Configuración (solo gerente) */}
            {(role === 1 || !role) && (
                <div className="sidebar-footer">
                    <div
                        className={`menu-item ${isConfigPage ? 'active' : ''}`}
                        onClick={() => navigate(role === 2 ? '/empleado/configuracion' : '/gerente/configuracion')}
                        title={!isOpen ? 'Configuración' : ''}
                    >
                        <span className="menu-icon-wrap">
                            <FiSettings className="menu-icon" />
                        </span>
                        {isOpen && <span className="menu-label">Configuración</span>}
                    </div>
                </div>
            )}

        </aside>
    )
}