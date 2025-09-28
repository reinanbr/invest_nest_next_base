import './globals.css'
import { Inter, JetBrains_Mono } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata = {
  title: 'InvestSim Pro - Simulador de Investimentos',
  description: 'Plataforma completa para simulação de investimentos, educação financeira e análise de mercado.',
  keywords: 'investimentos, simulador, CDB, IPO, inflação, mercado financeiro',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans trader-dark`}>
        <div className="min-h-screen" style={{backgroundColor: 'var(--bg-primary)'}}>
          {children}
        </div>
      </body>
    </html>
  )
}
