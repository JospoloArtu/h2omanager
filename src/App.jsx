import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Index from './index.jsx';
import Login from './auth/login.jsx';

// Layout de gerente
import GerenteLayout from './gerente/GerenteLayout.jsx';

// Páginas de gerente
import HomeGere from './gerente/home.jsx';
import Botellones from './gerente/botellones.jsx';
import Clientes from './gerente/clientes.jsx';
import Configuracion from './gerente/configuracion.jsx';
import VentasWizard from './gerente/ventas.jsx';
import Entregas from './gerente/entregas.jsx';
import Historial from './gerente/historial.jsx';
import Reportes from './gerente/reportes.jsx';
import Rutas from './gerente/rutas.jsx';
import Servicios from './gerente/serivicios.jsx';
import Proveedores from './gerente/provedores.jsx';
import Empleados from './gerente/empleados.jsx';

// Módulos contables (¡Listos e importados!)
import PlanCuentas from './gerente/contabilidad/cuentas.jsx'; 
import AsientosContables from './gerente/contabilidad/asientos.jsx';  
import LibroDiario from './gerente/contabilidad/diario.jsx';
import LibroMayor from './gerente/contabilidad/mayor.jsx'; 
import BalanceComprobacion from './gerente/contabilidad/balance.jsx';   
import EstadoResultados from './gerente/contabilidad/estados.jsx';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Ruta principal */}
                <Route path="/" element={<Index />} />
                <Route path="/index" element={<Navigate to="/" replace />} />
                <Route path="/login" element={<Login />} />

                {/* Rutas de gerente con layout compartido */}
                <Route path="/gerente" element={<GerenteLayout />}>
                    <Route index element={<Navigate to="home" replace />} />
                    <Route path="home" element={<HomeGere />} />
                    <Route path="clientes" element={<Clientes />} />
                    <Route path="botellones" element={<Botellones />} />
                    <Route path="ventas" element={<VentasWizard />} />
                    <Route path="configuracion" element={<Configuracion />} />
                    <Route path="entregas" element={<Entregas />} />
                    <Route path="historial" element={<Historial />} />
                    <Route path="reportes" element={<Reportes />} />
                    <Route path="rutas" element={<Rutas />} />
                    <Route path="servicios" element={<Servicios />} />
                    <Route path="proveedores" element={<Proveedores />} />
                    <Route path="empleados" element={<Empleados />} />
                    
                    {/* Sub-módulos de Contabilidad (Rutas relativas limpias) */}
                    <Route path="contabilidad/cuentas" element={<PlanCuentas />} />
                    <Route path="contabilidad/asientos" element={<AsientosContables />} />
                    <Route path="contabilidad/diario" element={<LibroDiario />} />
                    <Route path="contabilidad/mayor" element={<LibroMayor />} />
                    <Route path="contabilidad/balance" element={<BalanceComprobacion />} />
                    <Route path="contabilidad/estados" element={<EstadoResultados />} />

                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;