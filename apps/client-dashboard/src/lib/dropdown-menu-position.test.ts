import { getDropdownFixedStyle } from '@gateflow/ui';

describe('getDropdownFixedStyle', () => {
  const rect = {
    top: 100,
    bottom: 132,
    left: 800,
    right: 832,
    width: 32,
    height: 32,
  };

  it('pins align=end menus to the trigger without relying on overflow parents', () => {
    expect(
      getDropdownFixedStyle(rect, {
        align: 'end',
        side: 'bottom',
        sideOffset: 8,
        viewportWidth: 1200,
      })
    ).toEqual({
      position: 'fixed',
      top: 140,
      right: 368,
    });
  });

  describe('left side positioning', () => {
    it('aligns to start (top of trigger)', () => {
      expect(
        getDropdownFixedStyle(rect, {
          align: 'start',
          side: 'left',
          sideOffset: 8,
          viewportWidth: 1200,
        })
      ).toEqual({
        position: 'fixed',
        right: 408,
        top: 100,
      });
    });

    it('aligns to center (middle of trigger)', () => {
      expect(
        getDropdownFixedStyle(rect, {
          align: 'center',
          side: 'left',
          sideOffset: 8,
          viewportWidth: 1200,
        })
      ).toEqual({
        position: 'fixed',
        right: 408,
        top: 116,
        transform: 'translateY(-50%)',
      });
    });

    it('aligns to end (bottom of trigger)', () => {
      expect(
        getDropdownFixedStyle(rect, {
          align: 'end',
          side: 'left',
          sideOffset: 8,
          viewportWidth: 1200,
        })
      ).toEqual({
        position: 'fixed',
        right: 408,
        top: 132,
        transform: 'translateY(-100%)',
      });
    });
  });

  describe('right side positioning', () => {
    it('aligns to start (top of trigger)', () => {
      expect(
        getDropdownFixedStyle(rect, {
          align: 'start',
          side: 'right',
          sideOffset: 8,
          viewportWidth: 1200,
        })
      ).toEqual({
        position: 'fixed',
        left: 840,
        top: 100,
      });
    });

    it('aligns to center (middle of trigger)', () => {
      expect(
        getDropdownFixedStyle(rect, {
          align: 'center',
          side: 'right',
          sideOffset: 8,
          viewportWidth: 1200,
        })
      ).toEqual({
        position: 'fixed',
        left: 840,
        top: 116,
        transform: 'translateY(-50%)',
      });
    });

    it('aligns to end (bottom of trigger)', () => {
      expect(
        getDropdownFixedStyle(rect, {
          align: 'end',
          side: 'right',
          sideOffset: 8,
          viewportWidth: 1200,
        })
      ).toEqual({
        position: 'fixed',
        left: 840,
        top: 132,
        transform: 'translateY(-100%)',
      });
    });
  });
});
