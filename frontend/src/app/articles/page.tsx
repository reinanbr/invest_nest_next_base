'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'

interface Article {
  id: string
  title: string
  summary: string
  slug: string
  date: string
  thumbUrl: string
  category: string
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('todos')

  useEffect(() => {
    // Mock data - substituir pela chamada real à API
    const mockArticles: Article[] = [
      {
        id: '1',
        title: 'Introdução aos CDBs: Guia Completo para Iniciantes',
        summary: 'Aprenda tudo sobre Certificados de Depósito Bancário, desde o básico até estratégias avançadas de investimento.',
        slug: 'introducao-cdb',
        date: '2024-01-15',
        thumbUrl: '/images/cdb-thumb.jpg',
        category: 'CDB'
      },
      {
        id: '2',
        title: 'IPO: Como Investir em Ofertas Públicas Iniciais',
        summary: 'Descubra como participar de IPOs, analisar empresas que abrem capital e os riscos envolvidos.',
        slug: 'ipo-investimento',
        date: '2024-01-12',
        thumbUrl: '/images/ipo-thumb.jpg',
        category: 'IPO'
      },
      {
        id: '3',
        title: 'O Impacto da Inflação nos Seus Investimentos',
        summary: 'Entenda como a inflação afeta diferentes tipos de investimentos e como se proteger.',
        slug: 'inflacao-impacto',
        date: '2024-01-10',
        thumbUrl: '/images/inflacao-thumb.jpg',
        category: 'Inflação'
      },
      {
        id: '4',
        title: 'Diversificação: CDB + IPO na Sua Carteira',
        summary: 'Estratégias para combinar a segurança dos CDBs com o potencial de crescimento dos IPOs.',
        slug: 'diversificacao-cdb-ipo',
        date: '2024-01-08',
        thumbUrl: '/images/diversificacao-thumb.jpg',
        category: 'Estratégia'
      },
      {
        id: '5',
        title: 'Análise de Risco: Avaliando Investimentos',
        summary: 'Ferramentas e metodologias para avaliar o risco de diferentes investimentos.',
        slug: 'analise-risco',
        date: '2024-01-05',
        thumbUrl: '/images/risco-thumb.jpg',
        category: 'Análise'
      }
    ]
    
    setTimeout(() => {
      setArticles(mockArticles)
      setLoading(false)
    }, 800)
  }, [])

  const categories = ['todos', 'CDB', 'IPO', 'Inflação', 'Estratégia', 'Análise']

  const filteredArticles = selectedCategory === 'todos' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory)

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            <span className="gradient-text">Artigos</span> Educacionais
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Aprenda sobre investimentos com nossos guias especializados em CDB, IPO, 
            inflação e estratégias de mercado escritos por especialistas.
          </p>
        </div>

        {/* Filtros de Categoria */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="spinner mx-auto"></div>
            <p className="text-gray-400 mt-4">Carregando artigos...</p>
          </div>
        )}

        {/* Articles Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <Link 
                key={article.id} 
                href={`/articles/${article.slug}`}
                className="group"
              >
                <article className="trading-card h-full flex flex-col">
                  {/* Thumbnail */}
                  <div className="aspect-video bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg mb-6 overflow-hidden flex items-center justify-center">
                    <span className="text-4xl">
                      {article.category === 'CDB' ? '💰' : 
                       article.category === 'IPO' ? '📈' : 
                       article.category === 'Inflação' ? '📊' : 
                       article.category === 'Estratégia' ? '🎯' : '📋'}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs px-3 py-1 rounded-full ${
                        article.category === 'CDB' ? 'bg-green-600' :
                        article.category === 'IPO' ? 'bg-blue-600' :
                        article.category === 'Inflação' ? 'bg-yellow-600' :
                        article.category === 'Estratégia' ? 'bg-purple-600' : 'bg-gray-600'
                      } text-white font-medium`}>
                        {article.category}
                      </span>
                      <span className="text-sm text-gray-400">
                        {new Date(article.date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    
                    <h2 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                      {article.title}
                    </h2>
                    
                    <p className="text-gray-300 mb-6 flex-1">
                      {article.summary}
                    </p>
                    
                    <div className="flex items-center text-blue-400 font-medium group-hover:text-blue-300">
                      Ler artigo
                      <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-white mb-2">Nenhum artigo encontrado</h3>
            <p className="text-gray-400">Tente selecionar uma categoria diferente.</p>
          </div>
        )}
      </div>
    </main>
  )
}
