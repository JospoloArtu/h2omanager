import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Index from './index.jsx';
import Login from './auth/login.jsx';

//Importacion de Rutas de gerente
import HomeGere from './gerente/home.jsx';

function App() {
    return(
      <BrowserRouter>
        <Routes>
          {/* Ruta principal */}
          <Route path="/" element={<Index />} />
          <Route path="/index" element={<Navigate to="/" replace />} />
          <Route path="/login" element={<Login />} />


          {/* Rutas de gerente */}
          <Route path="/gerente/home" element={<HomeGere />} />

          {/* Rutas para empleados */}
        </Routes>
      </BrowserRouter>
    )
}

export default App;