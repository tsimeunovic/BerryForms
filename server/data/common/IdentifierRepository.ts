/// <reference path="MongoRepositoryBase.ts" />
/// <reference path="IIdentifierRepository.ts" />

'use strict';

import Base = require('../common/MongoRepositoryBase');
import Contract = require('../common/IIdentifierRepository');
import ErrorsModel = require('../../model/ClientErrorsModel');
import Config = require('../../config/Config');

export module Data {
    export class IdentifierRepository extends Base.Data.MongoRepositoryBase implements Contract.Data.IIdentifierRepository {
        constructor() {
            super(Config.Config.Server.SystemPrefix + 'counters');
        }

        public GetNewIdentifierFor(newItemFromCollection:string, data:any, callback:(identifier:any, errors:ErrorsModel.Model.ClientErrorsModel)=> void):void {
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
                else collection.findAndModify({id: newItemFromCollection}, [], {$inc: {seq: 1}}, {'new': true}, function (err, item) {
                    if (!err && !item) {
                        //First record
                        collection.insert({id: newItemFromCollection, seq: 1}, {w: 1}, function (insErr, insResult) {
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
        }

        private HandleIdentifierGenerationResult(repository:any, newItemFromCollection:string, err:any, item:any, callback:(identifier:any, errors:ErrorsModel.Model.ClientErrorsModel)=> void):void {
            var logMessage = err ?
            'Error generating new id for ' + newItemFromCollection + '\n' + err :
            'Generated new id ' + item.seq + ' for ' + newItemFromCollection;

            console.log(logMessage);
            var returnedIdentifier = err ? null : item.seq;
            var returnedError = err ? ErrorsModel.Model.ClientErrorsModel.CreateWithError('IdGeneratingError', [newItemFromCollection]) : null;

            repository.CloseClientWithCallback(function () {
                callback(returnedIdentifier, returnedError);
            });
        }
    }
}
