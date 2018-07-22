# react-withservice
- - -

[![GitHub version](https://badge.fury.io/gh/barteh%2Freact-withservice.svg)](https://badge.fury.io/gh/barteh%2Freact-withservice) [![Build Status](https://travis-ci.org/barteh/react-withservice.svg?branch=master)](https://travis-ci.org/barteh/react-withservice)[![Coverage Status](https://coveralls.io/repos/github/barteh/react-withservice/badge.svg?branch=master)](https://coveralls.io/github/barteh/react-withservice?branch=master)

###  An HOC injects and manages observable data like rxjs and other services in a react Component

> with using this HOC we can use any data object contains simple primitive (string | Number), complex Object, a function, Promise and rxjs observables in react components.
> dont worry about subscribes and unsubscribes, this HOC automaticaly manages them.
> other hand manages services as actions by injecting directly as functions to use in component






## install 
```cmd
npm i @barteh/react-withservice --save
```

## usage in ES6
***

### import

```js
import {withService} from @barteh/react-withservice

```

### wrap a Component as HOC

```js
import React, { Component } from 'react';
import  { AsService } from '@barteh/AsService';
import Rx from "rxjs"
class Comp extends Component {
    render() {
        const {srv1,srv2,srv3,srv4,deleteUser}=this.props;
        return (
            <div>
                <div>{srv1}</div>
                <div>{srv2}</div>
                {srv3   <div>{srv3.name}</div>}
                {srv4   <div>{srv4.name}</div>}


                <button 
                    onclick={()=>deleteUser(5)}>
                    deleteUser
                </button>
            </div>
        );
    }
}

const servicesObject={
    services:{
        srv1:{
            service:9
        },
        srv2:{
            service:(a,b)=>{name:`im srv2.name: ${a}-${b}`},
            params:props=>[props.a,props.b], //mapped props to service parameter
            onAfterCall:props=>{}, //do somthing after call 
            onBeforCall:props=>true, //a blockable hook
            map:a=>a.name //mappes recieved data

        },
        srv3:{
            service:a=>Rx.Observable.of({name:`im an rxjs observable:${a}`}),
            params:props=>[props.match.x] //maps route params to service

        },
        srv4:{
            service:new Promise((res,rej)=>res({name:"im from promise"}))
        }
    },
    actions:{ // injects as functions to props
        deleteUser:new AsService(ui=>BtServer("myserversideController/deleteuser",{userid:ui}))

    }
}


export default withService(servicesObject)(Comp);



``` 


#### Auto subcbscribe/unsubscribe
> when register a service e.i. `service:(x,y)=>param*5` component automaticly subscribe to this service and will render when that parameter change. for example if `x=5,y=6` 
component will render for this params and wont subscribe for `x=5,y=1`

#### parameter mapping (params clause):
> this clause `params:props=>[props.x,props.match.params.y]` is a function, gives props as a parameter and returns series of mapped params just like service's function parameters. hoc binds this props to params and component will render and subscribe with new params.


## build

```js
npm run build

```




### Related packages
[AsService](https://www.npmjs.com/package/@barteh/as-service) a wrapper for everything like object promise or rxjs observables to reloadable and injectable service

[Machinize](https://www.npmjs.com/package/@barteh/machinize) a javascript library for creating advanced finit state machine (fsm) with auto transition and observable machine




### license: MIT


