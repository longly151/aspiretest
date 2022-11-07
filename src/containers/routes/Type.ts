import { SwitchScreens } from '@routes';
import BottomTabScreens from '@screens/Main';
import DebitCardScreens from '@screens/Main/DebitCard';

export type ScreenName =
  | keyof typeof SwitchScreens
  | keyof typeof BottomTabScreens
  | keyof typeof DebitCardScreens;
