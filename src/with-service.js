import React, {Component} from 'react';
import Rx from 'rxjs';

import {withRouter} from 'react-router-dom';
import {AsService} from '@barteh/as-service';


/**
 *injects services into react component
 no need to subscribe or unsubscribe
 * @param {an object contains services and actions} srvs
 */
export const withService = (srvs) => Comp => {
    //return withRouter(
      return  class extends Component {

        sub = null;
        data = {};
        actions = {};
        services = {};
        state = {};
        lastProps = {};

        constructor(props) {
            super(props);
            this.refresh = this
                .refresh
                .bind(this);
        }
        refresh() {
            this.setServices(this.props);
        }
        compareParams(a, b) {
            return JSON.stringify(a) === JSON.stringify(b);
        }

        componentWillUnmount() {
            if (this.sub) 
                this.sub.unsubscribe();
            
            this.lastProps = {};

        }

        setServices(props) {

            this.canrender = false;
            if (this.sub) 
                this.sub.unsubscribe();
            
            const names = [];
            const observables = [];
            const errorObservables = [];
            this.traceServices = [];
            Object
                .keys(srvs.services)
                .map(a => {

                    names.push(a);
                    const srv = srvs.services[a];

                    const service = srv.service instanceof AsService
                        ? srv.service
                        : new AsService(srv.service);
                    const params = srv.params
                        ? srv.params(props)
                        : [];

                    observables.push(service.Observable(...params));
                    errorObservables.push(service.ErrorObservable(...params));

                    let trace = false;
                    if (!this.compareParams(this.lastProps[a], params)) {
                        console.log(77777777, this.lastProps[a], params)
                        if (!srv.onBeforeCall || (srv.onBeforeCall && srv.onBeforeCall(props))) {

                            trace = srv.reload;
                            const Fn = srv.reload
                                ? service.load
                                : service.get;

                            Fn
                                .call(service, ...params)
                                .then(b => {
                                    if (srv.onAfterCall) 
                                        srv.onAfterCall(props);
                                    }
                                )
                                .catch(e => {
                                    if (srv.onError) 
                                        srv.onError(e, props);
                                    
                                    this.lastProps[a] = [];
                                    this.setState({error: true});
                                });

                        }
                    }
                    this
                        .traceServices
                        .push(trace);

                    this.lastProps[a] = props;
                    return "";
                });

            this.canrender = true;
            this
                .traceServices
                .map(c => this.canrender = this.canrender && c)

            // this.errorSub = Rx     .Observable     .combineLatest(...errorObservables)
            // .subscribe(e => {         this.setState({error: true})     })

            this.sub = Rx
                .Observable
                .combineLatest(...observables)
                .subscribe(a => {

                    let o = {}
                    a.map((b, i) => {
                        o[names[i]] = b;

                        return "";
                    })
                    this.canrender = true;
                    o["error"] = false;
                    this.setState(o);

                })

        }

        componentWillReceiveProps(nextProps) {

            this.setServices(nextProps);
            return;

        }

        afterfifo = [];
        canrender = false;
        // shouldComponentUpdate(nextProps, nextState) {     return this.canrender; }

        componentWillMount() {

            this.lastProps = {};
            const {services, actions} = srvs;
            let outstate = {
                services: {}

            };

            for (let ser in services) {
                outstate.services[ser] = services[ser].service;
            }

            this.services = outstate.services;

            for (let act in actions) {
                const action = actions[act];
                console.log(709, action);

                const fn = (...params) => {
                    if (action.service instanceof AsService) {
                        return action
                            .service
                            .load
                            .call(action.service, ...params)
                            .then(a => {
                                if (action.onAfterCall) 
                                    action.onAfterCall(a);
                                return a;
                            })
                            .catch(e => {
                                if (action.onError) 
                                    action.onError(e)
                            });
                    } else if (typeof action.service) {
                        return action
                            .service
                            .call(action.service, ...params)
                    } else {
                        return (...params) => action.service
                    }
                }
                outstate[act] = fn;
                action
                    .service
                    .load
                    .bind(action);

            }

            //this.actions[act]=actions[act].service;
            this.setServices(this.props);

            this.setState(outstate);

        }

        render() {

            return (
                <div>
                    {!this.state.error &&  <Comp {...this.props} {...this.state}/>}
                </div>
            );
        }
    }
//)
}

export default withService;
