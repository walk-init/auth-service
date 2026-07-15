import { Injectable } from '@nestjs/common';
import { RedisService } from '@/infrastructure/redis/redis.service';
import { createHash } from 'crypto';

@Injectable()
export class OtpService {
    constructor(private readonly redisService: RedisService) {}

    public async sendOtp(identifier: string, type: 'phone' | 'email'): Promise<string> {
        
        const { code, hash } = this.generateOtpCode();
        await this.redisService.set(`otp:${type}:${identifier}`, hash, 'EX', 60 * 5);

        return code;
    }

    private generateOtpCode(): { code: string, hash: string } {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const hash = createHash('sha256').update(code).digest('hex');
        return { code, hash };
    }
    
    
}
