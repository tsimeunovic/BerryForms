/// <reference path="./dateFieldMetadataModel.ts" />
/// <reference path="../baseFieldController.ts" />
/// <reference path="../../../models/core/entityModel.ts" />

module Components.FieldTypes {
    'use strict';

    export class DateFieldController extends BaseFieldController<Models.DateFieldMetadata> {
        //@ngInject
        constructor($scope:any) {
            super($scope);
            this.EntityValueChangedEvent = this.EntityValueChanged.bind(this);
            this.EntityValueChanged();
        }

        public Opened:boolean;
        public LocalDate:any;

        //Bound methods
        public ToggleOpen($event:any):void {
            this.StopEventPropagation($event);
            this.Opened = !this.Opened;
        }

        public IsDisabled(date:Date, mode:string):boolean {
            var minDate:number = this.FieldMetadata.MinDate;
            var maxDate:number = this.FieldMetadata.MaxDate;
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

        public UIValueChanged():void {
            var utcTime:number = this.ConvertToUtcTime(this.LocalDate);
            var currentUtcTime:number = this.GetBoundFieldValue();
            if (utcTime !== currentUtcTime) {
                this.SetBoundFieldValue(utcTime);
            }
        }

        //Helper methods
        private EntityValueChanged():void {
            var utcTime:number = this.GetBoundFieldValue();
            var localDate:Date = this.ConvertToLocalDate(utcTime);
            var currentLocalDate:Date = this.LocalDate;
            if (!this.AreSameDate(currentLocalDate, localDate)) {
                this.LocalDate = localDate ? localDate.toISOString() : null;
            }
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
                return this.GetBoundFieldValue();
            }

            //Convert date
            var localTimeZoneOffset:number = localDate.getTimezoneOffset();
            var utcTime:number = localDate.getTime() - (localTimeZoneOffset * 60 * 1000);
            return utcTime;
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
