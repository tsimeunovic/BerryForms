'use strict';

//Interface for every resource file (with specific language localization)
module Localization {
    export interface IResources {
        //Records
        CreateNewRecord:string;
        UpdateExistingRecord:string;
        ListOfRecords:string;

        //Schema
        EditSchema:string;
        CreateNewEntity:string;
        CreateNewField:string;
        ListOfEntityFields:string;
        EntityName:string;
        EntityDescription:string;
        EntityColor:string;
        EntityIcon:string;
        FieldName:string;
        FieldDescription:string;
        FieldTypeName:string;
        TextField:string;
        TextareaField:string;
        BooleanField:string;
        DateField:string;
        ListField:string;
        SelectField:string;
        RelationField:string;
        FieldAlreadyExists:string;
        CouldNotUpdateField:string;

        Required:string;
        DisplayInList:string;
        RegularExpression:string;
        MaxLength:string;
        ThreeState:string;
        MinDate:string;
        MaxDate:string;
        Values:string;
        DefaultValue:string;
        MaxRecordsCount:string;
        MaxRecordLength:string;
        RelatedEntity:string;
        SearchForEntity:string;
        Searching:string;
        NoSearchResults:string;
        MoreResults:string;
        DateFrom:string;
        DateTo:string;
        AnyValue:string;

        //Form
        PleaseSelect:string;
        Create:string;
        Update:string;
        Add:string;
        AddNewField:string;
        UpdateField:string;
        Yes:string;
        Nothing:string;
        No:string;

        //List
        NoFieldsInNewEntity:string;
        NoFieldsInEntity:string;
        NoRecordsOfEntity:string;
        NoRecordsOfFilteredEntity:string;
        ShowListOf:string;
        ShowFilteredList:string;

        //Colors
        ColorDefault:string;
        ColorKhaki:string;
        ColorGray:string;
        ColorLightPurple:string;
        ColorPurple:string;
        ColorDarkPurple:string;
        ColorOrange:string;
        ColorViolet:string;
        ColorBlue:string;
        ColorBrown:string;

        //Icons
        IconBriefcase:string;
        IconCalendar:string;
        IconFilm:string;
        IconEuro:string;
        IconCloud:string;
        IconEnvelope:string;
        IconPencil:string;
        IconMusic:string;
        IconHeart:string;
        IconStar:string;
        IconUser:string;
        IconOk:string;
        IconRemove:string;
        IconSearch:string;
        IconSignal:string;
        IconCog:string;
        IconHome:string;
        IconTime:string;
        IconRoad:string;
        IconBarcode:string;
        IconPrint:string;
        IconLeaf:string;
        IconFire:string;
        IconPlane:string;
        IconGlobe:string;
        IconPaperclip:string;
        IconCutlery:string;

        //Errors
        UnknownError:string;
        DatabaseConnectionError:string;
        IdGeneratingError:string;
        FindByIdError:string;
        FindMultipleError:string;
        CreateNewError:string;
        UpdateExistingError:string;
        NonExistingFieldType:string;
        InvalidDataLoaded:string;
        FindPagedError:string;
        NonExistingPage:string;
        ErrorRetrievingSearchResults:string;
        UnknownTypeValidation:string;
        EmptyMetadataValidation:string;
        NoIconMetadataValidation:string;
        InvalidSystemNameMetadataValidation:string;
        CouldNotVerifySystemNameMetadataValidation:string;
        ExistingSystemNameMetadataValidation:string; //{0}
        EmptyEntityValidation:string;
        UnknownTypeEntityValidation:string;
        NoDataEntityValidation:string;
        CouldNotLoadSchemaEntityValidation:string;
        UnknownSchemaEntityErrorsModel:string; //{0}
        RequiredFieldMissingEntityValidation:string; //{0}

        //Success notification messages
        EntityCreatedSuccess:string;
        EntityModifiedSuccess:string;
        EntityDeletedSuccess:string;
        MetadataCreatedSuccess:string;
        MetadataSavedSuccess:string;
        MetadataFieldCreatedSuccess:string;

        //Dialog
        Confirmation:string;
        DoYouReallyWantToDeleteEntity:string;
        DoYouReallyWantToDeleteMetadataField:string;

        //Plugin
        UnknownPlugin:string;
        OperationCancelledByPlugin:string;
        OperationCancelledByPluginWithMessage:string;

        //Notifications
        Error:string;
        Warning:string;
        Information:string;
        Success:string;

        //Security
        UserUnauthenticated:string;
    }
}
