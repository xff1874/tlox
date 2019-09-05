interface  IPerson{
    firstName:string,
    sendName?:string,
    say:()=>string;
}

let customer :IPerson = {
    firstName:"zhangwe",
    say:()=>{
        return this.firstName+this.sendName
    }

}



customer.say();

interface namelist{
    [index:number]:string
}

var list1:namelist;
list1["name"]="zwd"
list1[2]="ddd";
interface ages { 
    [index:number]:string 
 } 
 
 var agelist:ages; 
 agelist["John"] = 15   // Ok 
 agelist[2] = "nine"   // Error

 interface Person{
     name:string;
 }

 interface Asian extends Person{
     age:number
 }
 interface Face{
     eye:number
 }

 let yijianlian:Asian={
     name:"y",
     age:36
 }

class Loin{
    protected str:string = "ddd"
    private age:number;
}

class AsiaLoin extends Loin{
    sayString():string{
        return this.str;
    }

    sayAge():number{
        return this.age;
    }
}

let siba = new AsiaLoin();
// siba.str;
siba.sayString();