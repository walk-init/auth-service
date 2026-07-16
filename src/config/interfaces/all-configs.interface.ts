import { DatabaseInterface } from './database-interface'
import { GrpcInterface } from './grpc.interface'
import { RedisInterface } from './redis.interface'

export interface AllConfigs {
	grpc: GrpcInterface
	database: DatabaseInterface
	redis: RedisInterface
}
