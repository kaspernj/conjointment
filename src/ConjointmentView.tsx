import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { ConjointmentViewProps } from './Conjointment.types';

const NativeView: React.ComponentType<ConjointmentViewProps> =
  requireNativeViewManager('Conjointment');

export default function ConjointmentView(props: ConjointmentViewProps) {
  return <NativeView {...props} />;
}
