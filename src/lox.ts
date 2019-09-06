import Scanner from "./Scanner";

class Lox{
    private static run(sourceCode:string):void{
        let scanner:Scanner = new Scanner(sourceCode);
        let tokens = scanner.scanTokens();

        for(let token in tokens){
            console.log(token)
        }
    }

    
}

export default Lox;