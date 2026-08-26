import {
  updateRecentGuests,
  formatExpressShareMessage,
  filterContacts,
  RecentGuest,
  ContactItem,
} from './express-widget-state';

describe('express-widget-state', () => {
  describe('updateRecentGuests', () => {
    it('adds a new guest and sets count to 1', () => {
      const initial: RecentGuest[] = [];
      const updated = updateRecentGuests(
        initial,
        { name: 'Dr. John Watson', phone: '+123456789', category: 'FRIEND' },
        5,
        new Date('2026-08-24T12:00:00Z')
      );

      expect(updated.length).toBe(1);
      expect(updated[0].name).toBe('Dr. John Watson');
      expect(updated[0].inviteCount).toBe(1);
      expect(updated[0].lastInvitedAt).toBe('2026-08-24T12:00:00.000Z');
    });

    it('increments inviteCount and moves existing guest to the top', () => {
      const initial: RecentGuest[] = [
        {
          name: 'Sherlock Holmes',
          phone: '+111',
          category: 'FRIEND',
          inviteCount: 3,
          lastInvitedAt: '2026-08-20T10:00:00Z',
        },
        {
          name: 'Irene Adler',
          phone: '+222',
          category: 'FAMILY',
          inviteCount: 1,
          lastInvitedAt: '2026-08-22T10:00:00Z',
        },
      ];

      const now = new Date('2026-08-24T15:00:00Z');
      const updated = updateRecentGuests(
        initial,
        { name: 'Sherlock Holmes' },
        5,
        now
      );

      expect(updated.length).toBe(2);
      expect(updated[0].name).toBe('Sherlock Holmes');
      expect(updated[0].inviteCount).toBe(4);
      expect(updated[0].lastInvitedAt).toBe('2026-08-24T15:00:00.000Z');
    });

    it('caps list at maxCount', () => {
      const initial: RecentGuest[] = [
        { name: 'G1', inviteCount: 1, lastInvitedAt: '2026-08-20T10:00:00Z' },
        { name: 'G2', inviteCount: 1, lastInvitedAt: '2026-08-21T10:00:00Z' },
        { name: 'G3', inviteCount: 1, lastInvitedAt: '2026-08-22T10:00:00Z' },
      ];

      const updated = updateRecentGuests(
        initial,
        { name: 'G4' },
        3,
        new Date('2026-08-24T10:00:00Z')
      );

      expect(updated.length).toBe(3);
      expect(updated[0].name).toBe('G4');
    });
  });

  describe('formatExpressShareMessage', () => {
    it('formats English share invite message', () => {
      const msg = formatExpressShareMessage({
        guestName: 'Alex',
        hostName: 'Sarah Jenkins',
        compoundName: 'Palm Hills Estate',
        unitNumber: 'Villa 104',
        shortUrl: 'https://gateflow.site/s/pass-123',
        language: 'en',
      });

      expect(msg).toContain(
        'Hi Alex, Sarah Jenkins has sent you an access pass'
      );
      expect(msg).toContain('Palm Hills Estate (Unit: Villa 104)');
      expect(msg).toContain('https://gateflow.site/s/pass-123');
    });

    it('formats Arabic share invite message', () => {
      const msg = formatExpressShareMessage({
        guestName: 'أحمد',
        hostName: 'سارة',
        compoundName: 'بالم هيلز',
        unitNumber: 'فيلا 104',
        shortUrl: 'https://gateflow.site/s/pass-123',
        language: 'ar',
      });

      expect(msg).toContain(
        'مرحباً أحمد، يسر سارة دعوتك لزيارة بالم هيلز (وحدة: فيلا 104)'
      );
      expect(msg).toContain('تصريح الدخول الرقمي الخاص بك');
    });
  });

  describe('filterContacts', () => {
    const CONTACTS: ContactItem[] = [
      { id: '1', name: 'Karim Mansour', phone: '+201001234567' },
      { id: '2', name: 'Layla Hassan', phone: '+201119876543' },
      { id: '3', name: 'Omar Youssef', phone: '+201225556677' },
    ];

    it('filters by name substring', () => {
      const result = filterContacts(CONTACTS, 'layla');
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Layla Hassan');
    });

    it('filters by phone digits', () => {
      const result = filterContacts(CONTACTS, '55566');
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Omar Youssef');
    });
  });
});
