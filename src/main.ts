import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { swaggerConfiguration } from './config/swagger.config.js';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvVariables } from './config/env.schema.js';

/**
 * Punto de entrada principal de la aplicación.
 *
 * Inicializa NestJS y levanta el servidor HTTP.
 *
 * @returns {Promise<void>}
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  app.useGlobalPipes(new ValidationPipe({
    
  }));
  swaggerConfiguration(app);

  const configService = app.get<ConfigService<EnvVariables, true>>(
    ConfigService,
  );

  const host = configService.get<string>('HOST');
  const port = configService.get<number>('PORT')

  await app.listen(port, host);

  console.log(`Application running at ${await app.getUrl()}`)
}
await bootstrap();
