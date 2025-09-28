'use client'

import { useEffect, useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'

interface MarketData {
  symbol: string
  name: string
  value: number
  change: number
  changePercent: number
  volume?: string
  high?: number
  low?: number
}

interface EconomicIndicator {
  name: string
  value: string
  change: string
  description: string
  lastUpdate: string
}

export default function MarketPage() {
  const [marketData, setMarketData] = useState<MarketData[]>([])
  const [indicators, setIndicators] = useState<EconomicIndicator[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<'indices' | 'currencies' | 'rates'>('indices')

  useEffect(() => {
    // Mock data - substituir pela chamada real à API
    setTimeout(() => {
      const mockMarketData: MarketData[] = [
        {
          symbol: 'IBOV',
          name: 'Ibovespa',
          value: 112450,
          change: 956,
          changePercent: 0.85,
          volume: '14.2B',
          high: 113200,
          low: 111800
        },
        {
          symbol: 'IFIX',
          name: 'Índice de Fundos Imobiliários',
          value: 2856,
          change: -7,
          changePercent: -0.23,
          volume: '487M',
          high: 2875,
          low: 2848
        },
        {
          symbol: 'SMALL11',
          name: 'Small Cap',
          value: 2145,
          change: 26,
          changePercent: 1.23,
          volume: '234M',
          high: 2158,
          low: 2132
        },
        {
          symbol: 'USD/BRL',
          name: 'Dólar Americano',
          value: 5.24,
          change: -0.06,
          changePercent: -0.12,
          high: 5.31,
          low: 5.22
        },
        {
          symbol: 'EUR/BRL',
          name: 'Euro',
          value: 5.68,
          change: 0.02,
          changePercent: 0.35,
          high: 5.72,
          low: 5.65
        }
      ]

      const mockIndicators: EconomicIndicator[] = [
        {
          name: 'Taxa CDI',
          value: '11,75%',
          change: '+0,00%',
          description: 'Certificado de Depósito Interbancário',
          lastUpdate: '2024-01-15'
        },
        {
          name: 'Taxa SELIC',
          value: '11,75%',
          change: '+0,00%',
          description: 'Sistema Especial de Liquidação e Custódia',
          lastUpdate: '2024-01-10'
        },
        {
          name: 'IPCA',
          value: '5,19%',
          change: '+0,05%',
          description: 'Índice Nacional de Preços ao Consumidor Amplo',
          lastUpdate: '2024-01-12'
        },
        {
          name: 'PIB',
          value: '2,1%',
          change: '-0,3%',
          description: 'Produto Interno Bruto (crescimento anual)',
          lastUpdate: '2024-01-01'
        }
      ]

      setMarketData(mockMarketData)
      setIndicators(mockIndicators)
      setLoading(false)
    }, 1000)
  }, [])

  const getFilteredData = () => {
    switch (selectedTab) {
      case 'indices':
        return marketData.filter(item => ['IBOV', 'IFIX', 'SMALL11'].includes(item.symbol))
      case 'currencies':
        return marketData.filter(item => item.symbol.includes('/'))
      case 'rates':
        return []
      default:
        return marketData
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center py-12">
            <div className="spinner mx-auto"></div>
            <p className="text-gray-400 mt-4">Carregando dados do mercado...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            <span className="gradient-text">Mercado</span> Financeiro
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Acompanhe em tempo real as cotações, índices e principais 
            indicadores econômicos do mercado brasileiro.
          </p>
        </div>

        {/* Market Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="metric-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">IBOVESPA</span>
              <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">+0,85%</span>
            </div>
            <div className="text-2xl font-bold text-white">112.450</div>
            <div className="text-sm text-green-400">+956 pts</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">USD/BRL</span>
              <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">-0,12%</span>
            </div>
            <div className="text-2xl font-bold text-white">R$ 5,24</div>
            <div className="text-sm text-red-400">-0,06</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">CDI</span>
              <span className="text-xs bg-gray-600 text-white px-2 py-1 rounded">0,00%</span>
            </div>
            <div className="text-2xl font-bold text-white">11,75%</div>
            <div className="text-sm text-gray-400">a.a.</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">IPCA</span>
              <span className="text-xs bg-yellow-600 text-white px-2 py-1 rounded">+0,05%</span>
            </div>
            <div className="text-2xl font-bold text-white">5,19%</div>
            <div className="text-sm text-yellow-400">12 meses</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 mb-8 w-fit">
          {[
            { key: 'indices', label: 'Índices', icon: '📊' },
            { key: 'currencies', label: 'Moedas', icon: '💱' },
            { key: 'rates', label: 'Taxas', icon: '📈' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key as any)}
              className={`flex items-center px-6 py-3 rounded-md transition-all ${
                selectedTab === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Market Data Table */}
        {selectedTab !== 'rates' && (
          <div className="trading-card mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              {selectedTab === 'indices' ? 'Índices da Bolsa' : 'Cotações de Moedas'}
            </h2>
            
            <div className="overflow-x-auto">
              <table className="table-trader">
                <thead>
                  <tr>
                    <th>Ativo</th>
                    <th>Último</th>
                    <th>Variação</th>
                    <th>%</th>
                    <th>Máxima</th>
                    <th>Mínima</th>
                    {selectedTab === 'indices' && <th>Volume</th>}
                  </tr>
                </thead>
                <tbody>
                  {getFilteredData().map((item) => (
                    <tr key={item.symbol}>
                      <td>
                        <div>
                          <div className="font-semibold text-white">{item.symbol}</div>
                          <div className="text-sm text-gray-400">{item.name}</div>
                        </div>
                      </td>
                      <td className="text-white font-semibold">
                        {selectedTab === 'currencies' ? 'R$ ' : ''}
                        {item.value.toLocaleString('pt-BR', { 
                          minimumFractionDigits: selectedTab === 'currencies' ? 2 : 0,
                          maximumFractionDigits: selectedTab === 'currencies' ? 2 : 0
                        })}
                      </td>
                      <td className={item.change >= 0 ? 'metric-positive' : 'metric-negative'}>
                        {item.change >= 0 ? '+' : ''}{item.change}
                      </td>
                      <td className={item.changePercent >= 0 ? 'metric-positive' : 'metric-negative'}>
                        {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                      </td>
                      <td className="text-gray-300">
                        {item.high?.toLocaleString('pt-BR', { 
                          minimumFractionDigits: selectedTab === 'currencies' ? 2 : 0 
                        })}
                      </td>
                      <td className="text-gray-300">
                        {item.low?.toLocaleString('pt-BR', { 
                          minimumFractionDigits: selectedTab === 'currencies' ? 2 : 0 
                        })}
                      </td>
                      {selectedTab === 'indices' && (
                        <td className="text-gray-300">{item.volume}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Economic Indicators */}
        {selectedTab === 'rates' && (
          <div className="trading-card mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Indicadores Econômicos</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {indicators.map((indicator, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-white">{indicator.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${
                      indicator.change.startsWith('+') ? 'bg-green-600' : 
                      indicator.change.startsWith('-') ? 'bg-red-600' : 'bg-gray-600'
                    } text-white`}>
                      {indicator.change}
                    </span>
                  </div>
                  
                  <div className="text-3xl font-bold text-white mb-2">{indicator.value}</div>
                  <p className="text-sm text-gray-400 mb-3">{indicator.description}</p>
                  <p className="text-xs text-gray-500">
                    Atualizado em: {new Date(indicator.lastUpdate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Market Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="trading-card">
            <h3 className="text-xl font-bold text-white mb-4">📈 Análise do Dia</h3>
            <div className="space-y-4 text-sm text-gray-300">
              <p>
                O Ibovespa fechou em alta de 0,85%, impulsionado principalmente pelos 
                papéis do setor financeiro e commodities.
              </p>
              <p>
                O dólar recuou 0,12% frente ao real, reflexo da melhora no cenário 
                fiscal doméstico e fluxo positivo de investimento estrangeiro.
              </p>
              <p>
                A taxa CDI mantém-se estável em 11,75%, alinhada com a SELIC, 
                oferecendo atratividade para investimentos de renda fixa.
              </p>
            </div>
          </div>

          <div className="trading-card">
            <h3 className="text-xl font-bold text-white mb-4">📊 Destaques</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Maior alta do dia:</span>
                <span className="text-green-400 font-semibold">SMALL11 (+1,23%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Maior queda do dia:</span>
                <span className="text-red-400 font-semibold">IFIX (-0,23%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Volume total:</span>
                <span className="text-white font-semibold">R$ 14,9 bi</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Empresas em alta:</span>
                <span className="text-green-400 font-semibold">67%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
