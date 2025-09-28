import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ArticlesService } from './articles.service';

// Definir tipos localmente
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

@ApiTags('articles')
@Controller('api/articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os artigos' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de artigos recuperada com sucesso'
  })
  @ApiQuery({ 
    name: 'tags', 
    required: false, 
    description: 'Filtrar por tags (separadas por vírgula)' 
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    description: 'Limite de artigos retornados' 
  })
  async getAllArticles(
    @Query('tags') tags?: string,
    @Query('limit') limit?: number,
  ): Promise<ArticleMetadata[]> {
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      return this.articlesService.getArticlesByTags(tagArray);
    }

    if (limit) {
      return this.articlesService.getRecentArticles(Number(limit));
    }

    return this.articlesService.getAllArticles();
  }

  @Get('recent')
  @ApiOperation({ summary: 'Buscar artigos mais recentes' })
  @ApiResponse({ 
    status: 200, 
    description: 'Artigos recentes recuperados com sucesso' 
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    description: 'Número de artigos a retornar (padrão: 5)' 
  })
  async getRecentArticles(@Query('limit') limit?: number): Promise<ArticleMetadata[]> {
    return this.articlesService.getRecentArticles(limit ? Number(limit) : 5);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Buscar artigo por slug' })
  @ApiParam({ 
    name: 'slug', 
    description: 'Slug único do artigo' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Artigo encontrado com sucesso'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Artigo não encontrado' 
  })
  async getArticleBySlug(@Param('slug') slug: string): Promise<Article> {
    return this.articlesService.getArticleBySlug(slug);
  }
}
