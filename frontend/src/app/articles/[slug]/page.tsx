'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'

interface Article {
  id: string
  title: string
  content: string
  slug: string
  date: string
  category: string
  author: string
  readTime: number
  tags: string[]
}

export default function ArticlePage() {
  const params = useParams()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([])

  useEffect(() => {
    if (params.slug) {
      // Mock data baseado no slug - substituir pela chamada real à API
      const mockArticles: Record<string, Article> = {
        'introducao-cdb': {
          id: '1',
          title: 'Introdução aos CDBs: Guia Completo para Iniciantes',
          content: `
            <div class="prose prose-invert max-w-none">
              <h2>O que é um CDB?</h2>
              <p>O Certificado de Depósito Bancário (CDB) é um dos investimentos mais populares no Brasil. Trata-se de um título de renda fixa emitido por bancos para captar recursos.</p>
              
              <h2>Como funciona?</h2>
              <p>Quando você investe em um CDB, está emprestando dinheiro ao banco. Em troca, o banco paga uma remuneração (juros) pelo período do empréstimo.</p>
              
              <h2>Tipos de CDB</h2>
              <ul>
                <li><strong>CDB Prefixado:</strong> Taxa de juros definida no momento da aplicação</li>
                <li><strong>CDB Pós-fixado:</strong> Rendimento atrelado a índices como CDI ou SELIC</li>
                <li><strong>CDB Híbrido:</strong> Parte prefixada + parte pós-fixada</li>
              </ul>
              
              <h2>Vantagens dos CDBs</h2>
              <ul>
                <li>Segurança (garantidos pelo FGC até R$ 250.000)</li>
                <li>Diversidade de prazos e rendimentos</li>
                <li>Liquidez (alguns permitem resgate antecipado)</li>
                <li>Rentabilidade superior à poupança</li>
              </ul>
              
              <h2>Tributação</h2>
              <p>Os CDBs seguem a tabela regressiva de Imposto de Renda:</p>
              <ul>
                <li>Até 180 dias: 22,5%</li>
                <li>De 181 a 360 dias: 20%</li>
                <li>De 361 a 720 dias: 17,5%</li>
                <li>Acima de 720 dias: 15%</li>
              </ul>
            </div>
          `,
          slug: 'introducao-cdb',
          date: '2024-01-15',
          category: 'CDB',
          author: 'InvestSim Pro',
          readTime: 8,
          tags: ['CDB', 'Renda Fixa', 'Iniciantes', 'Segurança']
        },
        'ipo-investimento': {
          id: '2',
          title: 'IPO: Como Investir em Ofertas Públicas Iniciais',
          content: `
            <div class="prose prose-invert max-w-none">
              <h2>O que é um IPO?</h2>
              <p>IPO (Initial Public Offering) ou Oferta Pública Inicial é o processo pelo qual uma empresa privada se torna pública, oferecendo suas ações ao público pela primeira vez.</p>
              
              <h2>Como Participar de um IPO</h2>
              <ol>
                <li><strong>Conta em Corretora:</strong> Tenha uma conta em uma corretora de valores</li>
                <li><strong>Análise da Empresa:</strong> Estude o prospecto da empresa</li>
                <li><strong>Reserva de Valores:</strong> Reserve o valor desejado durante o período de oferta</li>
                <li><strong>Rateio:</strong> Se houver excesso de demanda, haverá rateio</li>
              </ol>
              
              <h2>Análise de IPOs</h2>
              <h3>Pontos Importantes a Avaliar:</h3>
              <ul>
                <li>Modelo de negócio da empresa</li>
                <li>Histórico financeiro</li>
                <li>Mercado de atuação</li>
                <li>Perspectivas de crescimento</li>
                <li>Qualidade da gestão</li>
                <li>Preço de oferta vs. valor justo</li>
              </ul>
              
              <h2>Riscos dos IPOs</h2>
              <ul>
                <li><strong>Volatilidade:</strong> Preços podem variar muito nos primeiros dias</li>
                <li><strong>Informações limitadas:</strong> Empresa nova no mercado</li>
                <li><strong>Lock-up:</strong> Grandes acionistas podem vender após período de carência</li>
                <li><strong>Performance:</strong> Muitos IPOs têm performance inferior no primeiro ano</li>
              </ul>
            </div>
          `,
          slug: 'ipo-investimento',
          date: '2024-01-12',
          category: 'IPO',
          author: 'InvestSim Pro',
          readTime: 12,
          tags: ['IPO', 'Ações', 'Ofertas Públicas', 'Renda Variável']
        }
      }

      setTimeout(() => {
        const foundArticle = mockArticles[params.slug as string]
        setArticle(foundArticle || null)
        setLoading(false)
      }, 600)
    }
  }, [params.slug])

  if (loading) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center py-12">
            <div className="spinner mx-auto"></div>
            <p className="text-gray-400 mt-4">Carregando artigo...</p>
          </div>
        </div>
      </main>
    )
  }

  if (!article) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📄</div>
            <h1 className="text-2xl font-bold text-white mb-4">Artigo não encontrado</h1>
            <p className="text-gray-400 mb-8">O artigo que você está procurando não existe ou foi removido.</p>
            <Link href="/articles" className="btn-primary">
              Ver todos os artigos
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-white">Início</Link>
          <span>•</span>
          <Link href="/articles" className="hover:text-white">Artigos</Link>
          <span>•</span>
          <span className="text-white">{article.title}</span>
        </nav>

        {/* Article Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              article.category === 'CDB' ? 'bg-green-600 text-white' :
              article.category === 'IPO' ? 'bg-blue-600 text-white' :
              'bg-gray-600 text-white'
            }`}>
              {article.category}
            </span>
            <span className="text-gray-400 text-sm">
              {new Date(article.date).toLocaleDateString('pt-BR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <span className="text-gray-400 text-sm">•</span>
            <span className="text-gray-400 text-sm">{article.readTime} min de leitura</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {article.title}
          </h1>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">IS</span>
              </div>
              <div>
                <div className="text-white font-medium">{article.author}</div>
                <div className="text-gray-400 text-sm">Especialista em Investimentos</div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
              </button>
              <button className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <div 
          className="article-content mb-12 text-gray-300 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Tags */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold text-white mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm hover:bg-gray-700 cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8 border-t border-gray-700">
          <Link href="/articles" className="flex items-center text-blue-400 hover:text-blue-300">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar aos artigos
          </Link>
          
          <Link href="/simulators" className="btn-primary">
            Testar Simuladores
          </Link>
        </div>
      </div>
    </main>
  )
}
