import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS apenas para o frontend local
  app.enableCors({
    origin: ['http://localhost:5099'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });

  // Configurar validação global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Configurar Swagger para documentação da API
  const config = new DocumentBuilder()
    .setTitle('InvestSim Pro API')
    .setDescription('API para simulações de investimento e conteúdo educacional')
    .setVersion('1.0')
    .addTag('articles', 'Operações relacionadas aos artigos')
    .addTag('simulation', 'Simulações de investimento')
    .addTag('market', 'Dados de mercado e cotações')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 5098;
  const host = process.env.HOST || 'localhost';
  await app.listen(port, host);
  
  console.log(`🚀 InvestSim Pro API rodando em http://${host}:${port}`);
  console.log(`📚 Documentação disponível em http://${host}:${port}/api/docs`);
  console.log(`🔒 Aceita requisições apenas de http://localhost:5099`);
}

bootstrap();
