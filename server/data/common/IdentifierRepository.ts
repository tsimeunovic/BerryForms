/// <reference path="MongoRepositoryBase.ts" />
/// <reference path="IIdentifierRepository.ts" />

import Base = require('../common/MongoRepositoryBase');
import Contract = require('../common/IIdentifierRepository');
import ErrorsModel = require('../../model/ClientErrorsModel');
import Config = require('../../config/Config');

export module Data {
    'use strict';

    export class IdentifierRepository extends Base.Data.MongoRepositoryBase implements Contract.Data.IIdentifierRepository {
        constructor() {
            super(Config.Config.Server.SystemPrefix + 'counters');
        }

        public GetNewIdentifierFor(newItemFromCollection:string, data:any, callback:(identifier:any, errors:ErrorsModel.Model.ClientErrorsModel) => void):void {
            var _this:IdentifierRepository = this;
            var collectionName:string = this.CollectionName;

            //Metadata
            if (newItemFromCollection === Config.Config.Server.SystemPrefix + 'metadata') {
                callback(data.EntitySystemName, null);
                return;
            }

            //Entity
            this.DoCollectionOperation(collectionName, function (collection:any, err:any):void {
                if (err) {
                    console.log('Error generating new id for ' + newItemFromCollection + '\n' + err);
                    callback(null, ErrorsModel.Model.ClientErrorsModel.CreateWithError('DatabaseConnectionError', null));
                } else {
                    collection.findAndModify({id: newItemFromCollection}, [], {$inc: {seq: 1}}, {'new': true}, function (err:any, item:any):void {
                        if (!err && !item) {
                            //First record
                            collection.insert({
                                id: newItemFromCollection,
                                seq: 1
                            }, {w: 1}, function (insErr:any, insResult:any):void {
                                var idItemFromInsert:any = insResult ? insResult[0] : null;
                                _this.HandleIdentifierGenerationResult(_this, newItemFromCollection, insErr, idItemFromInsert, callback);
                            });
                        } else {
                            //Existing record or error
                            _this.HandleIdentifierGenerationResult(_this, newItemFromCollection, err, item, callback);
                        }
                    });
                }
            });
        }

        private HandleIdentifierGenerationResult(repository:any, newItemFromCollection:string, err:any, item:any,
                                                 callback:(identifier:number, errors:ErrorsModel.Model.ClientErrorsModel) => void):void {
            var logMessage:string = err ?
            'Error generating new id for ' + newItemFromCollection + '\n' + err :
            'Generated new id ' + item.seq + ' for ' + newItemFromCollection;

            console.log(logMessage);
            var returnedIdentifier:number = err ?
                null :
                item.seq;
            var returnedError:ErrorsModel.Model.ClientErrorsModel = err ?
                ErrorsModel.Model.ClientErrorsModel.CreateWithError('IdGeneratingError', [newItemFromCollection]) :
                null;

            repository.CloseClientWithCallback(function ():void {
                callback(returnedIdentifier, returnedError);
            });
        }
    }
}
