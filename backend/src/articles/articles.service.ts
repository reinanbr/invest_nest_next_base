import { Injectable, NotFoundException } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

// Importar tipos diretamente do diretório shared
interface ArticleMetadata {
  id: number;
  title: string;
  slug: string;
  date: string;
  thumbUrl: string;
  description?: string;
  tags?: string[];
  readTime?: number;
}

interface Article extends ArticleMetadata {
  content: string;
}

interface ArticlesIndex {
  articles: ArticleMetadata[];
  lastUpdated: string;
}

@Injectable()
export class ArticlesService {
  private readonly dataPath = join(process.cwd(), 'data');
  private readonly articlesIndexPath = join(this.dataPath, 'articles.json');
  private readonly contentPath = join(this.dataPath, 'content');

  /**
   * Busca todos os artigos (metadados apenas)
   */
  async getAllArticles(): Promise<ArticleMetadata[]> {
    try {
      const indexContent = await fs.readFile(this.articlesIndexPath, 'utf-8');
      const articlesIndex: ArticlesIndex = JSON.parse(indexContent);
      return articlesIndex.articles;
    } catch (error) {
      console.error('Erro ao ler índice de artigos:', error);
      throw new NotFoundException('Não foi possível carregar a lista de artigos');
    }
  }

  /**
   * Busca um artigo específico pelo slug (incluindo conteúdo HTML)
   */
  async getArticleBySlug(slug: string): Promise<Article> {
    try {
      // Primeiro busca os metadados
      const articles = await this.getAllArticles();
      const articleMeta = articles.find(article => article.slug === slug);
      
      if (!articleMeta) {
        throw new NotFoundException(`Artigo com slug '${slug}' não encontrado`);
      }

      // Depois busca o conteúdo HTML
      const contentFilePath = join(this.contentPath, `${slug}.html`);
      const htmlContent = await fs.readFile(contentFilePath, 'utf-8');

      return {
        ...articleMeta,
        content: htmlContent,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(`Erro ao ler artigo ${slug}:`, error);
      throw new NotFoundException(`Erro ao carregar o artigo '${slug}'`);
    }
  }

  /**
   * Busca artigos por tags
   */
  async getArticlesByTags(tags: string[]): Promise<ArticleMetadata[]> {
    const allArticles = await this.getAllArticles();
    
    return allArticles.filter(article => 
      article.tags && article.tags.some(tag => tags.includes(tag))
    );
  }

  /**
   * Busca os artigos mais recentes
   */
  async getRecentArticles(limit: number = 5): Promise<ArticleMetadata[]> {
    const allArticles = await this.getAllArticles();
    
    return allArticles
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }
}
