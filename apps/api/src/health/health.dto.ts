import { ApiProperty } from '@nestjs/swagger';

export class HealthDto {
  @ApiProperty({ type: String, enum: ['ok'], example: 'ok' }) status!: 'ok';
  @ApiProperty({ type: String, example: 'credipass-api' }) service!: string;
  @ApiProperty({ type: String, example: '0.1.0' }) version!: string;
}

export class ResponseMetaDto {
  @ApiProperty({ type: String, example: 'demo-request-001' }) correlationId!: string;
  @ApiProperty({ type: String, example: '2026-08-26T00:00:00.000Z' }) timestamp!: string;
}

export class HealthResponseDto {
  @ApiProperty({ type: Boolean, example: true }) success!: boolean;
  @ApiProperty({ type: () => HealthDto }) data!: HealthDto;
  @ApiProperty({ type: () => ResponseMetaDto }) meta!: ResponseMetaDto;
}
