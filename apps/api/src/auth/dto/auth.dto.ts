import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { Role } from '../../security/enums';

export class RegisterRequest {
  @ApiProperty({ type: String, example: 'new.user@example.test' }) @IsEmail() email!: string;
  @ApiProperty({ type: String, minLength: 12, example: 'Correct-Horse-47!' }) @IsString() @MinLength(12) @MaxLength(128) password!: string;
  @ApiProperty({ type: String, minLength: 2, example: 'New User' }) @IsString() @MinLength(2) @MaxLength(120) displayName!: string;
}

export class LoginRequest {
  @ApiProperty({ type: String, example: 'new.user@example.test' }) @IsEmail() email!: string;
  @ApiProperty({ type: String, example: 'Correct-Horse-47!' }) @IsString() @MinLength(1) @MaxLength(128) password!: string;
}

export class RefreshRequest {
  @ApiProperty({ type: String, example: 'session-id.secret' }) @IsString() @MinLength(20) refreshToken!: string;
}

export class SessionSummary {
  @ApiProperty({ type: String, example: 'session_demo_001' }) id!: string;
  @ApiProperty({ type: String, format: 'date-time' }) createdAt!: string;
  @ApiProperty({ type: String, format: 'date-time' }) expiresAt!: string;
}

export class AuthUserDto {
  @ApiProperty({ type: String, example: 'user_demo_001' }) id!: string;
  @ApiProperty({ type: String, example: 'New User' }) displayName!: string;
  @ApiProperty({ type: String, example: 'ne***@example.test' }) maskedEmail!: string;
  @ApiProperty({ enum: Role, enumName: 'Role', example: Role.CONSUMER }) role!: Role;
}

export class AuthResponse {
  @ApiProperty({ type: String, description: 'Short-lived JWT access token.' }) accessToken!: string;
  @ApiProperty({ type: String, description: 'Opaque rotating refresh token. Store securely.' }) refreshToken!: string;
  @ApiProperty({ type: Number, example: 900 }) expiresIn!: number;
  @ApiProperty({ type: AuthUserDto }) user!: AuthUserDto;
  @ApiProperty({ type: SessionSummary }) session!: SessionSummary;
}

export class CurrentUserResponse {
  @ApiProperty({ type: AuthUserDto }) user!: AuthUserDto;
  @ApiProperty({ type: SessionSummary }) session!: SessionSummary;
}

export class LogoutResponse { @ApiProperty({ type: Boolean, example: true }) loggedOut!: boolean; }

export class AuthErrorDetail {
  @ApiProperty({ type: String, example: 'AUTH_INVALID_CREDENTIALS' }) code!: string;
  @ApiProperty({ type: String, example: 'Invalid email or password.' }) message!: string;
}

export class ErrorMetaDto {
  @ApiProperty({ type: String, example: 'request-001' }) correlationId!: string;
  @ApiProperty({ type: String, format: 'date-time' }) timestamp!: string;
  @ApiProperty({ type: String, example: '/auth/login' }) path!: string;
}

export class AuthErrorResponse {
  @ApiProperty({ type: Boolean, example: false }) success!: boolean;
  @ApiProperty({ type: AuthErrorDetail }) error!: AuthErrorDetail;
  @ApiProperty({ type: ErrorMetaDto }) meta!: ErrorMetaDto;
}

export class SuccessMetaDto {
  @ApiProperty({ type: String, example: 'request-001' }) correlationId!: string;
  @ApiProperty({ type: String, format: 'date-time' }) timestamp!: string;
}

export class AuthSuccessResponse {
  @ApiProperty({ type: Boolean, example: true }) success!: boolean;
  @ApiProperty({ type: AuthResponse }) data!: AuthResponse;
  @ApiProperty({ type: SuccessMetaDto }) meta!: SuccessMetaDto;
}

export class CurrentUserSuccessResponse {
  @ApiProperty({ type: Boolean, example: true }) success!: boolean;
  @ApiProperty({ type: CurrentUserResponse }) data!: CurrentUserResponse;
  @ApiProperty({ type: SuccessMetaDto }) meta!: SuccessMetaDto;
}

export class LogoutSuccessResponse {
  @ApiProperty({ type: Boolean, example: true }) success!: boolean;
  @ApiProperty({ type: LogoutResponse }) data!: LogoutResponse;
  @ApiProperty({ type: SuccessMetaDto }) meta!: SuccessMetaDto;
}
