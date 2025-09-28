'use client'

import { useEffect, useState } from 'react'

interface ChartData {
  name: string
  value: number
  change: number
}

export function MarketCharts() {
  const [chartData, setChartData] = useState<ChartData[]>([])

  useEffect(() => {
    // Dados mockados para demonstração
    const mockData: ChartData[] = [
      { name: 'IBOVESPA', value: 112450, change: 0.85 },
      { name: 'IFIX', value: 2856, change: -0.23 },
      { name: 'SMALL11', value: 2145, change: 1.23 },
      { name: 'BOVA11', value: 108.50, change: 0.75 }
    ]
    
    setChartData(mockData)
  }, [])

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        Indicadores de Mercado
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {chartData.map((item, index) => (
          <div key={index} className="metric-card">
            <h3 className="text-lg font-semibold text-white mb-2">{item.name}</h3>
            <div className="text-2xl font-bold text-white mb-1">
              {item.value.toLocaleString('pt-BR')}
            </div>
            <div className={`text-sm font-medium ${
              item.change >= 0 ? 'metric-positive' : 'metric-negative'
            }`}>
              {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
            </div>
            
            {/* Gráfico simulado */}
            <div className="mt-4 h-16 bg-gray-700 rounded flex items-end justify-center space-x-1 p-2">
              {Array.from({ length: 20 }, (_, i) => (
                <div
                  key={i}
                  className={`w-1 bg-gradient-to-t ${
                    item.change >= 0 ? 'from-green-600 to-green-400' : 'from-red-600 to-red-400'
                  } rounded-t`}
                  style={{
                    height: `${Math.random() * 80 + 20}%`
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
