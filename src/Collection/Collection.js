"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collection = void 0;
var Collection = /** @class */ (function () {
    function Collection(config, db, name) {
        this.type = config.type;
        this.config = config;
        this.db = db;
        this.name = name;
    }
    return Collection;
}());
exports.Collection = Collection;
