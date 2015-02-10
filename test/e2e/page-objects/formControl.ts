/// <reference path="../../jasmine.d.ts" />
/// <reference path="../../../client/extensions/stringExtensions.ts" />

'use strict';

module PageObjects {
    export class FormControl {
        constructor(public ControlName:string,
                    public ControlType:string) {
            this.ControlRootSelector = ('[data-id="{0}"]').format([ControlName]);
            this.ControlScopeName = ('{0} field').format([ControlName]);
            this.CommonModel = 'Entity.Data[field.FieldSystemName]';
        }

        private ControlRootSelector:string;
        private ControlScopeName:string;
        private CommonModel:string;

        public SetValue(value:any):void {
            switch (this.ControlType) {
                case 'text':
                case 'textarea':
                    using(this.ControlRootSelector, this.ControlScopeName).input(this.CommonModel).enter(value);
                    break;
                case 'date':
                    using(this.ControlRootSelector, this.ControlScopeName).input('LocalDate').enter(value);
                    break;
                case 'boolean':
                    var optionSelector = ('a[data-value="{0}"]').format([value]);
                    using(this.ControlRootSelector, this.ControlScopeName).element(optionSelector).click();
                    break;
                case 'select':
                    var optionSelector = ('li[data-value="{0}"] a').format([value]);
                    using(this.ControlRootSelector, this.ControlScopeName).element(optionSelector).click();
                    break;
                case 'list':
                    for (var i = 0; i < value.length; i++) {
                        using(this.ControlRootSelector, this.ControlScopeName).input('CurrentValue').enter(value[i]);
                        using(this.ControlRootSelector, this.ControlScopeName).element('.btn-default').click();
                    }
                    break;
                case 'relationship':
                    using(this.ControlRootSelector, this.ControlScopeName).input('SearchExpression').enter(value);
                    sleep(0.5);
                    using(this.ControlRootSelector, this.ControlScopeName).element('.search-result-item.selectable:nth-child(1) a').click();
                    break;
                default:
                    throw new Error();
            }
        }
    }
}
