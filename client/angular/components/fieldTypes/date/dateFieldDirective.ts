/// <reference path="../../../directives/fieldDirectiveBase.ts" />
/// <reference path="../../../../config/config.ts" />

module Directives {
    'use strict';

    export class DateField extends Directives.BaseField {
        public static injection():any[] {
            return [
                DateField.DirectiveOptions
            ];
        }

        public static DirectiveOptions():any {
            return BaseField.DirectiveOptions('Date', DateField.StaticConstructor);
        }

        public static StaticConstructor():Directives.DateField {
            return new Directives.DateField();
        }

        private Opened:boolean = false;

        public Link($scope:any, $linkElement:any, $linkAttributes:any):void {
            super.Link($scope, $linkElement, $linkAttributes);

            this.Scope.Opened = this.Opened;
            this.Scope.ToggleOpen = this.ToggleOpen.bind(this);
            this.Scope.IsDisabled = this.IsDisabled;

            this.EntityValueChanged();
            this.Watch();
        }

        private ToggleOpen($event:any):void {
            $event.preventDefault();
            $event.stopPropagation();
            this.Scope.Opened = !this.Scope.Opened;
        }

        private IsDisabled(date, mode):boolean {
            return false;
        }

        private ConvertToLocalDate(utcTime:number):Date {
            if (!utcTime) {
                return null;
            }
            var utcDate:Date = new Date(utcTime);
            var localTimeZoneOffset:number = utcDate.getTimezoneOffset();
            var localDate:Date = new Date(utcTime + (localTimeZoneOffset * 60 * 1000));
            return localDate;
        }

        private ConvertToUtcTime(localDate:any):number {
            if (!localDate) {
                return null;
            }

            //String object means that object has been set according to Entity model
            if (Object.prototype.toString.call(localDate) === '[object String]') {
                return this.Scope.Entity.Data[this.Scope.field.FieldSystemName];
            }

            //Convert date
            var localTimeZoneOffset = localDate.getTimezoneOffset();
            var utcTime = localDate.getTime() - (localTimeZoneOffset * 60 * 1000);
            return utcTime;
        }

        private Watch():void {
            var _this = this;

            //Underlying model changed
            this.Scope.$watch('Entity.Data[field.FieldSystemName]', function () {
                _this.EntityValueChanged();
            });

            //User changed value
            this.Scope.$watch('LocalDate', function () {
                _this.UIValueChanged();
            });
        }

        private EntityValueChanged():void {
            var utcTime:number = this.Scope.Entity.Data[this.Scope.field.FieldSystemName];
            var localDate:Date = this.ConvertToLocalDate(utcTime);
            var currentLocalDate:Date = this.Scope.LocalDate;
            if (!this.AreSameDate(currentLocalDate, localDate)) {
                this.Scope.LocalDate = localDate ? localDate.toISOString() : null;
            }
        }

        private UIValueChanged():void {
            var utcTime:number = this.ConvertToUtcTime(this.Scope.LocalDate);
            var currentUtcTime:number = this.Scope.Entity.Data[this.Scope.field.FieldSystemName];
            if (utcTime !== currentUtcTime) {
                this.Scope.Entity.Data[this.Scope.field.FieldSystemName] = utcTime;
            }
        }

        private AreSameDate(date1:Date, date2:Date):boolean {
            if (!date1 && !date2) {
                return true;
            } else if (!date1 || !date2) {
                return false;
            } else if (Object.prototype.toString.call(date1) !== Object.prototype.toString.call(date2)) {
                return false;
            } else {
                return date1.getTime() === date2.getTime();
            }
        }
    }
}
