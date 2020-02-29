import { AsService } from '@barteh/as-service';


export type TServiceStatus='error' | 'ready' | 'loading';
export type TUseServiceRetType={status:TServiceStatus,data:any,error:any,retry:()=>void};
export function useService(service:AsService,...params:Array<any>):TUseServiceRetType;

export type TActionStatus='idle' | 'busy' | 'error';
export type TUseActionRetType={status:TActionStatus,data:any,error:any,run:(...param:any[])=>any};

export function useAction(service:AsService,...params:Array<any>):TUseActionRetType;
