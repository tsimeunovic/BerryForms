'use strict';
var Services;
(function (Services) {
    var ProjectorFactory = (function () {
        function ProjectorFactory() {
            this.MetadataProjector = {
                EntityName: 1,
                EntitySystemName: 1,
                EntityDescription: 1,
                IconClassName: 1,
                IconColorHex: 1
            };
        }
        ProjectorFactory.prototype.CreateProjectorFor = function (type) {
            switch (type) {
                case 'metadata':
                    return this.MetadataProjector;
                default:
                    throw new Error();
            }
        };
        return ProjectorFactory;
    })();
    Services.ProjectorFactory = ProjectorFactory;
})(Services = exports.Services || (exports.Services = {}));
//# sourceMappingURL=ProjectorFactory.js.map