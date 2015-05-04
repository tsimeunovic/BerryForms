'use strict';

//Interface for Dashboard repository service (communicates with server side Node api and retrieves/saves dashboard related data)
module Services {
    export interface IDashboardRepositoryService {
        GetActivitySummary(entityName:string, callback:(activityData:any[], errorsModel:any) => void):void;
        GetMyRecentActivity(entityName:string, callback:(activityItems:any[], errorsModel:any) => void):void;
        GetRecentActivity(entityName:string, callback:(activityItems:any[], errorsModel:any) => void):void;
    }
}