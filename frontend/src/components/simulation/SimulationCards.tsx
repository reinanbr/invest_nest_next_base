'use client'

export function SimulationCards() {
  const simulations = [
    {
      title: 'CDB Básico',
      description: 'Simulação simples de CDB com cálculo de rendimento e imposto de renda',
      icon: '💰',
      color: 'border-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'CDB + IPO',
      description: 'Combinação de CDB com análise de IPO para diversificação',
      icon: '📈',
      color: 'border-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'CDB + IPO + Inflação',
      description: 'Análise completa incluindo impacto inflacionário nos retornos',
      icon: '📊',
      color: 'border-yellow-500',
      bgColor: 'bg-yellow-500/10'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {simulations.map((sim, index) => (
        <div 
          key={index} 
          className={`trading-card border-2 ${sim.color} ${sim.bgColor} cursor-pointer group`}
        >
          <div className="text-center">
            <div className="text-4xl mb-4">{sim.icon}</div>
            <h3 className="text-xl font-bold text-white mb-3">{sim.title}</h3>
            <p className="text-gray-300 mb-6">{sim.description}</p>
            <button className="btn-primary w-full group-hover:bg-blue-600">
              Iniciar Simulação
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
