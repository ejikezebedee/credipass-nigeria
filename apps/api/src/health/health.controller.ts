import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthDto, HealthResponseDto } from './health.dto';

@ApiTags('system')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Check API process health' })
  @ApiOkResponse({ type: HealthResponseDto, description: 'API process is healthy.' })
  health(): HealthDto { return { status: 'ok', service: 'credipass-api', version: '0.1.0' }; }
}
