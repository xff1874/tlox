"use strict";
let customer = {
    firstName: "zhangwe",
    say: () => {
        return this.firstName + this.sendName;
    }
};
customer.say();
var list1;
list1["name"] = "zwd";
list1[2] = "ddd";
var agelist;
agelist["John"] = 15; // Ok 
agelist[2] = "nine"; // Error
let yijianlian = {
    name: "y",
    age: 36
};
class Loin {
    constructor() {
        this.str = "ddd";
    }
}
class AsiaLoin extends Loin {
    sayString() {
        return this.str;
    }
    sayAge() {
        return this.age;
    }
}
let siba = new AsiaLoin();
// siba.str;
siba.sayString();
//# sourceMappingURL=itf.js.map