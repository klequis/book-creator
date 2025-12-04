import { Buttons } from '~/ui-components/buttons'
import { Colors } from '~/ui-components/colors'
import { Menu } from '~/ui-components/menu';
import { MenuMobile } from '~/ui-components/menu-mobile';

export default function UI() {
  return (
    <div>
      <h1>UI Components</h1>
      <div>
        <h2>Menu</h2>
        <Menu />
        <MenuMobile />
      </div>
      <Colors />
      <Buttons />
    </div>
  );
}