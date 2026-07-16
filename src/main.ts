import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'

import { AppModule } from './app.module'
import type { AllConfigs } from './config'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	const configGrpc = app
		.get(ConfigService<AllConfigs>)
		.getOrThrow('grpc', { infer: true })

	const { host, port } = configGrpc

	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.GRPC,
		options: {
			package: 'auth.v1',
			protoPath: 'node_modules/@walkcat/contracts/proto/auth.proto',
			url: `${host}:${port}`,
			loader: {
				keepCase: false,
				longs: String,
				enums: String,
				defaults: true,
				oneofs: true
			}
		}
	})

	console.log(`Auth service is running on ${host}:${port}`)
	await app.startAllMicroservices()
	await app.init()
}
bootstrap()
