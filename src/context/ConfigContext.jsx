import { createContext, useContext, useState, useEffect } from 'react'

// Crear contexto de configuración
const ConfigContext = createContext()

// Hook para usar el contexto
export const useConfig = () => {
  const context = useContext(ConfigContext)
  if (!context) {
    throw new Error('useConfig debe usarse dentro de ConfigProvider')
  }
  return context
}

// Provider de configuración
export const ConfigProvider = ({ children }) => {
  // Estado de configuración de moneda
  const [currencyConfig, setCurrencyConfig] = useState({
    monedaSecundaria: 'USD',
    tasaCambio: 36.50,
    iva: 16
  })

  // Estado de configuración de precios
  const [priceConfig, setPriceConfig] = useState({
    precioLitro: 0.50,
    precioBotellon18L: 9.00,
    precioBotellon20L: 10.00,
    precioDelivery: 2.00
  })

  // Cargar configuración del localStorage al iniciar
  useEffect(() => {
    const savedCurrencyConfig = localStorage.getItem('currencyConfig')
    const savedPriceConfig = localStorage.getItem('priceConfig')
    
    if (savedCurrencyConfig) {
      setCurrencyConfig(JSON.parse(savedCurrencyConfig))
    }
    if (savedPriceConfig) {
      setPriceConfig(JSON.parse(savedPriceConfig))
    }
  }, [])

  // Guardar configuración de moneda
  const updateCurrencyConfig = (newConfig) => {
    setCurrencyConfig(newConfig)
    localStorage.setItem('currencyConfig', JSON.stringify(newConfig))
  }

  // Guardar configuración de precios
  const updatePriceConfig = (newConfig) => {
    setPriceConfig(newConfig)
    localStorage.setItem('priceConfig', JSON.stringify(newConfig))
  }

  // Función helper para convertir USD a moneda local
  const convertToLocal = (usdAmount) => {
    return usdAmount * currencyConfig.tasaCambio
  }

  // Función helper para convertir moneda local a USD
  const convertToUSD = (localAmount) => {
    return localAmount / currencyConfig.tasaCambio
  }

  // Función helper para formatear precio en ambas monedas
  const formatDualPrice = (usdAmount) => {
    const localAmount = convertToLocal(usdAmount)
    return {
      usd: `$${usdAmount.toFixed(2)}`,
      local: `Bs. ${localAmount.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      usdValue: usdAmount,
      localValue: localAmount
    }
  }

  const value = {
    currencyConfig,
    priceConfig,
    updateCurrencyConfig,
    updatePriceConfig,
    convertToLocal,
    convertToUSD,
    formatDualPrice
  }

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  )
}
