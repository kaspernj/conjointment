import * as React from 'react';

import { ConjointmentViewProps } from './Conjointment.types';

export default function ConjointmentView(props: ConjointmentViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
