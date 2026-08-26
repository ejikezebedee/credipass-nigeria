import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MaskedIdentityDto {
  @ApiProperty({ type: String, example: 'consumer_demo_001' }) subjectId!: string;
  @ApiProperty({ type: String, example: 'Ade*** Oko***' }) maskedFullName!: string;
  @ApiPropertyOptional({ type: String, example: '***-***-4821', description: 'Masked identity reference only; never a raw BVN or NIN.' }) maskedIdentityReference?: string;
  @ApiProperty({ type: String, example: '+234******890' }) maskedPhone!: string;
  @ApiProperty({ type: String, example: 'ad***@example.test' }) maskedEmail!: string;
}
