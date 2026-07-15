import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import type {
	SendOTPRequest,
	SendOTPResponse,
	VerifyOTPRequest,
	VerifyOTPResponse
} from '@walkcat/contracts/gen/auth'

import { AuthService } from './auth.service'

@Controller()
export class AuthController {
	public constructor(private readonly authService: AuthService) {}

	@GrpcMethod('AuthService', 'SendOTP')
	public async sendOtp(request: SendOTPRequest): Promise<SendOTPResponse> {
		return this.authService.sendOtp(request)
	}
	@GrpcMethod('AuthService', 'VerifyOTP')
	public async verifyOtp(
		request: VerifyOTPRequest
	): Promise<VerifyOTPResponse> {
		return this.authService.verifyOtp(request)
	}
}
