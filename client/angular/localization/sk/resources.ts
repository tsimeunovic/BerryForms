/// <reference path="../../interfaces/localization/IResources.ts" />

'use strict';
declare var _global:any;

//Resource file with translations for Slovak language
module Localization {
    export class ResourcesSk implements Localization.IResources {
        //Records
        CreateNewRecord:string = 'Vytvoriť \'{0}\'';
        UpdateExistingRecord:string = 'Aktualizovať \'{0}\'';
        ListOfRecords:string = 'Zoznam \'{0}\'';

        //Schema
        EditSchema:string = 'Upraviť schému';
        CreateNewEntity:string = 'Vytvoriť novú entitu';
        CreateNewField:string = 'Vytvoriť nové pole';
        ListOfEntityFields:string = 'Zoznam polí';
        EntityName:string = 'Meno entity';
        EntityDescription:string = 'Popis entity';
        EntityColor:string = 'Farba entity';
        EntityIcon:string = 'Ikona entity';
        FieldName:string = 'Meno';
        FieldDescription:string = 'Popis';
        FieldTypeName:string = 'Typ';
        TextField:string = 'Text';
        EmailField:string;
        NumberField:string;
        TextareaField:string = 'Viacriadkový text';
        BooleanField:string = 'Áno/nie';
        DateField:string = 'Dátum';
        ListField:string = 'Viacprvkový zoznam';
        SelectField:string = 'Zoznam';
        RelationField:string = 'Väzba na entitu';
        FieldAlreadyExists:string = 'Pole s rovnakým menom už existuje';
        CouldNotUpdateField:string = 'Nebolo možné aktualizovať pole';

        Required:string = 'Povinné pole';
        DisplayInList:string = 'Zobraziť v pohľade zoznamu';
        RegularExpression:string = 'Regulárny výraz';
        MaxLength:string = 'Maximálna dĺžka';
        ThreeState:string = 'Trojstavový';
        MinDate:string = 'Minimálny dátum';
        MaxDate:string = 'Maximálny dátum';
        Values:string = 'Hodnoty';
        DefaultValue:string = 'Východzia hodnota';
        MaxRecordsCount:string = 'Maximálny počet položiek';
        MaxRecordLength:string = 'Maximálna dĺžka položky';
        RelatedEntity:string = 'Naviazaná entity';
        SearchForEntity:string = 'Vyhľadať záznam ...';
        Searching:string = 'Vyhľadávam ...';
        NoSearchResults:string = 'Žiadne výsledky vyhľadávania';
        MoreResults:string = '{0} ďalších výsledkov ...';
        DateFrom:string = '{0} od';
        DateTo:string = '{0} do';
        AnyValue:string = 'Všetky hodnoty ...';
        AllowFloating:string;
        MinValue:string;
        MaxValue:string;
        NumberFrom:string;
        NumberTo:string;

        //Form
        PleaseSelect:string = 'Zvoľte hodnotu ...';
        Create:string = 'Vytvoriť';
        Update:string = 'Aktualizovať';
        Add:string = 'Pridať';
        AddNewField:string = 'Pridať pole do \'{0}\'';
        UpdateField:string = 'Aktualizovať pole';
        Yes:string = 'Áno';
        Nothing:string = 'Nič';
        No:string = 'Nie';

        //List
        NoFieldsInNewEntity:string = 'Pre túto entity nie sú definované žiadne polia';
        NoFieldsInEntity:string = 'Nie sú definované žiadne polia pre entitu \'{0}\'';
        NoRecordsOfEntity:string = 'Nie sú žiadne záznamy pre typ entity \'{0}\'';
        NoRecordsOfFilteredEntity:string = 'Pre typ entity \'{0}\' nie sú žiadne záznamy spĺňajúce zadané kritéria';
        ShowListOf:string = 'Zobraziť zoznam záznamov typu \'{0}\'';
        ShowFilteredList:string = 'Zobraziť zoznam s filtrom';

        //Colors
        ColorDefault:string = 'Východzia systémová';
        ColorKhaki:string = 'Khaki';
        ColorGray:string = 'Šedá';
        ColorLightPurple:string = 'Svetlo purpurová';
        ColorPurple:string = 'Purpurová';
        ColorDarkPurple:string = 'Tmavo purpurová';
        ColorOrange:string = 'Oranžová';
        ColorViolet:string = 'Fialová';
        ColorBlue:string = 'Modrá';
        ColorBrown:string = 'Hnedá';

