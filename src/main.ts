import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Expense API')
    .setDescription(
      '<h2>Documentação para o uso da API de Despesas</h2><h5>Autor: Bernardo Domingues (<a href="https://github.com/BernardoDomingues" target="_blank">GitHub</a>, <a href="https://www.linkedin.com/in/bernardo-domingues14" target="_blank">LinkedIn</a>)</h5><h5>Repositório do Projeto: <a href="https://github.com/BernardoDomingues/expenses" target="_blank">GitHub</a></h5><p>API escrita em <a href="https://docs.nestjs.com/" target="_blank">NestJs</a></p>',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        name: 'Authorization',
        type: 'http',
        description: 'Escreva o Token para obter acesso ás rotas:',
        in: 'header',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document);

  await app.listen(+process.env.APP_PORT);
}
bootstrap();
