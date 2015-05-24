export module Services {
    'use strict';

    export interface IProjectorFactory {
        CreateProjectorFor(type:string): any;
    }
}
