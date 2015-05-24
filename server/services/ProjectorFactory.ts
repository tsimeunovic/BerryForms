import Contract = require('../services/IProjectorFactory');

export module Services {
    'use strict';

    export class ProjectorFactory implements Contract.Services.IProjectorFactory {
        private MetadataProjector:any = {
            EntityName: 1,
            EntitySystemName: 1,
            EntityDescription: 1,
            IconClassName: 1,
            IconColorHex: 1
        };

        public CreateProjectorFor(type:string):any {
            switch (type) {
                case 'metadata':
                    return this.MetadataProjector;
                default:
                    throw new Error();
            }
        }
    }
}
