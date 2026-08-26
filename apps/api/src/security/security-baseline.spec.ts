import { AuditEvent, ConsentStatus, RiskRecommendation, Role } from './enums';
import { MaskedIdentityDto } from './dto/masked-identity.dto';

describe('security baseline', () => {
  it('exposes only masked identity fields', () => {
    const allowed = ['subjectId', 'maskedFullName', 'maskedIdentityReference', 'maskedPhone', 'maskedEmail'];
    const dto = Object.assign(new MaskedIdentityDto(), {
      subjectId: 'demo', maskedFullName: 'De*** User', maskedIdentityReference: '***-001', maskedPhone: '+234******001', maskedEmail: 'de***@example.test'
    });
    expect(Object.keys(dto).sort()).toEqual(allowed.sort());
    expect(Object.keys(dto)).not.toEqual(expect.arrayContaining(['bvn', 'nin', 'BVN', 'NIN']));
  });

  it('uses human-review recommendations rather than automated decisions', () => {
    expect(Object.values(RiskRecommendation).every((value) => value.includes('RECOMMENDED'))).toBe(true);
    expect(Object.values(RiskRecommendation).join(' ')).not.toMatch(/APPROV|REJECT/);
  });

  it('defines governed audit, role, and consent vocabularies', () => {
    expect(Object.keys(AuditEvent).length).toBeGreaterThan(0);
    expect(Object.values(Role)).toEqual(expect.arrayContaining(['CONSUMER', 'SME', 'LENDER', 'BUSINESS', 'ADMIN']));
    expect(Object.values(ConsentStatus)).toEqual(expect.arrayContaining(['PENDING', 'GRANTED', 'REVOKED', 'EXPIRED']));
  });
});
