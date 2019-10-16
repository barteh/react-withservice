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
import {useState,useEffect} from 'react';
 export default function useService(service, ...params) {

    if (service === undefined) 
        throw new Error("service cant be undefined in useService");
    
    function retry() {
        setRet({status: "loading"});
        service.refresh(...params);
    }
    const [ret,
        setRet] = useState({status: "loading"});

    useEffect(() => {

        let sub,
            errorsub;

        function handleChangeDone(data) {
            setRet({status: "ready", data});
        }
        function handleChangeError(error) {
            setRet({status: "error", error, retry});
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
        return () => {

            console.log(7654);
            setRet({status: "loading"})
            if (sub) 
                sub.unsubscribe();
            if (errorsub) 
                errorsub.unsubscribe();
            };
    }, [...params]);

    return ret;

}
