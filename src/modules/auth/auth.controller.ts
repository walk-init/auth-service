import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from './auth.service';

import type { SendOTPRequest, SendOTPResponse } from "@walkcat/contracts/gen/auth";

@Controller()
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @GrpcMethod("AuthService", "SendOTP")
  public async sendOtp(request: SendOTPRequest): Promise<SendOTPResponse> {
    return this.authService.sendOtp(request);
  }
}
