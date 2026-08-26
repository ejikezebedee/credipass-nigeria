import { PrismaClient, Role, ConsentStatus, RiskRecommendation, ReportRequestStatus } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = [
    { id: 'consumer_demo_001', emailMasked: 'co***@example.test', displayNameMasked: 'Consumer Demo', role: Role.CONSUMER },
    { id: 'sme_demo_001', emailMasked: 'sm***@example.test', displayNameMasked: 'SME Demo', role: Role.SME },
    { id: 'lender_demo_001', emailMasked: 'le***@example.test', displayNameMasked: 'Lender Demo', role: Role.LENDER },
    { id: 'admin_demo_001', emailMasked: 'ad***@example.test', displayNameMasked: 'Admin Demo', role: Role.ADMIN }
  ];
  for (const user of users) await prisma.user.upsert({ where: { id: user.id }, update: user, create: user });
  await prisma.riskEvaluation.upsert({ where: { id: 'risk_demo_001' }, update: {}, create: { id: 'risk_demo_001', subjectId: 'consumer_demo_001', recommendation: RiskRecommendation.REVIEW_RECOMMENDED, rationaleCode: 'DEMO_INSUFFICIENT_HISTORY' } });
  await prisma.creditPassport.upsert({ where: { id: 'passport_demo_001' }, update: {}, create: { id: 'passport_demo_001', subjectId: 'consumer_demo_001', consentStatus: ConsentStatus.GRANTED, maskedIdentityReference: '***-***-4821' } });
  await prisma.reportRequest.upsert({ where: { id: 'report_demo_001' }, update: {}, create: { id: 'report_demo_001', requesterId: 'lender_demo_001', status: ReportRequestStatus.PENDING, purposeCode: 'DEMO_CREDIT_REVIEW' } });
}
main().finally(() => prisma.$disconnect());
