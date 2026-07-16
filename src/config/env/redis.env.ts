import { registerAs } from '@nestjs/config'

import { validateEnvironmentVariables } from '@/shared/utils/env'

import { RedisInterface } from '../interfaces/redis.interface'
import { RedisValidator } from '../validators/redis.validator'

export const REDIS_ENV = registerAs<RedisInterface>('redis', () => {
	const env = validateEnvironmentVariables<RedisValidator>(
		process.env,
		RedisValidator
	)
	return {
		REDIS_USERNAME: env.REDIS_USERNAME,
		REDIS_HOST: env.REDIS_HOST,
		REDIS_PORT: env.REDIS_PORT,
		REDIS_PASSWORD: env.REDIS_PASSWORD
	}
})
