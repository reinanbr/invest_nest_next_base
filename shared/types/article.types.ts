// Interfaces para os artigos educacionais
export interface ArticleMetadata {
  id: number;
  title: string;
  slug: string;
  date: string;
  thumbUrl: string;
  description?: string;
  tags?: string[];
  readTime?: number; // em minutos
}

export interface Article extends ArticleMetadata {
  content: string;
}

export interface ArticlesIndex {
  articles: ArticleMetadata[];
  lastUpdated: string;
}
