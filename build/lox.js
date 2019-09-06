"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Scanner_1 = __importDefault(require("./Scanner"));
var Lox = /** @class */ (function () {
    function Lox() {
    }
    Lox.run = function (sourceCode) {
        var scanner = new Scanner_1.default(sourceCode);
        var tokens = scanner.scanTokens();
        for (var token in tokens) {
            console.log(token);
        }
    };
    return Lox;
}());
exports.default = Lox;
//# sourceMappingURL=Lox.js.map