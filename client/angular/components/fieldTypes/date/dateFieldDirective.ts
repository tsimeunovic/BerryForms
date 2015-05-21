/// <reference path="../../../directives/fieldDirectiveBase.ts" />
/// <reference path="../../../../config/config.ts" />

module Directives {
    'use strict';

    export class DateField extends Directives.BaseField {
        /* tslint:disable:member-ordering */
        public static injection():any[] {
            return [
                DateField.DirectiveOptions
            ];
        }

        private Opened:boolean = false;

        public static DirectiveOptions():any {
            return BaseField.DirectiveOptions('Date', DateField.StaticConstructor);
        }

        public static StaticConstructor():Directives.DateField {
            return new Directives.DateField();
        }

        public Link($scope:any, $linkElement:any, $linkAttributes:any):void {
            super.Link($scope, $linkElement, $linkAttributes);

            this.Scope.Opened = this.Opened;
            this.Scope.ToggleOpen = this.ToggleOpen.bind(this);
            this.Scope.IsDisabled = this.IsDisabled.bind(this);

            this.EntityValueChanged();
            this.Watch();
        }

        private ToggleOpen($event:any):void {
            $event.preventDefault();
            $event.stopPropagation();
            this.Scope.Opened = !this.Scope.Opened;
        }

        private IsDisabled(date:Date, mode:string):boolean {
            var minDate:number = this.Scope.field.MinDate;
            var maxDate:number = this.Scope.field.MaxDate;
            var invalidDate:boolean = false;

            date.setHours(0, 0, 0, 0); //Normalize date to midnight
            switch (mode) {
                case 'day':
                    var utcDate:number = this.ConvertToUtcTime(date);
                    invalidDate = (minDate && minDate > utcDate) ||
                        (maxDate && maxDate < utcDate);
                    break;
                case 'month':
                    //Passed date is first date of month
                    var lastDayOfMonth:Date = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                    var utcStartMonth:number = this.ConvertToUtcTime(date);
                    var utcEndMonth:number = this.ConvertToUtcTime(lastDayOfMonth);
                    invalidDate = (minDate && minDate > utcEndMonth) ||
                        (maxDate && maxDate < utcStartMonth);
                    break;
                case 'year':
                    //Passed date is first date of year
                    var lastDayOfYear:Date = new Date(date.getFullYear(), 11, 31);
                    var utcStartYear:number = this.ConvertToUtcTime(date);
                    var utcEndYear:number = this.ConvertToUtcTime(lastDayOfYear);
                    invalidDate = (minDate && minDate > utcEndYear) ||
                        (maxDate && maxDate < utcStartYear);
                    break;
            }

            return invalidDate;
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
            var localTimeZoneOffset:number = localDate.getTimezoneOffset();
            var utcTime:number = localDate.getTime() - (localTimeZoneOffset * 60 * 1000);
            return utcTime;
        }

        private Watch():void {
            var _this:DateField = this;

            //Underlying model changed
            this.Scope.$watch('Entity.Data[field.FieldSystemName]', function ():void {
                _this.EntityValueChanged();
            });

            //User changed value
            this.Scope.$watch('LocalDate', function ():void {
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
