/// <reference path="../../interfaces/localization/IResources.ts" />
//Resource file with translations for Serbian language (Српски бре!)
var Localization;
(function (Localization) {
    'use strict';
    var ResourcesSr = (function () {
        function ResourcesSr() {
            //Records
            this.CreateNewRecord = 'Додај нови \'{0}\'';
            this.UpdateExistingRecord = 'Aжурираj \'{0}\'';
            this.ListOfRecords = 'Листа \'{0}\'';
            //Schema
            this.EditSchema = 'Промијени шему';
            this.CreateNewEntity = 'Додај нови ентитет';
            this.CreateNewField = 'Додај ново поље';
            this.ListOfEntityFields = 'Листа поља';
            this.EntityName = 'Име ентитета';
            this.EntityDescription = 'Опис ентитета';
            this.EntityColor = 'Боја ентитета';
            this.EntityIcon = 'Икона';
            this.FieldName = 'Име поља';
            this.FieldDescription = 'Опис поља';
            this.FieldTypeName = 'Врста поља';
            this.TextField = 'Текст';
            this.EmailField = 'Имејл адреса';
            this.NumberField = 'Број';
            this.TextareaField = 'Дужи текст';
            this.BooleanField = 'Да/не';
            this.DateField = 'Датум';
            this.ListField = 'Листа';
            this.SelectField = 'Опције';
            this.RelationField = 'Веза';
            this.FieldAlreadyExists = 'Поље са овим именом већ постоји';
            this.CouldNotUpdateField = 'Ажурирање поља није успјело';
            this.Required = 'Обавезан';
            this.DisplayInList = 'Прикажи у листи';
            this.RegularExpression = 'Регуларни израз';
            this.MaxLength = 'Максимална дужина';
            this.ThreeState = 'Три стања';
            this.MinDate = 'Датум од';
            this.MaxDate = 'Датум до';
            this.Values = 'Вриједности';
            this.DefaultValue = 'Уобичајено вредност';
            this.MaxRecordsCount = 'Максимални број записа';
            this.MaxRecordLength = 'Максимална дужина записа';
            this.RelatedEntity = 'Повезани ентитет';
            this.SearchForEntity = 'Потражи артикал ...';
            this.Searching = 'Тражим ...';
            this.NoSearchResults = 'Потрага није донела резултате';
            this.MoreResults = 'Још {0} резултата ...';
            this.DateFrom = '{0} од';
            this.DateTo = '{0} до';
            this.AnyValue = 'Свака вриједност ...';
            this.AllowFloating = 'Дозволити децималне бројеве';
            this.MinValue = 'Најмања вриједност';
            this.MaxValue = 'Највећа вриједност';
            this.NumberFrom = '{0} од';
            this.NumberTo = '{0} до';
            //Form
            this.PleaseSelect = 'Одаберите вриједност ...';
            this.Create = 'Створи';
            this.Update = 'Ажурирај';
            this.Add = 'Додај';
            this.AddNewField = 'Додај поље у \'{0}\'';
            this.UpdateField = 'Ажурирај поље';
            this.Yes = 'Да';
            this.Nothing = 'Ништа';
            this.No = 'Не';
            //List
            this.NoFieldsInNewEntity = 'За овај ентитет није дефинисано ни једно поље';
            this.NoFieldsInEntity = 'Ни једно поље није дефинисано у \'{0}\'';
            this.NoRecordsOfEntity = 'Нема записа за тип шеме \'{0}\'';
            this.NoRecordsOfFilteredEntity = 'Нема записа за тип шеме \'{0}\' одговарајућих условима потраге';
            this.ShowListOf = 'Прикажи листу \'{0}\'';
            this.ShowFilteredList = 'Прикажи филтрирану листу';
            //Colors
            this.ColorDefault = 'Уобичајена';
            this.ColorKhaki = 'Каки';
            this.ColorGray = 'Сива';
            this.ColorLightPurple = 'Сбијетло пурпурна';
            this.ColorPurple = 'Пурпурна';
            this.ColorDarkPurple = 'Тамно пурпурна';
            this.ColorOrange = 'Наранџаста';
            this.ColorViolet = 'Љубичаста';
            this.ColorBlue = 'Плава';
            this.ColorBrown = 'Браун';
            //Icons
            this.IconBriefcase = 'Ташна';
            this.IconCalendar = 'Календар';
            this.IconFilm = 'Филм';
            this.IconEuro = 'Еуро';
            this.IconCloud = 'Облак';
            this.IconEnvelope = 'Коверта';
            this.IconPencil = 'Оловка';
            this.IconMusic = 'Музика';
            this.IconHeart = 'Срце';
            this.IconStar = 'Звијезда';
            this.IconUser = 'Особа';
            this.IconOk = 'Ок';
            this.IconRemove = 'Улкони';
            this.IconSearch = 'Тражи';
            this.IconSignal = 'Сигнал';
            this.IconCog = 'Зубац';
            this.IconHome = 'Кућа';
            this.IconTime = 'Вријеме';
            this.IconRoad = 'Пут';
            this.IconBarcode = 'Баркод';
            this.IconPrint = 'Штампа';
            this.IconLeaf = 'Лист';
            this.IconFire = 'Ватра';
            this.IconPlane = 'Авион';
            this.IconGlobe = 'Кугла';
            this.IconPaperclip = 'Спајалица';
            this.IconCutlery = 'Есцајг';
            //Errors
            this.UnknownError = 'Непозната грешка';
            this.DatabaseConnectionError = 'Грешка поводом повезивања са базом података';
            this.IdGeneratingError = 'Грешка поводом стварања идентификатора за \'{0}\'';
            this.FindByIdError = 'Грешка поводом потраге за записом \'{0}\' из \'{1}\'';
            this.FindMultipleError = 'Грешка поводом учитавања листе записа из \'{0}\'';
            this.CreateNewError = 'Грешка поводом додавања новог записа у \'{0}\'';
            this.UpdateExistingError = 'Грешка поводом ажурирања записа из \'{0}\'';
            this.NonExistingFieldType = 'Није био пронађен компонент \'{0}\' за поље';
            this.InvalidDataLoaded = 'Примљени подаци са сервера су несагласни';
            this.FindPagedError = 'Није било могуће учитати страну {1} листе ентитета \'{0}\'';
            this.NonExistingPage = 'Потражена страна не постоји';
            this.ErrorRetrievingSearchResults = 'Грешка поводом потраге';
            this.UnknownTypeValidation = 'Непознати тип шеме \'{0}\'';
            this.EmptyMetadataValidation = 'Тип шеме мора да садржи неке податке';
            this.NoIconMetadataValidation = 'Тип шеме мора да садржи икону';
            this.InvalidSystemNameMetadataValidation = 'Тип шеме нема важеће име';
            this.CouldNotVerifySystemNameMetadataValidation = 'Грешка поводом провјеравања имена шеме';
            this.ExistingSystemNameMetadataValidation = 'Већ постоји шема са именом \'{0}\'';
            this.EmptyEntityValidation = 'Запис мора да садржи неке податке';
            this.UnknownTypeEntityValidation = 'Није било могуће одредити тип шеме';
            this.NoDataEntityValidation = 'Запис мора да садржи неке податке';
            this.CouldNotLoadSchemaEntityValidation = 'Грешка поводом провјеравања записа';
            this.UnknownSchemaEntityErrorsModel = 'Није дефинисана шема са именом \'{0}\'';
            this.RequiredFieldMissingEntityValidation = 'Обавезно поље \'{0}\' није попуњено';
            //Success notification messages
            this.EntityCreatedSuccess = 'Нови запис је био успјешно додан';
            this.EntityModifiedSuccess = 'Запис је успјешно ажуриран';
            this.EntityDeletedSuccess = 'Запис је био уклоњен';
            this.MetadataCreatedSuccess = 'Нова шема је била додана';
            this.MetadataSavedSuccess = 'Шема је била ажурирана';
            this.MetadataFieldCreatedSuccess = 'Ново поље је било додано у шему';
            //Dialog
            this.Confirmation = 'Потврда';
            this.DoYouReallyWantToDeleteEntity = 'Да ли заиста желите да обришете овај запис?';
            this.DoYouReallyWantToDeleteMetadataField = 'Да ли заиста желите да обришете ово поље?';
            //Plugin
            this.UnknownPlugin = 'Непознати';
            this.OperationCancelledByPlugin = 'Операција је била прекинута од стране плуг-инa \'{0}\'';
            this.OperationCancelledByPluginWithMessage = 'Операција је била прекинута од стране плуг-инa \'{0}\' са поруком \'{1}\'';
            //Notifications
            this.Error = 'Грешка';
            this.Warning = 'Упозорење';
            this.Information = 'Информација';
            this.Success = 'Успјех';
            //Security
            this.Login = 'Пријављивање';
            this.UserName = 'Корисничко име';
            this.Password = 'Лозинка';
            this.InvalidUserNameOrPassword = 'Пријављиваље није било успјешно. Не важеће корисничко име или лозинка';
            this.StayLoggedIn = 'Дуготрајно пријављење';
            //Actions
            this.RetryActionsQuestion = 'Неке операције нису биле успјешне. Желите ли да их поновите?';
            this.CreateEntityMetadata = 'Додавање новог типа шеме';
            this.UpdateEntityMetadata = 'Ажурирање типа шеме';
            this.CreateEntity = 'Додавање записа';
            this.UpdateEntity = 'Ажурирање записа';
            this.DeleteEntity = 'Брисање записа';
            //Dashboard
            this.Dashboard = 'Дешборд';
            this.DashboardFor = 'Дешборд за \'{0}\'';
            this.RecentActivity = 'Скорашња активност';
            this.NoRecentActivity = 'Нема скорашње активности';
            this.TotalCount = 'Укупно: {0}';
            this.Created = 'Нове';
            this.Updated = 'Ажуриране';
            this.Deleted = 'Избрисане';
            this.LastModifiedRecords = 'Последња активност';
            this.LastModifiedRecordsByMe = 'Моја последња активност';
        }
        return ResourcesSr;
    })();
    Localization.ResourcesSr = ResourcesSr;
    (function () {
        _global.Localization.Resources = new Localization.ResourcesSr();
    })();
})(Localization || (Localization = {}));
