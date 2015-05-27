/// <reference path="../../interfaces/localization/IResources.ts" />

declare var _global:any;

//Resource file with translations for Serbian language (Српски бре!)
module Localization {
    'use strict';

    export class ResourcesSr implements Localization.IResources {
        //Records
        CreateNewRecord:string = 'Додај нови \'{0}\'';
        UpdateExistingRecord:string = 'Aжурираj \'{0}\'';
        ListOfRecords:string = 'Листа \'{0}\'';

        //Schema
        EditSchema:string = 'Промијени шему';
        CreateNewEntity:string = 'Додај нови ентитет';
        CreateNewField:string = 'Додај ново поље';
        ListOfEntityFields:string = 'Листа поља';
        EntityName:string = 'Име ентитета';
        EntityDescription:string = 'Опис ентитета';
        EntityColor:string = 'Боја ентитета';
        EntityIcon:string = 'Икона';
        FieldName:string = 'Име поља';
        FieldDescription:string = 'Опис поља';
        FieldTypeName:string = 'Врста поља';
        TextField:string = 'Текст';
        EmailField:string = 'Имејл адреса';
        NumberField:string = 'Број';
        TextareaField:string = 'Дужи текст';
        BooleanField:string = 'Да/не';
        DateField:string = 'Датум';
        ListField:string = 'Листа';
        SelectField:string = 'Опције';
        RelationField:string = 'Веза';
        FieldAlreadyExists:string = 'Поље са овим именом већ постоји';
        CouldNotUpdateField:string = 'Ажурирање поља није успјело';

        Required:string = 'Обавезан';
        DisplayInList:string = 'Прикажи у листи';
        RegularExpression:string = 'Регуларни израз';
        MaxLength:string = 'Максимална дужина';
        ThreeState:string = 'Три стања';
        MinDate:string = 'Датум од';
        MaxDate:string = 'Датум до';
        Values:string = 'Вриједности';
        DefaultValue:string = 'Уобичајено вредност';
        MaxRecordsCount:string = 'Максимални број записа';
        MaxRecordLength:string = 'Максимална дужина записа';
        RelatedEntity:string = 'Повезани ентитет';
        SearchForEntity:string = 'Потражи артикал ...';
        Searching:string = 'Тражим ...';
        NoSearchResults:string = 'Потрага није донела резултате';
        MoreResults:string = 'Још {0} резултата ...';
        DateFrom:string = '{0} од';
        DateTo:string = '{0} до';
        AnyValue:string = 'Свака вриједност ...';
        AllowFloating:string = 'Дозволити децималне бројеве';
        MinValue:string = 'Најмања вриједност';
        MaxValue:string = 'Највећа вриједност';
        NumberFrom:string = '{0} од';
        NumberTo:string = '{0} до';

        //Form
        PleaseSelect:string = 'Одаберите вриједност ...';
        Create:string = 'Створи';
        Update:string = 'Ажурирај';
        Add:string = 'Додај';
        AddNewField:string = 'Додај поље у \'{0}\'';
        UpdateField:string = 'Ажурирај поље';
        Yes:string = 'Да';
        Nothing:string = 'Ништа';
        No:string = 'Не';

        //List
        NoFieldsInNewEntity:string = 'За овај ентитет није дефинисано ни једно поље';
        NoFieldsInEntity:string = 'Ни једно поље није дефинисано у \'{0}\'';
        NoRecordsOfEntity:string = 'Нема записа за тип шеме \'{0}\'';
        NoRecordsOfFilteredEntity:string = 'Нема записа за тип шеме \'{0}\' одговарајућих условима потраге';
        ShowListOf:string = 'Прикажи листу \'{0}\'';
        ShowFilteredList:string = 'Прикажи филтрирану листу';

        //Colors
        ColorDefault:string = 'Уобичајена';
        ColorKhaki:string = 'Каки';
        ColorGray:string = 'Сива';
        ColorLightPurple:string = 'Сбијетло пурпурна';
        ColorPurple:string = 'Пурпурна';
        ColorDarkPurple:string = 'Тамно пурпурна';
        ColorOrange:string = 'Наранџаста';
        ColorViolet:string = 'Љубичаста';
        ColorBlue:string = 'Плава';
        ColorBrown:string = 'Браун';

        //Icons
        IconBriefcase:string = 'Ташна';
        IconCalendar:string = 'Календар';
        IconFilm:string = 'Филм';
        IconEuro:string = 'Еуро';
        IconCloud:string = 'Облак';
        IconEnvelope:string = 'Коверта';
        IconPencil:string = 'Оловка';
        IconMusic:string = 'Музика';
        IconHeart:string = 'Срце';
        IconStar:string = 'Звијезда';
        IconUser:string = 'Особа';
        IconOk:string = 'Ок';
        IconRemove:string = 'Улкони';
        IconSearch:string = 'Тражи';
        IconSignal:string = 'Сигнал';
        IconCog:string = 'Зубац';
        IconHome:string = 'Кућа';
        IconTime:string = 'Вријеме';
        IconRoad:string = 'Пут';
        IconBarcode:string = 'Баркод';
        IconPrint:string = 'Штампа';
        IconLeaf:string = 'Лист';
        IconFire:string = 'Ватра';
        IconPlane:string = 'Авион';
        IconGlobe:string = 'Кугла';
        IconPaperclip:string = 'Спајалица';
        IconCutlery:string = 'Есцајг';

