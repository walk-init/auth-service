import { registerAs } from '@nestjs/config'

import { validateEnvironmentVariables } from '@/shared/utils'

import { GrpcInterface } from '../interfaces/grpc.interface'
import { GrpcValidator } from '../validators'

export const GRPC_ENV = registerAs<GrpcInterface>('grpc', () => {
	const env = validateEnvironmentVariables(process.env, GrpcValidator)
	return {
		host: env.GRPC_HOST,
		port: env.GRPC_PORT
	}
})
