const fs = require("fs");
const path = require("path");

function defineType(stream, baseName, className, fields) {
  stream.write(` export class ${className} extends ${baseName} { \n`);
  //constructor
  let filedCollection = fields.split(",");
  let cstr = "";
  for (let f of filedCollection) {
    let name = f.trim().split(" ");
    cstr += ` ${name[1]}:${name[0]}, `;
  }

  stream.write(`  constructor(${cstr}) { \n`);
  stream.write(` super(); \n`);
  for (let f of filedCollection) {
    let name = f.trim().split(" ");
    stream.write(`  this.${name[1]} = ${name[1]}; \n`);
  }
  stream.write("      } \n");
  //处理field
  for (let fv of filedCollection) {
    let name = fv.trim().split(" ");
    stream.write(`${name[1]}:${name[0]}; \n`);
  }

  stream.write("  } \n");
}

function defineVisitor(stream, baseName, types) {
  stream.write(`interface Visitor<R> { \n`);
  for (let t of types) {
    let typeName = t.split(":")[0].trim();
    stream.write(
      `visit${typeName}${baseName} (${baseName.toLowerCase()}:${typeName} ):R ; \n`
    );
  }
  stream.write("} \n");
}

function defineAst(baseName, types) {
  let tsFile = path.join(__dirname, `${baseName}.ts`);
  let stream = fs.createWriteStream(tsFile, { flag: "a" });
  stream.write(`import Token from "./Token";\n `);
  stream.write("abstract class " + baseName + " {");
  stream.write("} \n");
  defineVisitor(stream, baseName, types);
  for (let type of types) {
    let className = type.split(":")[0].trim();
    let fields = type.split(":")[1].trim();
    defineType(stream, baseName, className, fields);
  }

  stream.end();
}

defineAst("Expr", [
  "Binary   : Expr left, Token operator, Expr right",
  "Grouping : Expr expression",
  "Literal  : Object value",
  "Unary    : Token operator, Expr right"
]);
