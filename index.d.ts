import { AsService } from '@barteh/as-service';


export type TServiceStatus='error' | 'ready' | 'loading';

export function useService(service:AsService,...params:Array<any>):[TServiceStatus,any,any,(void=>void)];

export type TActionStatus='idle' | 'busy' | 'error';
export function useAction(service:AsService,...params:Array<any>):[TActionStatus,any,any,(any=>any)];
