/*
 * File: useAction.js
 * Project: @barteh/react-withservice
 * File Created: Wednesday, 16th October 2019 6:28:44 am
 * Author: rafat (ahadrt@gmail.com)
 * -----
 * Last Modified: Wednesday, 16th October 2019 6:28:48 am
 * Modified By: rafat (ahadrt@gmail.com>)
 * -----
 * Copyright 2018 - 2019 Borna Mehr Fann, Borna Mehr Fann
 * Trademark barteh
 */
import {useState, useEffect} from 'react';
/**
  * @class
  * @classdesc return type of useAction
  *
  */
 class AUseActionReturnType {
    /**
     *
     * @param {string} _status , can be "idle" | "busy" | "error"
     * @param {any} _data an object or primitives return from servic
     * @param {number} _error contains http error codes like 404 or 500 ...
     * @param {function} _run a function can do run or retry geting data for Action
     */
    constructor(_status, _data, _error, _run) {
        this.status = _status;
        this.data = _data;
        this.error = _error;
        this.run = _run;
    }
    status;
    data;
    error;
    run;
    toArray() {
        return [this.status, this.data, this.error, this.run]
    }
}

/**
 * @description a react hook serves a action as fromis return function with state
 * @param {function} action promise return
 * @param  {...any} params
 * @returns {AUseActionReturnType} {status, data, error, retry}
 * @description 2 deferent mode of return can be used
 * 1-{status, data, error, retry}=useService(...)
 * 2-[status, data, error, retry]=useService(...).toArray()
 */
 export function useAction(action, ...params) {

    const [ret,
        setRet] = useState(new AUseActionReturnType( "idle",undefined,undefined,run));
    if (action === undefined) 
        throw new Error("action can not  be undefined in useService");
    function run(...otehrParams) {
        if(ret.status!=="idle"){
            handleChangeError(5000);
            return;
        }
        setRet(new AUseActionReturnType( "busy",undefined,undefined,run));
        const pars = otehrParams.length>0
            ? otehrParams
            : params;

       return action(...pars).then(data => {
            handleChangeDone(data);
        }).catch(error => {
            handleChangeError(error)
        })
    }
  

    function handleChangeDone(data) {
        setRet(new AUseActionReturnType("idle",data,undefined,run));
    }
    function handleChangeError(error) {
        setRet(new  AUseActionReturnType("error",undefined,error,run));
    }

    useEffect(() => {
        return () => {
            setRet(new  AUseActionReturnType("idle",undefined,undefined,run))
        };

    }, [...params]);

    return ret;

}
