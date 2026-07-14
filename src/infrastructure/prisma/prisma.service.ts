import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client/extension';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy{

    private readonly logger = new Logger(PrismaService.name);

   public async onModuleInit() {
    this.logger.log('Connecting to database...');
    try {
      await this.$connect();
    } catch (error) {
      this.logger.error('Failed to connect to database', error);
      throw error;
    } finally {
      this.logger.log('Database connected');
    }
  }

   public async onModuleDestroy() {
    this.logger.log('Disconnecting from database...');
    try {
      await this.$disconnect();
    } catch (error) {
      this.logger.error('Failed to disconnect from database', error);
      throw error;
    } finally {
      this.logger.log('Disconnected from database');
    }
  }
}
