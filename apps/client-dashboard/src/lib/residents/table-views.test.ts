import {
  getDefaultTableView,
  QR_COLUMN_IDS,
  QR_PINNED,
  CONTACTS_COLUMN_IDS,
  CONTACTS_PINNED,
  UNITS_COLUMN_IDS,
  UNITS_PINNED,
} from './table-views';

describe('table-views utilities', () => {
  it('generates default table view state for QR codes', () => {
    const defaultView = getDefaultTableView(QR_COLUMN_IDS, QR_PINNED);
    expect(defaultView.columnOrder).toEqual([...QR_COLUMN_IDS]);
    expect(defaultView.density).toBe('default');
    for (const key of QR_COLUMN_IDS) {
      expect(defaultView.columnVisibility[key]).toBe(true);
    }
  });

  it('contains critical pinned columns for QR codes', () => {
    expect(QR_PINNED.has('code')).toBe(true);
    expect(QR_PINNED.has('select')).toBe(true);
  });

  it('generates default table view state for Contacts and Units', () => {
    const contactsView = getDefaultTableView(
      CONTACTS_COLUMN_IDS,
      CONTACTS_PINNED
    );
    expect(contactsView.columnOrder).toEqual([...CONTACTS_COLUMN_IDS]);
    expect(CONTACTS_PINNED.has('firstName')).toBe(true);

    const unitsView = getDefaultTableView(UNITS_COLUMN_IDS, UNITS_PINNED);
    expect(unitsView.columnOrder).toEqual([...UNITS_COLUMN_IDS]);
    expect(UNITS_PINNED.has('name')).toBe(true);
  });
});
