import { ClassConstructor, plainToInstance } from 'class-transformer'
import { validateSync } from 'class-validator'

export function validateEnvironmentVariables<T extends object>(
	config: Record<string, string | undefined>,
	envVariablesClass: ClassConstructor<T>
) {
	const validatedConfig = plainToInstance(envVariablesClass, config, {
		enableImplicitConversion: true
	})

	const errors = validateSync(validatedConfig, {
		skipMissingProperties: false
	})

	if (errors.length > 0) {
		const errorMessage = errors
			.map(
				error =>
					`\nError in ${error.property}` +
					Object.values(error.constraints ?? {})
						.map((key, value) => ` - ${key}: ${value}`)
						.join('\n')
			)
			.join('\n')
		console.error(`\n${errorMessage}`)
		throw new Error(`Invalid environment variables:${errorMessage}`)
	}
	return validatedConfig
}
