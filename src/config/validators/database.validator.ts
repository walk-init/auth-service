import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class DatabaseValidator {
	@IsString()
	@IsNotEmpty()
	public DATABASE_USER: string
	@IsString()
	@IsNotEmpty()
	public DATABASE_PASSWORD: string
	@IsString()
	@IsNotEmpty()
	public DATABASE_HOST: string
	@IsNumber()
	@IsNotEmpty()
	public DATABASE_PORT: number
	@IsString()
	@IsNotEmpty()
	public DATABASE_NAME: string
}
