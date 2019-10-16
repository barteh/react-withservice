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
import {useState,useEffect} from 'react';
export function useAction(action, ...params) {

    const [ret,
        setRet] = useState({status: "idle",run});


    if (action === undefined) 
        throw new Error("action can not  be undefined in useService");
    function run() {
        setRet({status: "running"});
        action(...params).then(data => {
            handleChangeDone(data);
        }).catch(error => {
            handleChangeError(error)
        })
    }
    function retry() {
        
        run();

    }
    
    function handleChangeDone(data) {
        setRet({status: "done", data,run});
    }
    function handleChangeError(error) {
        setRet({status: "error", error, retry});
    }

    useEffect(() => {

        // const getData = async() => {
        //     await action(...params);
        // }

        // const result = getData();
        // result.then(d=>{
        //     ha
        // })
        // console.log(120, result);

        return () => {

            setRet({status: "done"})
        };

    }, []);

    return ret;

}
