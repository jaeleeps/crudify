"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var csvParser = require("csv-parser");
var testMongoDBAtlasConfig_1 = require("../../__test__/env/testMongoDBAtlasConfig");
var async = require("async");
var mongodb_1 = require("mongodb");
var filePath = 'listings.csv';
function processRow(row) {
    return {
        id: parseInt(row.id, 10),
        listing_url: row.listing_url,
        name: row.name,
        description: row.description,
        neighbourhood_review: row.neighborhood_overview,
        picture_url: row.picture_url,
        host_id: row.host_id,
        host_url: row.host_url,
        host_name: row.host_name,
        host_location: row.host_location,
        host_response_time: row.host_response_time,
        neighbourhood: row.neighbourhood,
        bathrooms: parseFloat(row.bathrooms),
        beds: parseInt(row.beds, 10),
        number_of_reviews: parseInt(row.number_of_reviews, 10),
        review_scores_rating: parseFloat(row.review_scores_rating),
        review_scores_accuracy: parseFloat(row.review_scores_accuracy),
        review_scores_cleanliness: parseFloat(row.review_scores_cleanliness),
        review_scores_checkin: parseFloat(row.review_scores_checkin),
        review_scores_location: parseFloat(row.review_scores_location),
        review_scores_value: parseFloat(row.review_scores_value),
        reviews_per_month: parseFloat(row.reviews_per_month),
    };
}
function parseLargeCSV(path, onRowParsed) {
    var q = async.queue(onRowParsed, 10); // Adjust concurrency value if needed
    (0, fs_1.createReadStream)(path)
        .pipe(csvParser())
        .on('data', function (row) {
        var parsedRow = processRow(row);
        q.push(parsedRow, function (err) {
            if (err)
                console.error('Error processing row:', err);
        });
    })
        .on('end', function () {
        q.drain(function () {
            console.log('CSV file successfully processed.');
        });
    });
}
// This function will be called for each parsed row
function handleParsedRow(row, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var client, collection, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connectToDB()];
                case 1:
                    client = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, 5, 7]);
                    collection = client.db('airbnb').collection('Listings');
                    return [4 /*yield*/, collection.insertOne(row)];
                case 3:
                    _a.sent();
                    console.log('Row inserted:', row.id);
                    callback(null);
                    return [3 /*break*/, 7];
                case 4:
                    err_1 = _a.sent();
                    console.error('Error inserting row:', err_1);
                    callback(err_1);
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, client.close()];
                case 6:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    });
}
// Start parsing the large CSV file
function runJob() {
    return __awaiter(this, void 0, void 0, function () {
        var client, onRowParsed;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connectToDB()];
                case 1:
                    client = _a.sent();
                    onRowParsed = function (row, callback) { return __awaiter(_this, void 0, void 0, function () {
                        var collection, err_2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    collection = client.db('airbnb').collection('Listings');
                                    return [4 /*yield*/, collection.insertOne(row)];
                                case 1:
                                    _a.sent();
                                    console.log('Row inserted:', row.id);
                                    callback(null);
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_2 = _a.sent();
                                    console.error('Error inserting row:', err_2);
                                    callback(err_2);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); };
                    parseLargeCSV(filePath, onRowParsed);
                    process.on('exit', function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log('Closing MongoDB connection');
                                    return [4 /*yield*/, client.close()];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    });
}
function connectToDB() {
    return __awaiter(this, void 0, void 0, function () {
        var password, uri, client, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    password = testMongoDBAtlasConfig_1.testMongoDBAtlasPassword;
                    uri = "mongodb+srv://jaeleeps:".concat(password, "@cluster0.cfhx0ec.mongodb.net/?retryWrites=true&w=majority");
                    client = new mongodb_1.MongoClient(uri);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client.connect()];
                case 2:
                    _a.sent();
                    console.log('Connected to MongoDB Atlas');
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _a.sent();
                    console.error('Error connecting to MongoDB Atlas:', err_3);
                    process.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, client];
            }
        });
    });
}
runJob();
