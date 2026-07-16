import { Injectable } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { Account } from '@prisma/generated/client'
import { RpcStatus } from '@walkcat/common/dist/enums'
import type {
	SendOTPRequest,
	SendOTPResponse,
	VerifyOTPRequest,
	VerifyOTPResponse
} from '@walkcat/contracts/gen/auth'

import { OtpService } from '@/modules/otp/otp.service'

import { AuthRepository } from './auth.repository'

@Injectable()
export class AuthService {
	public constructor(
		private readonly authRepository: AuthRepository,
		private readonly otpService: OtpService
	) {}

	public async sendOtp(data: SendOTPRequest): Promise<SendOTPResponse> {
		const { identifier, type } = data
		let account: Account | null

		if (type === 'phone') {
			account =
				await this.authRepository.findUserByPhoneNumber(identifier)
		} else {
			account = await this.authRepository.findUserByEmail(identifier)
		}
		if (!account) {
			account = await this.authRepository.createAccountOtp({
				phone: type === 'phone' ? identifier : undefined,
				email: type === 'email' ? identifier : undefined
			})
		}
		const code = await this.otpService.sendOtp(
			identifier,
			type as 'phone' | 'email'
		)
		console.log(`Code sent to ${identifier} with code ${code}`)
		return { ok: true }
	}

	public async verifyOtp(data: VerifyOTPRequest) {
		const { identifier, type, code } = data

		await this.otpService.verifyOtp(
			identifier,
			type as 'phone' | 'email',
			code
		)

		let account: Account | null

		if (type === 'phone') {
			account =
				await this.authRepository.findUserByPhoneNumber(identifier)
		} else {
			account = await this.authRepository.findUserByEmail(identifier)
		}
		if (!account) {
			throw new RpcException({
				code: RpcStatus.NOT_FOUND,
				details: 'Account not found'
			})
		}
		if (type === 'phone' && !account.isPhoneVerified) {
			await this.authRepository.updateAccount(account.id, {
				isPhoneVerified: true
			})
		}
		if (type === 'email' && !account.isEmailVerified) {
			await this.authRepository.updateAccount(account.id, {
				isEmailVerified: true
			})
		}
		return { accessToken: 'accessToken', refreshToken: 'refreshToken' }
	}
}
