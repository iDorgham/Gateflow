import {
  initAdminAssistantState,
  triggerCompoundTrafficEmulation,
  runPerimeterSecurityAudit,
  buildAdminToolCardViewModel,
} from './admin-assistant-state';
import { createAgenticToolCall } from './tool-lifecycle-engine';

describe('admin-assistant-state', () => {
  describe('initAdminAssistantState', () => {
    it('initializes clean admin assistant state', () => {
      const state = initAdminAssistantState();
      expect(state.status).toBe('ready');
      expect(state.messages).toEqual([]);
      expect(state.pendingToolCalls).toEqual([]);
    });
  });

  describe('triggerCompoundTrafficEmulation', () => {
    it('generates seeded records and batch ID for valid config', () => {
      const result = triggerCompoundTrafficEmulation({
        scenario: 'luxury-compound',
        scansCount: 150,
        pastDays: 3,
        incidentRate: 0.05,
        organizationId: 'org-palm-hills',
      });

      expect(result.success).toBe(true);
      expect(result.seededRecords).toBe(450);
      expect(result.batchId).toContain('emu-batch-');
    });

    it('throws error if organizationId is missing', () => {
      expect(() =>
        triggerCompoundTrafficEmulation({
          scenario: 'nightclub',
          scansCount: 100,
          pastDays: 1,
          incidentRate: 0.1,
          organizationId: '',
        })
      ).toThrow('TENANT_SCOPE_REQUIRED');
    });
  });

  describe('runPerimeterSecurityAudit', () => {
    it('computes health score and identifies offline gates or cameras', () => {
      const report = runPerimeterSecurityAudit('org-palm-hills', [
        {
          id: 'gate-1',
          name: 'North Gate',
          isOnline: true,
          cameraOnline: true,
          scansLastHour: 45,
        },
        {
          id: 'gate-2',
          name: 'South Service Gate',
          isOnline: false,
          cameraOnline: false,
          scansLastHour: 0,
        },
      ]);

      expect(report.offlineGatesCount).toBe(1);
      expect(report.missingStreamAlerts.length).toBe(1);
      expect(report.missingStreamAlerts[0]).toContain('South Service Gate');
      expect(report.securityHealthScore).toBe(60); // 100 - 25 - 15
    });
  });

  describe('buildAdminToolCardViewModel', () => {
    it('creates super-admin purple themed view model for emulation tools', () => {
      const call = createAgenticToolCall(
        'tc-admin-1',
        'triggerCompoundEmulation',
        {
          scenario: 'luxury-compound',
          scansCount: 200,
        }
      );

      const card = buildAdminToolCardViewModel(call);
      expect(card.titleEn).toBe('Trigger Traffic Emulation');
      expect(card.titleAr).toBe('تشغيل محاكاة حركة الدخول');
      expect(card.requiresApproval).toBe(true);
      expect(card.badgeColor).toBe('#FFAB00'); // Requires approval yellow
    });
  });
});
