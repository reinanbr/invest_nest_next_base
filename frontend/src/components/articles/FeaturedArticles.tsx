'use client'

import { useEffect, useState } from 'react'

interface Article {
  id: string
  title: string
  summary: string
  slug: string
  date: string
  thumbUrl: string
  category: string
}

export function FeaturedArticles() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Dados mockados para demonstração
    const mockArticles: Article[] = [
      {
        id: '1',
        title: 'Introdução aos CDBs: Guia Completo para Iniciantes',
        summary: 'Tudo que você precisa saber sobre Certificados de Depósito Bancário',
        slug: 'introducao-cdb',
        date: '2024-01-15',
        thumbUrl: '/images/cdb-thumb.jpg',
        category: 'CDB'
      },
      {
        id: '2',
        title: 'IPO: Como Investir em Ofertas Públicas Iniciais',
        summary: 'Estratégias e dicas para investir em ações de empresas que abrem capital',
        slug: 'ipo-investimento',
        date: '2024-01-12',
        thumbUrl: '/images/ipo-thumb.jpg',
        category: 'IPO'
      },
      {
        id: '3',
        title: 'O Impacto da Inflação nos Seus Investimentos',
        summary: 'Como proteger seu patrimônio contra a erosão inflacionária',
        slug: 'inflacao-impacto',
        date: '2024-01-10',
        thumbUrl: '/images/inflacao-thumb.jpg',
        category: 'Inflação'
      }
    ]
    
    setTimeout(() => {
      setArticles(mockArticles)
      setLoading(false)
    }, 500)
  }, [])

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="spinner mx-auto"></div>
        <p className="text-gray-400 mt-4">Carregando artigos...</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        Artigos em Destaque
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <article key={article.id} className="trading-card group cursor-pointer">
            <div className="aspect-video bg-gray-700 rounded-lg mb-4 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-2xl">{article.category === 'CDB' ? '💰' : article.category === 'IPO' ? '📈' : '📊'}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                  {article.category}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(article.date).toLocaleDateString('pt-BR')}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                {article.title}
              </h3>
              
              <p className="text-gray-300 text-sm">
                {article.summary}
              </p>
              
              <button className="text-blue-400 text-sm font-medium hover:text-blue-300">
                Ler mais →
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
