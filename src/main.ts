import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'auth.v1',
      protoPath: 'node_modules/@walkcat/contracts/proto/auth.proto',
      url: config.getOrThrow<string>('AUTH_GRPC_URL'),
      loader: {
        keepCase: false,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
      },
    },
  });

  
  console.log(`Auth service is running on ${config.getOrThrow<string>('AUTH_GRPC_URL')}`);
  await app.startAllMicroservices();
  await app.init();
}
bootstrap();
