'use strict';

//Client configuration
module Config {
    export class Client {
        public static SystemPrefix:string = '__';
        public static SystemEntityName:string = Client.SystemPrefix + 'BerryFormsSystem';
        public static SystemColorIdentifier:string = Client.SystemPrefix + 'color' + Client.SystemPrefix;
        public static SystemIconIdentifier:string = Client.SystemPrefix + 'icon' + Client.SystemPrefix;

        public static ApiBaseUrl:string = './api/';
        public static LoadResourcesAsynchronously:boolean = true;

        public static LanguagesSupported:string[] = ['en', 'sk', 'sr'];
        public static LanguageDefault:string = 'en';
        public static LocalizedResourcesBaseUrl:string = 'angular/localization/{0}/resources.js';

        public static DatepickerFormat:string = 'dd.MM.yyyy';
        public static DatepickerOptions:any = {
            'year-format': "'yyyy'",
            'starting-day': 1
        };

        public static SearchTypingWaitTimeMs:number = 500;
        public static SearchMinExpressionLength:number = 3;
        public static SearchListSize:number = 4;

        public static NotificationDisplayTimeMs:number = 5000;
        public static EntityListPageSize:number = 10;
    }
}
