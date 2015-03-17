/// <reference path="MongoRepositoryBase.ts" />
/// <reference path="IIdentifierRepository.ts" />
'use strict';
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Base = require('../common/MongoRepositoryBase');
var ErrorsModel = require('../../model/ClientErrorsModel');
var Config = require('../../config/Config');
var Data;
(function (Data) {
    var IdentifierRepository = (function (_super) {
        __extends(IdentifierRepository, _super);
        function IdentifierRepository() {
            _super.call(this, Config.Config.Server.SystemPrefix + 'counters');
        }
        IdentifierRepository.prototype.GetNewIdentifierFor = function (newItemFromCollection, data, callback) {
            var repository = this;
            var collectionName = this.CollectionName;
            //Metadata
            if (newItemFromCollection == Config.Config.Server.SystemPrefix + 'metadata') {
                callback(data.EntitySystemName, null);
                return;
            }
            //Entity
            this.DoCollectionOperation(collectionName, function (collection, err) {
                if (err) {
                    console.log('Error generating new id for ' + newItemFromCollection + '\n' + err);
                    callback(null, ErrorsModel.Model.ClientErrorsModel.CreateWithError('DatabaseConnectionError', null));
                }
                else
                    collection.findAndModify({ id: newItemFromCollection }, [], { $inc: { seq: 1 } }, { 'new': true }, function (err, item) {
                        if (!err && !item) {
                            //First record
                            collection.insert({ id: newItemFromCollection, seq: 1 }, { w: 1 }, function (insErr, insResult) {
                                var idItemFromInsert = insResult ? insResult[0] : null;
                                repository.HandleIdentifierGenerationResult(repository, newItemFromCollection, insErr, idItemFromInsert, callback);
                            });
                        }
                        else {
                            //Existing record or error
                            repository.HandleIdentifierGenerationResult(repository, newItemFromCollection, err, item, callback);
                        }
                    });
            });
        };
        IdentifierRepository.prototype.HandleIdentifierGenerationResult = function (repository, newItemFromCollection, err, item, callback) {
            var logMessage = err ? 'Error generating new id for ' + newItemFromCollection + '\n' + err : 'Generated new id ' + item.seq + ' for ' + newItemFromCollection;
            console.log(logMessage);
            var returnedIdentifier = err ? null : item.seq;
            var returnedError = err ? ErrorsModel.Model.ClientErrorsModel.CreateWithError('IdGeneratingError', [newItemFromCollection]) : null;
            repository.CloseClientWithCallback(function () {
                callback(returnedIdentifier, returnedError);
            });
        };
        return IdentifierRepository;
    })(Base.Data.MongoRepositoryBase);
    Data.IdentifierRepository = IdentifierRepository;
})(Data = exports.Data || (exports.Data = {}));
//# sourceMappingURL=IdentifierRepository.js.map