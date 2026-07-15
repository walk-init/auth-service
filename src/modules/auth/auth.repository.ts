import { Injectable } from '@nestjs/common'
import { Account } from '@prisma/generated/client'
import {
	AccountCreateInput,
	AccountUpdateInput
} from '@prisma/generated/models'

import { PrismaService } from '@/infrastructure/prisma/prisma.service'

@Injectable()
export class AuthRepository {
	public constructor(private readonly prisma: PrismaService) {}

	public async findUserByPhoneNumber(
		phoneNumber: string
	): Promise<Account | null> {
		return this.prisma.account.findUnique({
			where: {
				phone: phoneNumber
			}
		})
	}

	public async findUserByEmail(email: string): Promise<Account | null> {
		return this.prisma.account.findUnique({
			where: {
				email: email
			}
		})
	}

	public async createAccountOtp(data: AccountCreateInput): Promise<Account> {
		return this.prisma.account.create({
			data
		})
	}

	public async updateAccount(
		id: string,
		data: AccountUpdateInput
	): Promise<Account> {
		return this.prisma.account.update({
			where: { id },
			data
		})
	}
}
