/// <reference path="../../interfaces/services/repository/IDashboardRepositoryService.ts" />

'use strict';

//Service that communicates with server side Node api and retrieves/saves dashboard related data
module Services {
    export class DashboardRepositoryService implements Services.IDashboardRepositoryService {
        public static injection():any[] {
            return [
                'HttpWrapperService',
                'UrlLocatorService',
                DashboardRepositoryService
            ];
        }

        constructor(private HttpWrapperService:Services.IHttpWrapperService,
                    private UrlLocatorService:Services.IUrlLocatorService) {
        }

        public GetActivitySummary(entityName:string, callback:(activityData:any[], errorsModel:any)=>void):void{
            var url:string = this.UrlLocatorService.GetUrlForDashboardActivitySummary(entityName);
            this.HttpWrapperService.Get(url, 'DashboardActivitySummary').then(
                //Success
                function (data:any[]) {
                    callback(data, null);
                },
                //Error
                function (errorsData) {
                    callback(null, errorsData);
                });
        }
    }
}
