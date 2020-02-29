import { AsService } from '@barteh/as-service';

export  {default} from './lib/with-service';
export  *  from './lib/with-service';
export {default as useService} from "./lib/useService"
export {default as useAction} from "./lib/useAction"


declare type TServiceStatus='error' | 'ready' | 'loading';

declare function useService(service:AsService,...params:Array<any>):[status:TServiceStatus,data:any,error:any,retry:(void=>void)];

declare type TActionStatus='idle' | 'busy' | 'error';
declare function useAction(service:AsService,...params:Array<any>):[status:TActionStatus,data:any,error:any,run:(any=>any)];
