// function opFn(id?:number,name:string){
//     console.log(id,name)
// }

function rest(names:number[]=[1]){
    console.log(names)
}

function say(num:number):number;

function say(num:string):string;

function say(num:any):any{
    if(typeof num == "number"){
        console.log(num)
    }else if(typeof num == "string"){
        //do others
    }
}

// function disp(s1:string):void; 
// function disp(n1:number):void; 

// function disp(x:any,y?:any):void { 
//    console.log(x); 
//    console.log(y); 
// } 
// disp("abc") 
// disp(1,"xyz");