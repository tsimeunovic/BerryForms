//Interface for Dashboard repository service (communicates with server side Node api and retrieves/saves dashboard related data)
module Services {
    'use strict';

    export interface IDashboardRepositoryService {
        GetActivitySummary(entityName:string, callback:(activityData:any[], errorsModel:any) => void):void;
        GetMyLastActivity(entityName:string, callback:(activityItems:any[], errorsModel:any) => void):void;
        GetLastActivity(entityName:string, callback:(activityItems:any[], errorsModel:any) => void):void;
    }
}
