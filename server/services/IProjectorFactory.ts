'use strict';

export module Services {
    export interface IProjectorFactory {
        CreateProjectorFor(type:string): any;
    }
}
