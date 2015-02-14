/// <reference path="../../interfaces/localization/IResources.ts" />
'use strict';
//Resource file with translations for Slovak language
var Localization;
(function (Localization) {
    var ResourcesSk = (function () {
        function ResourcesSk() {
            //Records
            this.CreateNewRecord = 'Vytvoriť \'{0}\'';
            this.UpdateExistingRecord = 'Aktualizovať \'{0}\'';
            this.ListOfRecords = 'Zoznam \'{0}\'';
            //Schema
            this.EditSchema = 'Upraviť schému';
            this.CreateNewEntity = 'Vytvoriť novú entitu';
            this.CreateNewField = 'Vytvoriť nové pole';
            this.ListOfEntityFields = 'Zoznam polí';
            this.EntityName = 'Meno entity';
            this.EntityDescription = 'Popis entity';
            this.EntityColor = 'Farba entity';
            this.EntityIcon = 'Ikona entity';
            this.FieldName = 'Meno';
            this.FieldDescription = 'Popis';
            this.FieldTypeName = 'Typ';
            this.TextField = 'Text';
            this.TextareaField = 'Viacriadkový text';
            this.BooleanField = 'Áno/nie';
            this.DateField = 'Dátum';
            this.ListField = 'Viacprvkový zoznam';
            this.SelectField = 'Zoznam';
            this.RelationField = 'Väzba na entitu';
            this.FieldAlreadyExists = 'Pole s rovnakým menom už existuje';
            this.CouldNotUpdateField = 'Nebolo možné aktualizovať pole';
            this.Required = 'Povinné pole';
            this.DisplayInList = 'Zobraziť v pohľade zoznamu';
            this.RegularExpression = 'Regulárny výraz';
            this.MaxLength = 'Maximálna dĺžka';
            this.ThreeState = 'Trojstavový';
            this.MinDate = 'Minimálny dátum';
            this.MaxDate = 'Maximálny dátum';
            this.Values = 'Hodnoty';
            this.DefaultValue = 'Východzia hodnota';
            this.MaxRecordsCount = 'Maximálny počet položiek';
            this.MaxRecordLength = 'Maximálna dĺžka položky';
            this.RelatedEntity = 'Naviazaná entity';
            this.SearchForEntity = 'Vyhľadať záznam ...';
            this.Searching = 'Vyhľadávam ...';
            this.NoSearchResults = 'Žiadne výsledky vyhľadávania';
            this.MoreResults = '{0} ďalších výsledkov ...';
            this.DateFrom = '{0} od';
            this.DateTo = '{0} do';
            this.AnyValue = 'Všetky hodnoty ...';
            //Form
            this.PleaseSelect = 'Zvoľte hodnotu ...';
            this.Create = 'Vytvoriť';
            this.Update = 'Aktualizovať';
            this.Add = 'Pridať';
            this.AddNewField = 'Pridať pole do \'{0}\'';
            this.UpdateField = 'Aktualizovať pole';
            this.Yes = 'Áno';
            this.Nothing = 'Nič';
            this.No = 'Nie';
            //List
            this.NoFieldsInNewEntity = 'Pre túto entity nie sú definované žiadne polia';
            this.NoFieldsInEntity = 'Nie sú definované žiadne polia pre entitu \'{0}\'';
            this.NoRecordsOfEntity = 'Nie sú žiadne záznamy pre typ entity \'{0}\'';
            this.NoRecordsOfFilteredEntity = 'Pre typ entity \'{0}\' nie sú žiadne záznamy spĺňajúce zadané kritéria';
            this.ShowListOf = 'Zobraziť zoznam záznamov typu \'{0}\'';
            this.ShowFilteredList = 'Zobraziť zoznam s filtrom';
            //Colors
            this.ColorDefault = 'Východzia systémová';
            this.ColorKhaki = 'Khaki';
            this.ColorGray = 'Šedá';
            this.ColorLightPurple = 'Svetlo purpurová';
            this.ColorPurple = 'Purpurová';
            this.ColorDarkPurple = 'Tmavo purpurová';
            this.ColorOrange = 'Oranžová';
            this.ColorViolet = 'Fialová';
            this.ColorBlue = 'Modrá';
            this.ColorBrown = 'Hnedá';
            //Icons
            this.IconBriefcase = 'Kufrík';
            this.IconCalendar = 'Kalendár';
            this.IconFilm = 'Film';
            this.IconEuro = 'Euro';
            this.IconCloud = 'Oblak';
            this.IconEnvelope = 'Obálka';
            this.IconPencil = 'Ceruzka';
            this.IconMusic = 'Hudba';
            this.IconHeart = 'Srdce';
            this.IconStar = 'Hviezda';
            this.IconUser = 'Osoba';
            this.IconOk = 'Ok';
            this.IconRemove = 'Odstránenie';
            this.IconSearch = 'Vyhľadávanie';
            this.IconSignal = 'Signál';
            this.IconCog = 'Koliesko';
            this.IconHome = 'Dom';
            this.IconTime = 'Čas';
            this.IconRoad = 'Cesta';
            this.IconBarcode = 'Čiarový kód';
            this.IconPrint = 'Tlač';
            this.IconLeaf = 'List';
            this.IconFire = 'Oheň';
            this.IconPlane = 'Lietadlo';
            this.IconGlobe = 'Zemeguľa';
            this.IconPaperclip = 'Spinka';
            this.IconCutlery = 'Príbor';
            //Errors
            this.UnknownError = 'Vyskytla sa neznáma chyba';
            this.DatabaseConnectionError = 'Vyskytla sa chyba pri pripájaní do databázy';
            this.IdGeneratingError = 'Vyskytla sa chyba pri generovaní nového identifikátora pre \'{0}\'';
            this.FindByIdError = 'Vyskytla sa chyba pri vyhľadávaní záznamu s id \'{0}\' z kolekcie \'{1}\'';
            this.FindMultipleError = 'Vyskytla sa chyba pri načítavaní záznamov z kolekcie \'{0}\'';
            this.CreateNewError = 'Vyskytla sa chyba pri vytváraní záznamu v kolekcii \'{0}\'';
            this.UpdateExistingError = 'Vyskytla sa chyba pri aktualizovaní záznamu v kolekcii  \'{0}\'';
            this.NonExistingFieldType = 'Nebolo možné nájsť typ poľa \'{0}\'';
            this.InvalidDataLoaded = 'Zo serveru sa nepodarilo načítať platné záznamy';
            this.FindPagedError = 'Nebolo možné načítať stranu záznamov {1} kolekcie \'{0}\'';
            this.NonExistingPage = 'Požadovaná strana záznamov neexistuje';
            this.ErrorRetrievingSearchResults = 'Nastala chyba pri vyhľadávaní';
            this.UnknownTypeValidation = 'Nebolo možné zvalidovať neznámy typ \'{0}\'';
            this.EmptyMetadataValidation = 'Typ entity musí obsahovať nejaké data';
            this.NoIconMetadataValidation = 'Ikona typu musí byť zadaná';
            this.InvalidSystemNameMetadataValidation = 'Neplatné meno pre typ entity';
            this.CouldNotVerifySystemNameMetadataValidation = 'Pri validácii mena typu nastala chyba';
            this.ExistingSystemNameMetadataValidation = 'Typ entity s menom \'{0}\' už existuje';
            this.EmptyEntityValidation = 'Entita musí obsahovať nejaké data';
            this.UnknownTypeEntityValidation = 'Nebolo možné zistiť typ entity';
            this.NoDataEntityValidation = 'Entita musí obsahovať nejaké data';
            this.CouldNotLoadSchemaEntityValidation = 'Nastala chyba pri validácii entity';
            this.UnknownSchemaEntityErrorsModel = 'Typ entity \'{0}\' nie je definovaný';
            this.RequiredFieldMissingEntityValidation = 'Povinné pole \'{0}\' je prázdne';
            //Success notification messages
            this.EntityCreatedSuccess = 'Nová entita bola úspešne vytvorená';
            this.EntityModifiedSuccess = 'Entita bola úspešne aktualizovaná';
            this.EntityDeletedSuccess = 'Entita bola úspešne vymazaná';
            this.MetadataCreatedSuccess = 'Nový typ entity bol úspešne vytvorený';
            this.MetadataSavedSuccess = 'Typ entity bol úspešne uložený';
            this.MetadataFieldCreatedSuccess = 'Nové pole bolo úspešne vytvorené';
            //Dialog
            this.Confirmation = 'Potvrdenie';
            this.DoYouReallyWantToDeleteEntity = 'Naozaj si prajete odstrániť tento záznam?';
            this.DoYouReallyWantToDeleteMetadataField = 'Naozaj si prajete odstrániť toto pole?';
            //Plugin
            this.UnknownPlugin = 'Neznámy';
            this.OperationCancelledByPlugin = 'Operácia bola zrušená pluginom \'{0}\'';
            this.OperationCancelledByPluginWithMessage = 'Operácia bola zrušená pluginom \'{0}\' s správou \'{1}\'';
            //Notifications
            this.Error = 'Chyba';
            this.Warning = 'Varovanie';
            this.Information = 'Informácia';
            this.Success = 'Úspech';
        }
        return ResourcesSk;
    })();
    Localization.ResourcesSk = ResourcesSk;
    (function () {
        _global.Localization.Resources = new Localization.ResourcesSk();
    })();
})(Localization || (Localization = {}));