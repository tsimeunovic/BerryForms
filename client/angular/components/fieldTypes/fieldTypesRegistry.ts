/// <reference path="../../../extensions/arrayExtensions.ts" />
/// <reference path="../../interfaces/components/fieldTypes/IFieldType.ts" />
/// <reference path="../../interfaces/components/fieldTypes/IFieldTypesRegistry.ts" />

'use strict';

var _global:any = this;
_global.Components = _global.Components || {};
_global.Components.FieldTypes = [];

module Components.FieldTypes {
    export class FieldTypesRegistry implements IFieldTypesRegistry {
        public static injection():any[] {
            return [
                FieldTypesRegistry
            ];
        }

        private RegisteredComponents:IFieldType[];

        constructor() {
            this.RegisteredComponents = _global.Components.FieldTypes;
            _global.Instances.FieldTypesRegistry = this;
        }

        GetFieldType(fieldTypeName:string, useDefaultForNonExisting:boolean):IFieldType {
            var findFunction = function(ft:IFieldType) { return ft.FieldName == fieldTypeName; };
            var findFunctionDefault = function(ft:IFieldType) { return ft.FieldName == 'Text'; };
            var registeredType = this.RegisteredComponents.single(findFunction);
            if(!registeredType && useDefaultForNonExisting) return this.RegisteredComponents.single(findFunctionDefault);
            else return registeredType;
        }
    }
}
