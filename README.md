# rxsync

A lightweight library that operates on rxjs to execute a stream chains sequentially or in parallel with defined limit of simultaneous executions.

## Motivation 

Async/waterfall, async/parallel or async/eachLimit is very easy and useful libraries but for callbacks. This library uses RxJs and allows to make a stream chains in nice format

## Installation

`npm i rx-sync`

## Usage 

### Waterfall
```javascript
const rxsync = require('rx-sync');

rxsync.waterfall([
	()=>{
		return Observable.of(1);
	},
	(res)=>{
		return Observable.of(res+1);
	},
	(res)=>{
		return Observable.of(res+1);
	}
]).subscribe(res=>{
	console.log(res) //3
});
```

### Parallel
Creates a stream with parallel execution of input streams. Returns an object with results of all streams executions, when the last one is finished

```javascript
const rxsync = require('rx-sync');

rxsync.parallel({
	one: ()=>{
		return Observable.of(1);
	},
	two: ()=>{
		return Observable.of(2);
	},	
	three: ()=>{
		return Observable.of(3);
	}
}).subscribe(res=>{
	console.log(res);
	/*
		{
			one: 1,
			two: 2,
			three: 3
		}
	*/
});
```

### eachLimit
Creates a stream with parallel execution of array of streams and limitation of simultaneous executions

```javascript
const rxsync = require('rx-sync');
const array=[1,2,3,4,5,6,7,8,9,10]

//rxsync.eachLimit(streams, limit);

rxsync.eachLimit(array.map(item=>{
	return Observable.of(item);
}), 5).subscribe(res=>{
	console.log(res); //[1,2,3,4,5,6,7,8,9,10]	
});
```