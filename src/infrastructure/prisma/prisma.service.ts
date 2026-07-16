import {
	Injectable,
	Logger,
	OnModuleDestroy,
	OnModuleInit
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/generated/client'

import { type AllConfigs } from '@/config/interfaces/all-configs.interface'
import { type DatabaseInterface } from '@/config/interfaces/database-interface'

@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
	private readonly logger = new Logger(PrismaService.name)

	public constructor(
		private readonly configService: ConfigService<AllConfigs>
	) {
		const {
			DATABASE_USER,
			DATABASE_PASSWORD,
			DATABASE_HOST,
			DATABASE_PORT,
			DATABASE_NAME
		} = configService.getOrThrow<DatabaseInterface>('database', {
			infer: true
		})
		const adapter = new PrismaPg({
			user: DATABASE_USER,
			password: DATABASE_PASSWORD,
			host: DATABASE_HOST,
			port: DATABASE_PORT,
			database: DATABASE_NAME
		})
		super({
			adapter
		})
	}

	public async onModuleInit() {
		this.logger.log('Connecting to database...')
		try {
			await this.$connect()
		} catch (error) {
			this.logger.error('Failed to connect to database', error)
			throw error
		} finally {
			this.logger.log('Database connected')
		}
	}

	public async onModuleDestroy() {
		this.logger.log('Disconnecting from database...')
		try {
			await this.$disconnect()
		} catch (error) {
			this.logger.error('Failed to disconnect from database', error)
			throw error
		} finally {
			this.logger.log('Disconnected from database')
		}
	}
}