        //Errors
        UnknownError:string = 'Непозната грешка';
        DatabaseConnectionError:string = 'Грешка поводом повезивања са базом података';
        IdGeneratingError:string = 'Грешка поводом стварања идентификатора за \'{0}\'';
        FindByIdError:string = 'Грешка поводом потраге за записом \'{0}\' из \'{1}\'';
        FindMultipleError:string = 'Грешка поводом учитавања листе записа из \'{0}\'';
        CreateNewError:string = 'Грешка поводом додавања новог записа у \'{0}\'';
        UpdateExistingError:string = 'Грешка поводом ажурирања записа из \'{0}\'';
        NonExistingFieldType:string = 'Није био пронађен компонент \'{0}\' за поље';
        InvalidDataLoaded:string = 'Примљени подаци са сервера су несагласни';
        FindPagedError:string = 'Није било могуће учитати страну {1} листе ентитета \'{0}\'';
        NonExistingPage:string = 'Потражена страна не постоји';
        ErrorRetrievingSearchResults:string = 'Грешка поводом потраге';
        UnknownTypeValidation:string = 'Непознати тип шеме \'{0}\'';
        EmptyMetadataValidation:string = 'Тип шеме мора да садржи неке податке';
        NoIconMetadataValidation:string = 'Тип шеме мора да садржи икону';
        InvalidSystemNameMetadataValidation:string = 'Тип шеме нема важеће име';
        CouldNotVerifySystemNameMetadataValidation:string = 'Грешка поводом провјеравања имена шеме';
        ExistingSystemNameMetadataValidation:string = 'Већ постоји шема са именом \'{0}\'';
        EmptyEntityValidation:string = 'Запис мора да садржи неке податке';
        UnknownTypeEntityValidation:string = 'Није било могуће одредити тип шеме';
        NoDataEntityValidation:string = 'Запис мора да садржи неке податке';
        CouldNotLoadSchemaEntityValidation:string = 'Грешка поводом провјеравања записа';
        UnknownSchemaEntityErrorsModel:string = 'Није дефинисана шема са именом \'{0}\'';
        RequiredFieldMissingEntityValidation:string = 'Обавезно поље \'{0}\' није попуњено';

        //Success notification messages
        EntityCreatedSuccess:string = 'Нови запис је био успјешно додан';
        EntityModifiedSuccess:string = 'Запис је успјешно ажуриран';
        EntityDeletedSuccess:string = 'Запис је био уклоњен';
        MetadataCreatedSuccess:string = 'Нова шема је била додана';
        MetadataSavedSuccess:string = 'Шема је била ажурирана';
        MetadataFieldCreatedSuccess:string = 'Ново поље је било додано у шему';

        //Dialog
        Confirmation:string = 'Потврда';
        DoYouReallyWantToDeleteEntity:string = 'Да ли заиста желите да обришете овај запис?';
        DoYouReallyWantToDeleteMetadataField:string = 'Да ли заиста желите да обришете ово поље?';

        //Plugin
        UnknownPlugin:string = 'Непознати';
        OperationCancelledByPlugin:string = 'Операција је била прекинута од стране плуг-инa \'{0}\'';
        OperationCancelledByPluginWithMessage:string = 'Операција је била прекинута од стране плуг-инa \'{0}\' са поруком \'{1}\'';

        //Notifications
        Error:string = 'Грешка';
        Warning:string = 'Упозорење';
        Information:string = 'Информација';
        Success:string = 'Успјех';

        //Security
        Login:string = 'Пријављивање';
        UserName:string = 'Корисничко име';
        Password:string = 'Лозинка';
        InvalidUserNameOrPassword:string = 'Пријављиваље није било успјешно. Не важеће корисничко име или лозинка';

        //Actions
        RetryActionsQuestion:string = 'Неке операције нису биле успјешне. Желите ли да их поновите?';
        CreateEntityMetadata:string = 'Додавање новог типа шеме';
        UpdateEntityMetadata:string = 'Ажурирање типа шеме';
        CreateEntity:string = 'Додавање записа';
        UpdateEntity:string = 'Ажурирање записа';
        DeleteEntity:string = 'Брисање записа';

        //Dashboard
        Dashboard:string = 'Дешборд';
        DashboardFor:string = 'Дешборд за \'{0}\'';
        RecentActivity:string = 'Скорашња активност';
        NoRecentActivity:string = 'Нема скорашње активности';
        TotalCount:string = 'Укупно: {0}';
        Created:string = 'Нове';
        Updated:string = 'Ажуриране';
        Deleted:string = 'Избрисане';
        LastModifiedRecords:string = 'Последња активност';
        LastModifiedRecordsByMe:string = 'Моја последња активност';
    }

    (function ():void {
        _global.Localization.Resources = new Localization.ResourcesSr();
    })();
}
