import { IsIP, IsNotEmpty, IsNumber, IsPort, IsString } from 'class-validator'

export class GrpcValidator {
	@IsString()
	@IsNotEmpty()
	@IsIP()
	public GRPC_HOST: string

	@IsNumber()
	@IsNotEmpty()
	public GRPC_PORT: number
}
