CREATE TYPE "Role" AS ENUM ('CONSUMER', 'SME_OWNER', 'BUSINESS_USER', 'COOPERATIVE_ADMIN', 'ADMIN', 'SUPER_ADMIN');
CREATE TYPE "AuditEvent" AS ENUM ('USER_REGISTERED', 'AUTHENTICATION_SUCCEEDED', 'AUTHENTICATION_FAILED', 'TOKEN_REFRESHED', 'SESSION_LOGGED_OUT', 'CONSENT_GRANTED', 'CONSENT_REVOKED', 'IDENTITY_VIEWED', 'RISK_EVALUATION_REQUESTED', 'REPORT_REQUESTED');
CREATE TYPE "ConsentStatus" AS ENUM ('PENDING', 'GRANTED', 'REVOKED', 'EXPIRED');
CREATE TYPE "RiskRecommendation" AS ENUM ('REVIEW_RECOMMENDED', 'ADDITIONAL_INFORMATION_RECOMMENDED', 'MANUAL_ASSESSMENT_RECOMMENDED');
CREATE TYPE "ReportRequestStatus" AS ENUM ('PENDING', 'READY', 'FAILED');

CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "displayName" TEXT NOT NULL,
  "role" "Role" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AuthSession" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "refreshTokenHash" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "lastRotatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "revokedAt" TIMESTAMP(3),
  CONSTRAINT "AuthSession_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AuditLog" (
  "id" TEXT NOT NULL,
  "actorId" TEXT,
  "event" "AuditEvent" NOT NULL,
  "correlationId" TEXT NOT NULL,
  "metadata" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RiskEvaluation" (
  "id" TEXT NOT NULL,
  "subjectId" TEXT NOT NULL,
  "recommendation" "RiskRecommendation" NOT NULL,
  "rationaleCode" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "RiskEvaluation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CreditPassport" (
  "id" TEXT NOT NULL,
  "subjectId" TEXT NOT NULL,
  "consentStatus" "ConsentStatus" NOT NULL,
  "maskedIdentityReference" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CreditPassport_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ReportRequest" (
  "id" TEXT NOT NULL,
  "requesterId" TEXT NOT NULL,
  "status" "ReportRequestStatus" NOT NULL DEFAULT 'PENDING',
  "purposeCode" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ReportRequest_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "AuthSession_userId_idx" ON "AuthSession"("userId");
CREATE INDEX "AuthSession_expiresAt_idx" ON "AuthSession"("expiresAt");
CREATE INDEX "AuditLog_actorId_createdAt_idx" ON "AuditLog"("actorId", "createdAt");
CREATE INDEX "AuditLog_event_createdAt_idx" ON "AuditLog"("event", "createdAt");

ALTER TABLE "AuthSession" ADD CONSTRAINT "AuthSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "RiskEvaluation" ADD CONSTRAINT "RiskEvaluation_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CreditPassport" ADD CONSTRAINT "CreditPassport_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ReportRequest" ADD CONSTRAINT "ReportRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
