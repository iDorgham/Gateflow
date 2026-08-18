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
});
