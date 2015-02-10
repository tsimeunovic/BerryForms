'use strict';

import Contract = require('../services/IProjectorFactory');

export module Services {
    export class ProjectorFactory implements Contract.Services.IProjectorFactory {
        public CreateProjectorFor(type:string):any {
            switch (type) {
                case 'metadata':
                    return this.MetadataProjector;
                default:
                    throw new Error();
            }
        }

        private MetadataProjector = {
            EntityName: 1,
            EntitySystemName: 1,
            EntityDescription: 1,
            IconClassName: 1,
            IconColorHex: 1
        };
    }
}
