const fs = require("fs");
const path = require("path");



function defineAst(baseName,types){
    let tsFile = path.join(__dirname,`${baseName}.ts`);
    let stream = fs.createWriteStream(tsFile,{flag:'a'});
    stream.write("abstract class " + baseName + " {");
    stream.write("}")
    stream.end();
}

defineAst("Expr", [         
    "Binary   : Expr left, Token operator, Expr right",
    "Grouping : Expr expression",                      
    "Literal  : Object value",                         
    "Unary    : Token operator, Expr right"            
]);
