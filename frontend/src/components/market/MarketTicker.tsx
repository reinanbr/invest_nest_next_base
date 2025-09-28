'use client'

import { useEffect, useState } from 'react'

interface MarketData {
  symbol: string
  value: string
  change: string
  isPositive: boolean
}

export function MarketTicker() {
  const [marketData, setMarketData] = useState<MarketData[]>([])
  
  useEffect(() => {
    // Dados mockados para demonstração
    const mockData: MarketData[] = [
      { symbol: 'IBOV', value: '112.450', change: '+0.85%', isPositive: true },
      { symbol: 'USD/BRL', value: '5.24', change: '-0.12%', isPositive: false },
      { symbol: 'CDI', value: '11.75%', change: '+0.00%', isPositive: true },
      { symbol: 'SELIC', value: '11.75%', change: '+0.00%', isPositive: true },
      { symbol: 'IPCA', value: '5.19%', change: '+0.05%', isPositive: true },
    ]
    
    setMarketData(mockData)
  }, [])
  
  return (
    <div className="bg-gray-900 border-b border-gray-700 py-2">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center space-x-8 overflow-x-auto">
          <div className="flex-shrink-0 text-sm text-gray-400 font-medium">
            Mercado ao vivo:
          </div>
          
          {marketData.map((item, index) => (
            <div key={index} className="flex items-center space-x-2 flex-shrink-0">
              <span className="text-sm text-white font-medium">{item.symbol}</span>
              <span className="text-sm text-gray-300">{item.value}</span>
              <span className={`text-sm font-medium ${
                item.isPositive ? 'text-green-400' : 'text-red-400'
              }`}>
                {item.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
