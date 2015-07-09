/// <reference path="../../../extensions/arrayExtensions.ts" />
/// <reference path="../../interfaces/components/fieldTypes/IFieldType.ts" />
/// <reference path="../../interfaces/components/fieldTypes/IFieldTypesRegistry.ts" />

var _global:any = this;
_global.Components = _global.Components || {};
_global.Components.FieldTypes = [];

module Components.FieldTypes {
    'use strict';

    export class FieldTypesRegistry implements IFieldTypesRegistry {
        private RegisteredComponents:IFieldType[];

        //@ngInject
        constructor() {
            this.RegisteredComponents = _global.Components.FieldTypes;
            _global.Instances.FieldTypesRegistry = this;
        }

        public GetFieldType(fieldTypeName:string, useDefaultForNonExisting:boolean):IFieldType {
            var findFunction:(ft:IFieldType) => boolean = function (ft:IFieldType):boolean {
                return ft.FieldName === fieldTypeName;
            };
            var findFunctionDefault:(ft:IFieldType) => boolean = function (ft:IFieldType):boolean {
                return ft.FieldName === 'Text';
            };
            var registeredType:IFieldType = this.RegisteredComponents.single(findFunction);
            if (!registeredType && useDefaultForNonExisting) {
                return this.RegisteredComponents.single(findFunctionDefault);
            } else {
                return registeredType;
            }
        }
    }
}
