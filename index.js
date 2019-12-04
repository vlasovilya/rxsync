const _=require('lodash');
const Observable = require('rxjs/Observable').Observable;
require('rxjs/add/observable/forkJoin');
require('rxjs/add/operator/mergeMap');
require('rxjs/add/observable/of');
require('rxjs/add/operator/map');

const rxsync={
    parallel:(object)=>{
        let functions=[];
        let keys=[];
        _.each(object, (fn, key)=>{
            if (fn && _.isFunction(fn)){
                functions.push(fn());
                keys.push(key);
            }
        });

        return Observable.forkJoin(...functions).map(arr=>{
            let obj={};
            _.each(arr, (val, key)=>{
                obj[keys[key]]=val;
            });
            functions=null;
            keys=null;            
            return obj;
        });
    },

    waterfall:(array)=>{
        if (!array || !array.length){
            return Observable.of(null);
        }
        array.unshift(()=>Observable.of(null));
        let fn=array[0]();
        const addMap=(fn, fn1)=>{
            return fn.mergeMap(fn1);
        };
        for (let i=1; i<array.length; i++){
            fn=addMap(fn, res=>{
                return array[i](res);
            });
        }

        return fn;
    },
    eachLimit:(streams, limit)=>{
        if (!streams || !streams.length){
            return Observable.of(null);
        }
        let index=-1;
        const joinGroups=_.groupBy(streams, ()=>{
            index++;
            return parseInt(String(index/limit), 10);
        }) || [];
        let array=[];
        if (!joinGroups){
            return Observable.of(null);
        }
        let res=[];
        _.values(joinGroups).forEach(group=>{
            if (!group || !group[0]){
                return;
            }
            array.push(()=>{
                return Observable.forkJoin(...group).map(items=>{
                    res=_.union(res, items);
                    return items;
                });
            });
        });

        return rxsync.waterfall(array).map(()=>res).map((result)=>{
            res=null;
            array=null;
            return result;
        });
    }
}

module.exports = rxsync;
