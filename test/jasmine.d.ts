/* tslint:disable:no-unused-variable */
declare var jasmine:any;
declare var describe:(description:string, func:() => void) => void;
declare var beforeEach:(func:() => void) => void;
declare var afterEach:(func:() => void) => void;
declare var it:(description:string, func:() => void) => void;
declare var expect:(value:any) => any;
declare var spyOn:(object:any, property:string) => any;

declare var using:(selector:string, scopeName:string) => any;
declare var input:(model:string) => any;
declare var element:(selector:string) => any;
declare var repeater:(selector:string) => any;
declare var sleep:(seconds:number) => void;
