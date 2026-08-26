import { PrismaClient, Role, ConsentStatus, RiskRecommendation, ReportRequestStatus } from '@prisma/client';
import * as argon2 from 'argon2';
const prisma = new PrismaClient();

async function main() {
  const passwordHash = await argon2.hash('Demo-Only-Password-47!', { type: argon2.argon2id });
  const users = [
    { id: 'consumer_demo_001', email: 'consumer@example.test', passwordHash, displayName: 'Consumer Demo', role: Role.CONSUMER },
    { id: 'sme_demo_001', email: 'sme@example.test', passwordHash, displayName: 'SME Demo', role: Role.SME_OWNER },
    { id: 'business_demo_001', email: 'business@example.test', passwordHash, displayName: 'Business Demo', role: Role.BUSINESS_USER },
    { id: 'admin_demo_001', email: 'admin@example.test', passwordHash, displayName: 'Admin Demo', role: Role.ADMIN }
  ];
  for (const user of users) await prisma.user.upsert({ where: { id: user.id }, update: user, create: user });
  await prisma.riskEvaluation.upsert({ where: { id: 'risk_demo_001' }, update: {}, create: { id: 'risk_demo_001', subjectId: 'consumer_demo_001', recommendation: RiskRecommendation.REVIEW_RECOMMENDED, rationaleCode: 'DEMO_INSUFFICIENT_HISTORY' } });
  await prisma.creditPassport.upsert({ where: { id: 'passport_demo_001' }, update: {}, create: { id: 'passport_demo_001', subjectId: 'consumer_demo_001', consentStatus: ConsentStatus.GRANTED, maskedIdentityReference: '***-***-4821' } });
  await prisma.reportRequest.upsert({ where: { id: 'report_demo_001' }, update: {}, create: { id: 'report_demo_001', requesterId: 'business_demo_001', status: ReportRequestStatus.PENDING, purposeCode: 'DEMO_CREDIT_REVIEW' } });
}
main().finally(() => prisma.$disconnect());
