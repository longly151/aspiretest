import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DebitCardScreens from '@screens/Main/DebitCard';

const Stack = createNativeStackNavigator();

export default function DebitCardStack() {
  return (
    <>
      {(Object.keys(DebitCardScreens) as any).map((key: keyof typeof DebitCardScreens) => (
        <Stack.Screen key={key} name={key} component={DebitCardScreens[key]} />
      ))}
    </>
  );
}
