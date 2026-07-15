import { Injectable, Logger, type OnModuleDestroy,  type OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';


@Injectable()
export class RedisService extends Redis implements OnModuleInit, OnModuleDestroy {

    private readonly logger = new Logger(RedisService.name);

    public constructor(private readonly configService: ConfigService){
        super(
            {
                password: configService.getOrThrow<string>('REDIS_PASSWORD'),
                host: configService.getOrThrow<string>('REDIS_HOST'),
                port: configService.getOrThrow<number>('REDIS_PORT'),
                maxRetriesPerRequest: 5,
                enableOfflineQueue: true,
                lazyConnect: true,
            }
        );
        this.on('ready', () => this.logger.log('Redis ready'));
        this.on('error', (err) => this.logger.error('Redis error', err));
        this.on('close', () => this.logger.warn('Redis connection closed'));
        this.on('reconnecting', () => this.logger.warn('Redis reconnecting...'));
    }



    public async onModuleInit(): Promise<void> {
        this.logger.log('Connecting to Redis...');
        try {
          await this.connect();
          this.logger.log('Redis connected');
        } catch (error) {
          this.logger.error('Failed to connect to Redis', error);
          throw error;
        }
      }

      public async onModuleDestroy(): Promise<void> {
        this.logger.log('Disconnecting from Redis...');
        try {
          await this.quit();
          this.logger.log('Redis disconnected');
        } catch (error) {
          this.logger.error('Failed to disconnect from Redis', error);
        }
      }
}
