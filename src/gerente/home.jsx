import { FiRefreshCw, FiPackage, FiUsers, FiTruck, FiClock, FiPlus, FiUserPlus, FiMapPin, FiArrowRight } from "react-icons/fi";
import { TbBottle } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import "../assets/css/dashboard.css";

const stats = [
  { icon: FiPackage, color: "blue", value: 347, label: "Botellones Disponibles" },
  { icon: FiUsers, color: "green", value: 128, label: "Clientes Activos" },
  { icon: FiTruck, color: "orange", value: 24, label: "Entregas Hoy" },
  { icon: FiClock, color: "red", value: 8, label: "Pendientes" },
];

const entregas = [
  { cliente: "Juan Pérez", cantidad: 5, direccion: "Av. Principal #123", estado: "entregado" },
  { cliente: "María García", cantidad: 3, direccion: "Calle 10 #45", estado: "en-camino" },
  { cliente: "Carlos López", cantidad: 10, direccion: "Zona Industrial #78", estado: "pendiente" },
  { cliente: "Ana Martínez", cantidad: 2, direccion: "Residencias Sol #12", estado: "entregado" },
  { cliente: "Luis Ramírez", cantidad: 6, direccion: "Urb. Las Palmas #5", estado: "en-camino" },
];

const acciones = [
  { icon: FiPlus, label: "Nueva Entrega", link: "/gerente/entregas" },
  { icon: FiUserPlus, label: "Nuevo Cliente", link: "/gerente/clientes" },
  { icon: TbBottle, label: "Registrar Botellones", link: "/gerente/botellones" },
  { icon: FiMapPin, label: "Planificar Ruta", link: "/gerente/rutas" },
];

const estadoConfig = {
  entregado: { label: "Entregado", cls: "badge-green" },
  "en-camino": { label: "En camino", cls: "badge-orange" },
  pendiente: { label: "Pendiente", cls: "badge-red" },
};

export default function HomeGere() {
  const navigate = useNavigate();

  return (
    <div className="dash">
      {/* Header */}
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Dashboard</h1>
          <p className="dash-sub">Bienvenido al sistema H2OManager</p>
        </div>
        <button className="dash-refresh">
          <FiRefreshCw />
          Actualizar
        </button>
      </div>

      {/* Banner demo */}
      <div className="dash-banner">
        ⚠ Mostrando datos de ejemplo. Conecta el backend para datos reales.
      </div>

      {/* Stats */}
      <div className="dash-stats">
        {stats.map(({ icon: Icon, color, value, label }) => (
          <div className="stat-card" key={label}>
            <div className={`stat-icon-wrap color-${color}`}>
              <Icon />
            </div>
            <p className="stat-value">{value}</p>
            <p className="stat-label">{label}</p>
          </div>
        ))}
      </div>

      {/* Bottom grid */}
      <div className="dash-grid">
        {/* Entregas recientes */}
        <div className="dash-card">
          <div className="dash-card-header">
            <h2>Entregas Recientes</h2>
            <button
              className="btn-ver"
              onClick={() => navigate("/gerente/entregas")}
            >
              Ver todas <FiArrowRight />
            </button>
          </div>

          <div className="table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Cantidad</th>
                  <th>Dirección</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {entregas.map((e, i) => (
                  <tr key={i}>
                    <td className="td-name">{e.cliente}</td>
                    <td>{e.cantidad} botellones</td>
                    <td className="td-muted">{e.direccion}</td>
                    <td>
                      <span className={`badge ${estadoConfig[e.estado].cls}`}>
                        {estadoConfig[e.estado].label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="dash-card acciones-card">
          <div className="dash-card-header">
            <h2>Acciones Rápidas</h2>
          </div>
          <div className="acciones-list">
            {acciones.map(({ icon: Icon, label, link }) => (
              <button
                key={link}
                className="accion-btn"
                onClick={() => navigate(link)}
              >
                <span className="accion-icon">
                  <Icon />
                </span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
