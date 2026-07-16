import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class RedisValidator {
	@IsString()
	@IsNotEmpty()
	public REDIS_USERNAME: string
	@IsString()
	@IsNotEmpty()
	public REDIS_HOST: string
	@IsNumber()
	@IsNotEmpty()
	public REDIS_PORT: number
	@IsString()
	@IsNotEmpty()
	public REDIS_PASSWORD: string
}
