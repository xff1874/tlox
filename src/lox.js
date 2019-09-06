"use strict";
exports.__esModule = true;
var Scanner_1 = require("./Scanner");
var Lox = /** @class */ (function () {
    function Lox() {
    }
    Lox.run = function (sourceCode) {
        var scanner = new Scanner_1["default"](sourceCode);
        var tokens = scanner.scanTokens();
        for (var token in tokens) {
            console.log(token);
        }
    };
    return Lox;
}());
exports["default"] = Lox;
