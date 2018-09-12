import React, {Component} from 'react';
import Rx from 'rxjs';

import {AsService} from '@barteh/as-service';

/**
 *injects services into react component
 no need to subscribe or unsubscribe
 * @param {an object contains services and actions} srvs
 */
export const withService = (srvs) => Comp => {

    return class extends Component {

        sub = null;
        data = {};
        actions = {};
        services = {};
        state = {};
        lastProps = {};

        notRequireSubscriptions = [];

        constructor(props) {
            super(props);
            this.retry = this
                .retry
                .bind(this);
        }
        retry() {
            this.setServices(this.props);
        }
        compareParams(a, b) {
            return JSON.stringify(a) === JSON.stringify(b);
        }
        unmounted = false;
        componentWillUnmount() {
            this.unmounted = true;
            if (this.sub) 
                this.sub.unsubscribe();
            
            this.lastProps = {};

        }

        setServices(props) {

            this
                .notRequireSubscriptions
                .map(a => a.unsubscribe());

            this.notRequireSubscriptions = [];

            if (srvs.services === undefined) 
                return;
            this.canRender = true;
            if (this.sub) 
                this.sub.unsubscribe();
            
            const names = [];
            const observables = [];
            const notRequireObservables = [];

            const requiredNames = [];
            const notRequireNames = [];

            const errorObservables = [];
            this.traceServices = [];

            const keys = Object.keys(srvs.services);
            const ready = new Array(keys.length);

            keys.map((a, i) => {

                names.push(a);
                const srv = srvs.services[a];

                const source = srv.source !== undefined
                    ? srv.source
                    : srv;
                const service = (source !== undefined && source.$$isAsService)
                    ? source
                    : new AsService(source);

                const params = srv.params
                    ? srv.params(props)
                    : [];

                if (srv.isRequire) {
                    requiredNames.push(a);
                    observables.push(service.Observable(...params));
                } else {
                    notRequireNames.push(a);
                    notRequireObservables.push(service.Observable(...params));
                }
                errorObservables.push(service.ErrorObservable(...params));

                ready[i] = (!srv.isRequire || service.getState(...params) !== 'start');

                let trace = false;
                if (!this.compareParams(this.lastProps[a], params)) {

                    if (!srv.onBeforeCall || (srv.onBeforeCall && srv.onBeforeCall(props))) {

                        trace = srv.reload;
                        const Fn = (srv.reload)
                            ? service.load
                            : service.get;

                        Fn
                            .call(service, ...params)
                            .then(b => {
                                if (srv.onAfterCall) {
                                    ready[i] = true;
                                    srv.onAfterCall(props, b);
                                }
                                return b;
                            })
                            .catch(e => {
                                if (srv.onError) {
                                    ready[i] = false;
                                    srv.onError(e, props);
                                }
                                this.lastProps[a] = [];
                                if (!this.unmounted) 
                                    this.setState({error: true});
                                return e;
                            });

                    }
                }
                this
                    .traceServices
                    .push(trace);

                this.lastProps[a] = props;
                return "";
            });

            ready.map(a => {
                this.canRender = this.canRender && a;
                return false;
            })

            if (this.canRender) {
                if (!this.unmounted) 
                    this.setState({canRender: true})
            }

            notRequireObservables.map((b, j) => {
                this
                    .notRequireSubscriptions
                    .push(b.subscribe(c => {
                        if (!this.unmounted) 
                            this.setState({
                                [notRequireNames[j]]: c
                            });
                        
                        return "";
                    }));
                return "";
            });

            this.sub = Rx
                .Observable
                .combineLatest(...observables)
                .subscribe(a => {

                    let o = {
                        canRender: true
                    };
                    a.map((b, i) => {
                        o[requiredNames[i]] = b;

                        return "";
                    });

                    o["error"] = false;
                    if (!this.unmounted) 
                        this.setState(o);

                    }
                )

        }

        UNSAFE_componentWillReceiveProps(nextProps) {

            this.setServices(nextProps);
            return;

        }

        afterfifo = [];
        canRender = false;

        UNSAFE_componentWillMount() {

            this.lastProps = {};
            const {services, actions} = srvs;
            let outstate = {
                services: {}

            };

            for (let ser in services) {
                outstate.services[ser] = services[ser].service;
            }

            this.services = outstate.services;
            if (actions !== undefined) {
                for (let act in actions) {

                    const action = actions[act];

                    action.service = action.action !== undefined
                        ? action.action
                        : action;

                    const fn = (...params) => {
                        // if (action.service.$$isAsService) {     let ret = action         .service
                        // .load         .call(action.service, ...params)         .then(a => {       if
                        // (action.onAfterCall)                 action.onAfterCall(a);    return a;
                        // })         .catch(e => {             if (action.onError) action.onError(e);
                        //           return e;         }); return ret; } else

                        if (typeof action.service === "function" || action.service.$$isAsService) {
                            return new Promise((res, rej) => {
                                try {

                                    const func = action.service.$$isAsService
                                        ? action
                                            .service
                                            .getLoader()
                                        : action.service;
                                    const mapper = action.service.$$isAsService
                                        ? action
                                            .service
                                            .getMapper()
                                        : undefined;
                                    const beforMapper = func.call(action.service, ...params);

                                    const retval = mapper
                                        ? mapper(...params)
                                        : beforMapper;

                                    if (retval instanceof Promise) {

                                        retval.then(a => {

                                            res(a);
                                            if (action.onAfterCall) {

                                                action.onAfterCall(a);
                                            }
                                            
                                        }).catch(e => {

                                            rej(e);
                                            if (action.onError) 
                                                action.onError(e);
                                          
                                        });
                                        
                                    } else {
                                        res(retval);

                                        
                                    }

                                } catch (e) {
                                    if (action.onError) 
                                        action.onError(e)
                                    rej(e);
                                    
                                }

                            })

                        } else {
                            return new Promise((res, rej) => {
                                try {
                                    res(action.service);

                                    if (action.onAfterCall) 
                                        action.onAfterCall(action.service);
                                    
                                    

                                } catch (e) {
                                    rej(e);
                                    if (action.onError) 
                                        action.onError(e)
                                    
                                }
                            })
                        }
                    }
                    const fn2 = fn.bind(action);

                    outstate[act] = fn2;

                }
            }

            this.setServices(this.props);
            if (!this.unmounted) 
                this.setState(outstate);

            }
        
        render() {

            return (
                <React.Fragment>
                    {(this.state.error && srvs.error !== undefined) && <srvs.error retry={this.retry} {...this.props}/>}
                    {(!this.state.error && !this.state.canRender && srvs.loading !== undefined) && <srvs.loading/>}
                    {(this.state.canRender && !this.state.error) && <Comp {...this.props} {...this.state}/>}
                </React.Fragment>
            );
        }
    }

}

export default withService;
