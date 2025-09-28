'use client'

import { useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'

interface SimulationResult {
  initialValue: number
  finalValue: number
  profit: number
  taxes: number
  netProfit: number
  profitability: number
}

export default function SimulatorsPage() {
  const [activeSimulator, setActiveSimulator] = useState<'cdb' | 'cdb-ipo' | 'cdb-ipo-inflation'>('cdb')
  const [formData, setFormData] = useState({
    amount: '',
    period: '',
    cdiRate: '11.75',
    cdbRate: '110',
    ipoAmount: '',
    ipoReturn: '',
    inflationRate: '5.2'
  })
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const calculateSimulation = async () => {
    if (!formData.amount || !formData.period) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    setLoading(true)
    
    // Simular chamada à API
    setTimeout(() => {
      const amount = parseFloat(formData.amount)
      const days = parseInt(formData.period) * 30 // Convertendo meses para dias
      const cdiRate = parseFloat(formData.cdiRate) / 100
      const cdbMultiplier = parseFloat(formData.cdbRate) / 100
      
      // Cálculo básico de CDB
      const dailyRate = (cdiRate * cdbMultiplier) / 365
      const finalValue = amount * Math.pow(1 + dailyRate, days)
      const profit = finalValue - amount
      
      // Cálculo de IR baseado no período
      let irRate = 0.225 // 22.5% para até 180 dias
      if (days > 720) irRate = 0.15
      else if (days > 360) irRate = 0.175
      else if (days > 180) irRate = 0.20
      
      const taxes = profit * irRate
      const netProfit = profit - taxes
      const profitability = (netProfit / amount) * 100

      setResult({
        initialValue: amount,
        finalValue,
        profit,
        taxes,
        netProfit,
        profitability
      })
      setLoading(false)
    }, 1200)
  }

  const simulators = {
    cdb: {
      title: 'Simulador CDB Básico',
      description: 'Calcule o rendimento de um CDB com base na taxa CDI',
      icon: '💰',
      color: 'border-green-500 bg-green-500/10'
    },
    'cdb-ipo': {
      title: 'Simulador CDB + IPO',
      description: 'Combine CDB com investimento em IPO para diversificar',
      icon: '📈',
      color: 'border-blue-500 bg-blue-500/10'
    },
    'cdb-ipo-inflation': {
      title: 'Simulador CDB + IPO + Inflação',
      description: 'Análise completa considerando o impacto da inflação',
      icon: '📊',
      color: 'border-yellow-500 bg-yellow-500/10'
    }
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            <span className="gradient-text">Simuladores</span> de Investimento
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Projete seus investimentos com precisão. Calculate rendimentos, impostos 
            e ganhos reais considerando diferentes cenários de mercado.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Seletor de Simuladores */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-white mb-6">Escolha o Simulador</h2>
            <div className="space-y-4">
              {Object.entries(simulators).map(([key, sim]) => (
                <button
                  key={key}
                  onClick={() => setActiveSimulator(key as any)}
                  className={`w-full text-left trading-card border-2 transition-all ${
                    activeSimulator === key ? sim.color : 'border-gray-700'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-4">{sim.icon}</span>
                    <div>
                      <h3 className="font-bold text-white mb-1">{sim.title}</h3>
                      <p className="text-sm text-gray-300">{sim.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Informações do Mercado */}
            <div className="mt-8 trading-card">
              <h3 className="font-bold text-white mb-4">📊 Dados de Mercado</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">CDI Atual:</span>
                  <span className="text-green-400">11,75% a.a.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">SELIC:</span>
                  <span className="text-green-400">11,75% a.a.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">IPCA (12m):</span>
                  <span className="text-yellow-400">5,2% a.a.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Formulário e Resultado */}
          <div className="lg:col-span-2">
            <div className="trading-card">
              <h2 className="text-2xl font-bold text-white mb-6">
                {simulators[activeSimulator].title}
              </h2>

              {/* Formulário */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Valor Inicial (R$) *
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    placeholder="Ex: 10000"
                    className="input-trader"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Período (meses) *
                  </label>
                  <input
                    type="number"
                    value={formData.period}
                    onChange={(e) => handleInputChange('period', e.target.value)}
                    placeholder="Ex: 12"
                    className="input-trader"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Taxa CDI (% a.a.)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.cdiRate}
                    onChange={(e) => handleInputChange('cdiRate', e.target.value)}
                    className="input-trader"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    CDB (% do CDI)
                  </label>
                  <input
                    type="number"
                    value={formData.cdbRate}
                    onChange={(e) => handleInputChange('cdbRate', e.target.value)}
                    placeholder="Ex: 110"
                    className="input-trader"
                  />
                </div>

                {activeSimulator !== 'cdb' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Valor em IPO (R$)
                      </label>
                      <input
                        type="number"
                        value={formData.ipoAmount}
                        onChange={(e) => handleInputChange('ipoAmount', e.target.value)}
                        placeholder="Ex: 5000"
                        className="input-trader"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Retorno IPO (%)
                      </label>
                      <input
                        type="number"
                        value={formData.ipoReturn}
                        onChange={(e) => handleInputChange('ipoReturn', e.target.value)}
                        placeholder="Ex: 25"
                        className="input-trader"
                      />
                    </div>
                  </>
                )}

                {activeSimulator === 'cdb-ipo-inflation' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Taxa de Inflação (% a.a.)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.inflationRate}
                      onChange={(e) => handleInputChange('inflationRate', e.target.value)}
                      className="input-trader"
                    />
                  </div>
                )}
              </div>

              <button
                onClick={calculateSimulation}
                disabled={loading}
                className="btn-primary w-full py-4 text-lg font-semibold disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="spinner mr-3"></div>
                    Calculando...
                  </div>
                ) : (
                  'Calcular Investimento'
                )}
              </button>

              {/* Resultado */}
              {result && (
                <div className="mt-8 p-6 bg-gray-800 rounded-lg">
                  <h3 className="text-xl font-bold text-white mb-6">📈 Resultado da Simulação</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="metric-card">
                      <div className="text-sm text-gray-400 mb-1">Valor Inicial</div>
                      <div className="text-2xl font-bold text-white">
                        R$ {result.initialValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>

                    <div className="metric-card">
                      <div className="text-sm text-gray-400 mb-1">Valor Final</div>
                      <div className="text-2xl font-bold metric-positive">
                        R$ {result.finalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>

                    <div className="metric-card">
                      <div className="text-sm text-gray-400 mb-1">Lucro Bruto</div>
                      <div className="text-2xl font-bold metric-positive">
                        R$ {result.profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>

                    <div className="metric-card">
                      <div className="text-sm text-gray-400 mb-1">Imposto de Renda</div>
                      <div className="text-2xl font-bold metric-negative">
                        R$ {result.taxes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>

                    <div className="metric-card">
                      <div className="text-sm text-gray-400 mb-1">Lucro Líquido</div>
                      <div className="text-2xl font-bold metric-positive">
                        R$ {result.netProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>

                    <div className="metric-card">
                      <div className="text-sm text-gray-400 mb-1">Rentabilidade</div>
                      <div className="text-2xl font-bold metric-positive">
                        {result.profitability.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