        //Icons
        IconBriefcase:string = 'Kufrík';
        IconCalendar:string = 'Kalendár';
        IconFilm:string = 'Film';
        IconEuro:string = 'Euro';
        IconCloud:string = 'Oblak';
        IconEnvelope:string = 'Obálka';
        IconPencil:string = 'Ceruzka';
        IconMusic:string = 'Hudba';
        IconHeart:string = 'Srdce';
        IconStar:string = 'Hviezda';
        IconUser:string = 'Osoba';
        IconOk:string = 'Ok';
        IconRemove:string = 'Odstránenie';
        IconSearch:string = 'Vyhľadávanie';
        IconSignal:string = 'Signál';
        IconCog:string = 'Koliesko';
        IconHome:string = 'Dom';
        IconTime:string = 'Čas';
        IconRoad:string = 'Cesta';
        IconBarcode:string = 'Čiarový kód';
        IconPrint:string = 'Tlač';
        IconLeaf:string = 'List';
        IconFire:string = 'Oheň';
        IconPlane:string = 'Lietadlo';
        IconGlobe:string = 'Zemeguľa';
        IconPaperclip:string = 'Spinka';
        IconCutlery:string = 'Príbor';

        //Errors
        UnknownError:string = 'Vyskytla sa neznáma chyba';
        DatabaseConnectionError:string = 'Vyskytla sa chyba pri pripájaní do databázy';
        IdGeneratingError:string = 'Vyskytla sa chyba pri generovaní nového identifikátora pre \'{0}\'';
        FindByIdError:string = 'Vyskytla sa chyba pri vyhľadávaní záznamu s id \'{0}\' z kolekcie \'{1}\'';
        FindMultipleError:string = 'Vyskytla sa chyba pri načítavaní záznamov z kolekcie \'{0}\'';
        CreateNewError:string = 'Vyskytla sa chyba pri vytváraní záznamu v kolekcii \'{0}\'';
        UpdateExistingError:string = 'Vyskytla sa chyba pri aktualizovaní záznamu v kolekcii  \'{0}\'';
        NonExistingFieldType:string = 'Nebolo možné nájsť typ poľa \'{0}\'';
        InvalidDataLoaded:string = 'Zo serveru sa nepodarilo načítať platné záznamy';
        FindPagedError:string = 'Nebolo možné načítať stranu záznamov {1} kolekcie \'{0}\'';
        NonExistingPage:string = 'Požadovaná strana záznamov neexistuje';
        ErrorRetrievingSearchResults:string = 'Nastala chyba pri vyhľadávaní';
        UnknownTypeValidation:string = 'Nebolo možné zvalidovať neznámy typ \'{0}\'';
        EmptyMetadataValidation:string = 'Typ entity musí obsahovať nejaké data';
        NoIconMetadataValidation:string = 'Ikona typu musí byť zadaná';
        InvalidSystemNameMetadataValidation:string = 'Neplatné meno pre typ entity';
        CouldNotVerifySystemNameMetadataValidation:string = 'Pri validácii mena typu nastala chyba';
        ExistingSystemNameMetadataValidation:string = 'Typ entity s menom \'{0}\' už existuje';
        EmptyEntityValidation:string = 'Entita musí obsahovať nejaké data';
        UnknownTypeEntityValidation:string = 'Nebolo možné zistiť typ entity';
        NoDataEntityValidation:string = 'Entita musí obsahovať nejaké data';
        CouldNotLoadSchemaEntityValidation:string = 'Nastala chyba pri validácii entity';
        UnknownSchemaEntityErrorsModel:string = 'Typ entity \'{0}\' nie je definovaný';
        RequiredFieldMissingEntityValidation:string = 'Povinné pole \'{0}\' je prázdne';

        //Success notification messages
        EntityCreatedSuccess:string = 'Nová entita bola úspešne vytvorená';
        EntityModifiedSuccess:string = 'Entita bola úspešne aktualizovaná';
        EntityDeletedSuccess:string = 'Entita bola úspešne vymazaná';
        MetadataCreatedSuccess:string = 'Nový typ entity bol úspešne vytvorený';
        MetadataSavedSuccess:string = 'Typ entity bol úspešne uložený';
        MetadataFieldCreatedSuccess:string = 'Nové pole bolo úspešne vytvorené';

        //Dialog
        Confirmation:string = 'Potvrdenie';
        DoYouReallyWantToDeleteEntity:string = 'Naozaj si prajete odstrániť tento záznam?';
        DoYouReallyWantToDeleteMetadataField:string = 'Naozaj si prajete odstrániť toto pole?';

        //Plugin
        UnknownPlugin:string = 'Neznámy';
        OperationCancelledByPlugin:string = 'Operácia bola zrušená pluginom \'{0}\'';
        OperationCancelledByPluginWithMessage:string = 'Operácia bola zrušená pluginom \'{0}\' s správou \'{1}\'';

        //Notifications
        Error:string = 'Chyba';
        Warning:string = 'Varovanie';
        Information:string = 'Informácia';
        Success:string = 'Úspech';

        //Security
        Login:string = 'Prihlásenie';
        UserName:string;
        Password:string;
        UserUnauthenticated:string;
        InvalidUserNameOrPassword:string;

        //Actions
        RetryActionsQuestion:string;
        CreateEntityMetadata:string;
        UpdateEntityMetadata:string;
        CreateEntity:string;
        UpdateEntity:string;
        DeleteEntity:string;
    }

    (function () {
        _global.Localization.Resources = new Localization.ResourcesSk();
    })();
}
