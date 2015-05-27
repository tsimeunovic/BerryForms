/// <reference path="../../jasmine.d.ts" />
/// <reference path="../../../client/angular/interfaces/services/repository/IDashboardRepositoryService.ts" />
/// <reference path="../../../client/extensions/arrayExtensions.ts" />

module Mocks {
    'use strict';

    export class DashboardRepositoryServiceMock implements Services.IDashboardRepositoryService {
        constructor() {
            this.Setup();
        }

        private Responses:any[];

        //Mock methods
        public AddResponse(method:string, result:any, errorModel:any):void {
            this.Responses.push({
                Method: method,
                Result: result,
                ErrorModel: errorModel,
                AnyResponse: result != null || errorModel != null
            });
        }

        //Interface methods
        public GetActivitySummary(entityName:string, callback:(activityData:any[], errorsModel:any) => void):void {
            var entityNames:string[] = [entityName || 'entity1', entityName || 'entity2'];
            var users:string[] = ['mockUser', 'mockUser', 'otherUser'];
            var defaultObject:any[] = this.GenerateActivityList(10, users, entityNames);

            var configuredResponse:any = this.ResponseFor('GetActivitySummary');
            if (configuredResponse && configuredResponse.AnyResponse) {
                callback(configuredResponse.Result, configuredResponse.ErrorModel);
            } else if (!configuredResponse) {
                callback(defaultObject, null);
            }
        }

        public GetMyLastActivity(entityName:string, callback:(activityItems:any[], errorsModel:any) => void):void {
            var entityNames:string[] = [entityName || 'entity1', entityName || 'entity2', entityName || 'entity3'];
            var users:string[] = ['mockUser'];
            var defaultObject:any[] = this.GenerateActivityList(10, users, entityNames);

            var configuredResponse:any = this.ResponseFor('GetMyLastActivity');
            if (configuredResponse && configuredResponse.AnyResponse) {
                callback(configuredResponse.Result, configuredResponse.ErrorModel);
            } else if (!configuredResponse) {
                callback(defaultObject, null);
            }
        }

        public GetLastActivity(entityName:string, callback:(activityItems:any[], errorsModel:any) => void):void {
            var defaultObject:any[] = [
                {
                    Collection: 'entity1',
                    TotalOperationsCount: 10,
                    CreatedCount: 4,
                    UpdatedCount: 5,
                    DeletedCount: 1
                },
                {
                    Collection: 'entity2',
                    TotalOperationsCount: 20,
                    CreatedCount: 8,
                    UpdatedCount: 7,
                    DeletedCount: 5
                }
            ];

            var configuredResponse:any = this.ResponseFor('GetLastActivity');
            if (configuredResponse && configuredResponse.AnyResponse) {
                callback(configuredResponse.Result, configuredResponse.ErrorModel);
            } else if (!configuredResponse) {
                callback(defaultObject, null);
            }
        }

        private Setup():void {
            this.Responses = [];

            spyOn(this, 'GetActivitySummary').and.callThrough();
            spyOn(this, 'GetMyLastActivity').and.callThrough();
            spyOn(this, 'GetLastActivity').and.callThrough();
        }

        //Helper methods
        private ResponseFor(method:string):any {
            var configuredResponsePredicate:(r:any) => boolean = function (response:any):boolean {
                return response.Method === method;
            };
            return this.Responses.single(configuredResponsePredicate);
        }

        private GenerateActivityList(count:number, users:string[], entityNames:string[]):any[] {
            var operations:string[] = ['create', 'update', 'delete'];
            var result:any[] = [];
            for (var i:number = 0; i < count; i++) {
                result.push({
                    Id: (i + 1),
                    Time: (new Date().getTime()) - (i + 1) * 3600 * 1000,
                    User: users[i % users.length],
                    Collection: entityNames[i % entityNames.length],
                    Operation: operations[i % operations.length]
                });
            }
            return result;
        }
    }
}
