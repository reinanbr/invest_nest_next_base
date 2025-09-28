'use client'

export function Hero() {
  return (
    <section className="relative bg-gradient-to-b from-gray-900 to-black py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          <span className="gradient-text">InvestSim</span>{' '}
          <span className="text-gray-300">Pro</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Simulador profissional de investimentos com análise de CDB, IPOs e impacto inflacionário
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <button className="btn-primary text-lg px-8 py-4">
            Começar Simulação
          </button>
          <button className="btn-secondary text-lg px-8 py-4">
            Ver Documentação
          </button>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="trading-card">
            <div className="text-3xl font-bold text-green-400 mb-2">CDB</div>
            <div className="text-gray-300">Simulação de Certificados de Depósito Bancário</div>
          </div>
          
          <div className="trading-card">
            <div className="text-3xl font-bold text-blue-400 mb-2">IPO</div>
            <div className="text-gray-300">Análise de Ofertas Públicas Iniciais</div>
          </div>
          
          <div className="trading-card">
            <div className="text-3xl font-bold text-yellow-400 mb-2">Inflação</div>
            <div className="text-gray-300">Impacto inflacionário nos investimentos</div>
          </div>
        </div>
      </div>
    </section>
  )
}
