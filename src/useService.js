/*
 * File: useService.js
 * Project: @barteh/react-withservice
 * File Created: Wednesday, 16th October 2019 6:22:33 am
 * Author: rafat (ahadrt@gmail.com)
 * -----
 * Last Modified: Wednesday, 16th October 2019 6:22:35 am
 * Modified By: rafat (ahadrt@gmail.com>)
 * -----
 * Copyright 2018 - 2019 Borna Mehr Fann, Borna Mehr Fann
 * Trademark barteh
 */

/**
  * @class
  * @classdesc return type of useService
  *
  */

import {useState, useEffect} from 'react';
class AUseServiceReturnType {
    /**
     *
     * @param {string} status , can be "loading" | "error" | "ready"
     * @param {any} data an object or primitives return from servic
     * @param {number} error contains http error codes like 404 or 500 ...
     * @param {function} retry a function can do retry geting data for service
     */
    constructor(_status, _data, _error, _retry) {
        this.status = _status;
        this.data = _data;
        this.error = _error;
        this.retry = _retry;
    }

    status;
    data;
    error;
    retry;
    toArray() {
        return [this.status, this.data, this.error, this.retry]
    }
}

/**
 * @param {AsService} service
 * @param  {any[]} params
 * @returns {AUseServiceReturnType} {status, data, error, retry}
 * @description Custom react hook for using ASService. 2 deferent mode of return can be used
 * 1-{status, data, error, retry}=useService(...)
 * 2-[status, data, error, retry]=useService(...).toArray()
 *
 */
export default function useService(service, ...params) {

    if (service === undefined) 
        throw new Error("service cant be undefined in useService");
    
    function retry() {
        setRet(new AUseServiceReturnType("loading"));
       return service.refresh(...params);
    }

    const [ret,
        setRet] = useState(new AUseServiceReturnType("loading"));
    useEffect(() => {

        let sub,
            errorsub;

        function handleChangeDone(data) {
            setRet(new AUseServiceReturnType("ready", data,undefined,retry));
        }
        function handleChangeError(error) {
            setRet(new AUseServiceReturnType("error", undefined, error, retry));
        }
        sub = service
            .Observable(...params)
            .subscribe(handleChangeDone);
        errorsub = service
            .ErrorObservable(...params)
            .subscribe(handleChangeError);

        const getData = async() => {
            await service.get(...params);
        }

        getData();
        return (ee) => {
            console.log(78, ee);
            setRet({status: "loading"})
            if (sub) 
                sub.unsubscribe();
            if (errorsub) 
                errorsub.unsubscribe();
            };
    }, [...params]);

    return ret;

}
