import {FC, ReactNode, Context} from 'react';
import Store from './store';
import type {Obj} from '@/index';

export type IReactContext = Context<unknown>;

export interface IOptions extends Partial<IReactContext> {
  context: string;
}

export type IContext = {
  useProps: <I = unknown>(key: string) => I;
  actions: Obj;
  store?: Store;
};

export type GenericFunction = (...args: unknown[]) => unknown;

export type Actions = {
  [key: string]: GenericFunction;
};

export type ComponentProps = {
  children?: ReactNode;
  containerProps?: Obj;
};

export type WorkerProps<P> = {
  useRegisterActions: (actions?: P) => null;
  setState: <I>(key: string, value: I) => I;
  getState: <I>(key: string) => I;
  [key: string]: unknown;
};

type IFunc = (state: Obj) => void;
export type Listeners = Map<unknown, IFunc>;

export type IActions<I = unknown> = FC<WorkerProps<I>>;

export type IUseProp = <I = unknown>(
  key: string,
  context?: Context<unknown>,
) => I;

export type Params = {
  Display?: FC<any>;
  Actions?: IActions<any>;
  State?: Obj;
  children?: ReactNode;
  ReactContext?: Context<unknown>;
  storeRef?: unknown;
  name: string;
  whitelistedStateKeys?: string[];
};

export type BitBundlerComponentProps = {
  children?: ReactNode;
  state?: Obj;
  useParentProps?: boolean;
};
