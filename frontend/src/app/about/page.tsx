'use client'

import { Navbar } from '@/components/layout/Navbar'
import Link from 'next/link'

export default function AboutPage() {
  const features = [
    {
      icon: '🧮',
      title: 'Simuladores Avançados',
      description: 'Três tipos de simulação: CDB básico, CDB + IPO, e análise completa com inflação.'
    },
    {
      icon: '📚',
      title: 'Conteúdo Educacional',
      description: 'Artigos especializados sobre investimentos, escritos por especialistas do mercado.'
    },
    {
      icon: '📊',
      title: 'Dados de Mercado',
      description: 'Informações atualizadas sobre CDI, SELIC, IPCA e principais indicadores.'
    },
    {
      icon: '🔒',
      title: 'Segurança',
      description: 'Todos os cálculos são baseados em metodologias reconhecidas do mercado financeiro.'
    },
    {
      icon: '📱',
      title: 'Interface Moderna',
      description: 'Design responsivo com tema profissional inspirado em plataformas de trading.'
    },
    {
      icon: '🎯',
      title: 'Foco Educacional',
      description: 'Ferramenta desenvolvida para ensinar conceitos de investimento de forma prática.'
    }
  ]

  const technologies = [
    { name: 'Next.js 14', description: 'Framework React para frontend' },
    { name: 'NestJS', description: 'Framework Node.js para backend' },
    { name: 'TypeScript', description: 'Tipagem estática para JavaScript' },
    { name: 'Tailwind CSS', description: 'Framework CSS utilitário' },
    { name: 'Sistema de Arquivos', description: 'Armazenamento sem banco de dados' },
    { name: 'RESTful API', description: 'API documentada com Swagger' }
  ]

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Sobre o <span className="gradient-text">InvestSim Pro</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Uma plataforma educacional completa para simulação de investimentos, 
            desenvolvida para ensinar conceitos de CDB, IPO e análise inflacionária 
            de forma prática e intuitiva.
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Nossa Missão</h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                O InvestSim Pro nasceu da necessidade de democratizar o conhecimento sobre 
                investimentos no Brasil. Nosso objetivo é fornecer uma ferramenta educacional 
                que permita aos usuários compreender, na prática, como funcionam diferentes 
                modalidades de investimento.
              </p>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Através de simuladores precisos e conteúdo educacional de qualidade, 
                capacitamos investidores iniciantes e intermediários a tomar decisões 
                mais conscientes sobre seus investimentos.
              </p>
              <Link href="/simulators" className="btn-primary inline-flex items-center">
                Experimentar Simuladores
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            <div className="trading-card">
              <div className="text-center">
                <div className="text-6xl mb-6">🎯</div>
                <h3 className="text-xl font-bold text-white mb-4">Educação Financeira</h3>
                <p className="text-gray-300">
                  Transformamos conceitos complexos de investimento em experiências 
                  práticas e compreensíveis para todos os níveis de conhecimento.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Funcionalidades Principais
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="trading-card text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Technology Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Tecnologias Utilizadas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technologies.map((tech, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-blue-400 mb-2">{tech.name}</h3>
                <p className="text-gray-300 text-sm">{tech.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Methodology Section */}
        <section className="mb-16">
          <div className="trading-card">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Metodologia dos Cálculos
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-green-400 mb-4">CDB - Certificado de Depósito Bancário</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Cálculo baseado na taxa CDI vigente</li>
                  <li>• Aplicação da tabela regressiva de IR</li>
                  <li>• Consideração do percentual de CDI oferecido</li>
                  <li>• Juros compostos com capitalização diária</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-blue-400 mb-4">IPO - Ofertas Públicas Iniciais</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Simulação de retorno percentual</li>
                  <li>• Análise de diversificação de portfólio</li>
                  <li>• Comparação com investimentos de renda fixa</li>
                  <li>• Consideração de volatilidade</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-yellow-400 mb-4">Análise Inflacionária</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Deflacionamento pelo IPCA</li>
                  <li>• Cálculo de rentabilidade real</li>
                  <li>• Preservação do poder de compra</li>
                  <li>• Projeções baseadas em dados históricos</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-purple-400 mb-4">Dados de Mercado</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Taxa CDI do Banco Central</li>
                  <li>• SELIC vigente</li>
                  <li>• IPCA acumulado em 12 meses</li>
                  <li>• Indicadores do mercado acionário</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer Section */}
        <section className="mb-16">
          <div className="bg-yellow-900/20 border border-yellow-600/50 rounded-lg p-6">
            <div className="flex items-start">
              <div className="text-2xl mr-4">⚠️</div>
              <div>
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">
                  Importante - Finalidade Educacional
                </h3>
                <div className="text-gray-300 text-sm space-y-2">
                  <p>
                    O InvestSim Pro é uma ferramenta educacional e todas as simulações 
                    são baseadas em cálculos teóricos para fins de aprendizado.
                  </p>
                  <p>
                    Os resultados apresentados não constituem recomendações de investimento 
                    e não devem ser utilizados como única base para decisões financeiras.
                  </p>
                  <p>
                    Sempre consulte um consultor financeiro qualificado antes de tomar 
                    decisões de investimento importantes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="trading-card">
            <h2 className="text-3xl font-bold text-white mb-6">
              Comece a Aprender Hoje
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Explore nossos simuladores e artigos educacionais para aprimorar 
              seus conhecimentos sobre investimentos.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link href="/simulators" className="btn-primary text-lg px-8 py-4">
                Usar Simuladores
              </Link>
              <Link href="/articles" className="btn-secondary text-lg px-8 py-4">
                Ler Artigos
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
