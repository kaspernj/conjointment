import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to Conjointment.web.ts
// and on native platforms to Conjointment.ts
import ConjointmentModule from './ConjointmentModule';
import ConjointmentView from './ConjointmentView';
import { ChangeEventPayload, ConjointmentViewProps } from './Conjointment.types';

// Get the native constant value.
export const PI = ConjointmentModule.PI;

export function hello(): string {
  return ConjointmentModule.hello();
}

export async function setValueAsync(value: string) {
  return await ConjointmentModule.setValueAsync(value);
}

const emitter = new EventEmitter(ConjointmentModule ?? NativeModulesProxy.Conjointment);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { ConjointmentView, ConjointmentViewProps, ChangeEventPayload };
