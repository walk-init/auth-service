import { Injectable } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { RpcStatus } from '@walkcat/common/dist/enums'
import { createHash } from 'crypto'

import { RedisService } from '@/infrastructure/redis/redis.service'

@Injectable()
export class OtpService {
	constructor(private readonly redisService: RedisService) {}

	public async sendOtp(
		identifier: string,
		type: 'phone' | 'email'
	): Promise<string> {
		const { code, hash } = this.generateOtpCode()
		await this.redisService.set(
			`otp:${type}:${identifier}`,
			hash,
			'EX',
			60 * 5
		)

		return code
	}

	public async verifyOtp(
		identifier: string,
		type: 'phone' | 'email',
		code: string
	): Promise<void> {
		const storedHash = await this.redisService.get(
			`otp:${type}:${identifier}`
		)
		if (!storedHash) {
			throw new RpcException({
				code: RpcStatus.NOT_FOUND,
				details: 'Invalid or expired code'
			})
		}
		const incomingHash = createHash('sha256').update(code).digest('hex')
		if (storedHash !== incomingHash) {
			throw new RpcException({
				code: RpcStatus.NOT_FOUND,
				details: 'Invalid code'
			})
		}
		await this.redisService.del(`otp:${type}:${identifier}`)
	}

	private generateOtpCode(): { code: string; hash: string } {
		const code = Math.floor(100000 + Math.random() * 900000).toString()
		const hash = createHash('sha256').update(code).digest('hex')
		return { code, hash }
	}
}
