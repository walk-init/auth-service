import { registerAs } from '@nestjs/config'

import { validateEnvironmentVariables } from '@/shared/utils/env'

import { DatabaseInterface } from '../interfaces/database-interface'
import { DatabaseValidator } from '../validators/database.validator'

export const DATABASE_ENV = registerAs<DatabaseInterface>('database', () => {
	const env = validateEnvironmentVariables<DatabaseValidator>(
		process.env,
		DatabaseValidator
	)
	return {
		DATABASE_USER: env.DATABASE_USER,
		DATABASE_PASSWORD: env.DATABASE_PASSWORD,
		DATABASE_HOST: env.DATABASE_HOST,
		DATABASE_PORT: env.DATABASE_PORT,
		DATABASE_NAME: env.DATABASE_NAME
	}
})
