/// <reference path="../../jasmine.d.ts" />
/// <reference path="../../../client/extensions/stringExtensions.ts" />

module PageObjects {
    'use strict';

    export class FormControl {
        constructor(public ControlName:string,
                    public ControlType:string) {
            this.ControlRootSelector = ('[data-id="{0}"]').format([ControlName]);
            this.ControlScopeName = ('{0} field').format([ControlName]);
            this.CommonModel = '{0}.Entity.Data[{0}.FieldMetadata.FieldSystemName]';
        }

        private ControlRootSelector:string;
        private ControlScopeName:string;
        private CommonModel:string;

        public SetValue(value:any):void {
            switch (this.ControlType) {
                case 'text':
                case 'textarea':
                    using(this.ControlRootSelector, this.ControlScopeName).input(this.CommonModel.format(['tfc'])).enter(value);
                    break;
                case 'number':
                    using(this.ControlRootSelector, this.ControlScopeName).input('nfc.Value').enter(value);
                    break;
                case 'date':
                    using(this.ControlRootSelector, this.ControlScopeName).input('dfc.LocalDate').enter(value);
                    break;
                case 'boolean':
                    var optionSelectorBool:string = ('a[data-value="{0}"]').format([value]);
                    using(this.ControlRootSelector, this.ControlScopeName).element(optionSelectorBool).click();
                    break;
                case 'select':
                    var optionSelectorSelect:string = ('li[data-value="{0}"] a').format([value]);
                    using(this.ControlRootSelector, this.ControlScopeName).element(optionSelectorSelect).click();
                    break;
                case 'list':
                    for (var i:number = 0; i < value.length; i++) {
                        using(this.ControlRootSelector, this.ControlScopeName).input('lfc.CurrentValue').enter(value[i]);
                        using(this.ControlRootSelector, this.ControlScopeName).element('.btn-default').click();
                    }
                    break;
                case 'relationship':
                    using(this.ControlRootSelector, this.ControlScopeName).input('rfc.SearchExpression').enter(value);
                    sleep(0.5);
                    using(this.ControlRootSelector, this.ControlScopeName).element('.search-result-item.selectable:nth-child(1) a').click();
                    break;
                default:
                    throw new Error();
            }
        }
    }
}
