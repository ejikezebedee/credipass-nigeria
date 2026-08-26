import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthErrorResponse, AuthSuccessResponse, CurrentUserSuccessResponse, LoginRequest, LogoutSuccessResponse, RefreshRequest, RegisterRequest } from './dto/auth.dto';
import { AccessTokenGuard } from './guards/access-token.guard';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private readonly auth: AuthService) {}
  @Post('auth/register')
  @ApiOperation({ operationId: 'register', summary: 'Register a consumer account' })
  @ApiBody({ type: RegisterRequest })
  @ApiCreatedResponse({ type: AuthSuccessResponse })
  @ApiConflictResponse({ type: AuthErrorResponse })
  register(@Body() body: RegisterRequest, @Req() req: Request) { return this.auth.register(body, req.correlationId); }

  @Post('auth/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ operationId: 'login', summary: 'Authenticate without disclosing account existence' })
  @ApiBody({ type: LoginRequest })
  @ApiOkResponse({ type: AuthSuccessResponse })
  @ApiUnauthorizedResponse({ type: AuthErrorResponse })
  login(@Body() body: LoginRequest, @Req() req: Request) { return this.auth.login(body, req.correlationId); }

  @Post('auth/refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ operationId: 'refresh', summary: 'Rotate a refresh token and issue a new access token' })
  @ApiBody({ type: RefreshRequest })
  @ApiOkResponse({ type: AuthSuccessResponse })
  @ApiUnauthorizedResponse({ type: AuthErrorResponse })
  refresh(@Body() body: RefreshRequest, @Req() req: Request) { return this.auth.refresh(body.refreshToken, req.correlationId); }

  @Post('auth/logout') @HttpCode(HttpStatus.OK) @UseGuards(AccessTokenGuard) @ApiBearerAuth()
  @ApiOperation({ operationId: 'logout', summary: 'Revoke the current session' })
  @ApiOkResponse({ type: LogoutSuccessResponse })
  @ApiUnauthorizedResponse({ type: AuthErrorResponse })
  logout(@Req() req: Request) { return this.auth.logout(req.auth, req.correlationId); }

  @Get('me') @UseGuards(AccessTokenGuard) @ApiBearerAuth()
  @ApiOperation({ operationId: 'me', summary: 'Return the authenticated user and RBAC role' })
  @ApiOkResponse({ type: CurrentUserSuccessResponse })
  @ApiUnauthorizedResponse({ type: AuthErrorResponse })
  me(@Req() req: Request) { return this.auth.me(req.auth); }
}
