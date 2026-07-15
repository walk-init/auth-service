import { Injectable } from '@nestjs/common';
import { SendOTPRequest, SendOTPResponse } from '@walkcat/contracts/gen/auth';
import { AuthRepository } from './auth.repository';
import { Account } from '@prisma/generated/client';
import { OtpService } from '@/modules/otp/otp.service';

@Injectable()
export class AuthService {
    public constructor(private readonly authRepository: AuthRepository, private readonly otpService: OtpService) {}
    public async sendOtp(data: SendOTPRequest): Promise<SendOTPResponse> {
        const { identifier, type } = data;
        let account: Account | null;

        if (type === "phone") {
            account = await this.authRepository.findUserByPhoneNumber(identifier);
        }
        else {
            account = await this.authRepository.findUserByEmail(identifier);
        }
        if (!account) {
            account = await this.authRepository.createAccountOtp({
                phone: type === "phone" ? identifier : undefined,
                email: type === "email" ? identifier : undefined,
            })
        };
        const code = await this.otpService.sendOtp(identifier, type as 'phone' | 'email'); 
        console.log(`Code sent to ${identifier} with code ${code}`);
        return { ok: true };
    }
}
