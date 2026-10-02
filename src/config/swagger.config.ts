import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export const swaggerConfiguration = (app: INestApplication): void => {
  const config = new DocumentBuilder()
    .setTitle('Restaurant Management API')
    .setDescription('API para la gestión de un restaurante y la consulta del estado del servicio.')
    .setVersion('v1.0.0')
    .addBearerAuth()
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'API Key')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
};
