# react-withservice
- - -
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
import  { BtService } from '@barteh/btservice';
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
            service:a=>Rx.of({name:`im an rxjs observable:${a}`}),
            params:props=>[props.match.x] //maps route params to service

        },
        srv4:{
            service:new Promise((res,rej)=>res({name:"im from promise"}))
        }
    },
    actions:{ // injects as functions to props
        deleteUser:new BtService(ui=>BtServer("myserversideController/deleteuser",{userid:ui}))

    }
}

export default withService(servicesObject)(Comp);



``` 

### license: MIT


