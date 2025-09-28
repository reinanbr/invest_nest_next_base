import { Navbar } from '@/components/layout/Navbar'
import { Hero } from '@/components/home/Hero'
import { MarketTicker } from '@/components/market/MarketTicker'
import { SimulationCards } from '@/components/simulation/SimulationCards'
import { FeaturedArticles } from '@/components/articles/FeaturedArticles'
import { MarketCharts } from '@/components/market/MarketCharts'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Ticker de cotações no topo */}
      <MarketTicker />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Seção de Simuladores */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Simuladores de Investimento
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Projete seus investimentos com nossos simuladores avançados. 
            Calcule rendimentos, impostos e ganhos reais em diferentes cenários.
          </p>
        </div>
        <SimulationCards />
      </section>

      {/* Gráficos de Mercado */}
      <section className="py-16 px-4 bg-background-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Dashboard de Mercado
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Acompanhe em tempo real as principais cotações, índices e indicadores 
              do mercado financeiro brasileiro.
            </p>
          </div>
          <MarketCharts />
        </div>
      </section>

      {/* Artigos em Destaque */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Conteúdo Educacional
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Aprenda sobre investimentos com nossos artigos especializados em 
            CDB, IPO, inflação e estratégias de mercado.
          </p>
        </div>
        <FeaturedArticles />
      </section>

      {/* Footer */}
      <footer className="bg-background-card border-t border-gray-700 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            InvestSim Pro
          </h3>
          <p className="text-gray-400 mb-6">
            Sua plataforma completa para simulação e educação em investimentos
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-500">
            <span>© 2024 InvestSim Pro</span>
            <span>•</span>
            <span>Dados fornecidos apenas para fins educacionais</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
