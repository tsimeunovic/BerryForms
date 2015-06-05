/// <reference path="../../interfaces/localization/IResources.ts" />

declare var _global:any;

//Resource file with translations for English language
module Localization {
    'use strict';

    export class ResourcesEn implements Localization.IResources {
        //Records
        CreateNewRecord:string = 'Create new \'{0}\'';
        UpdateExistingRecord:string = 'Update \'{0}\'';
        ListOfRecords:string = 'List of \'{0}\'';

        //Schema
        EditSchema:string = 'Edit schema';
        CreateNewEntity:string = 'Create new entity';
        CreateNewField:string = 'Create new field';
        ListOfEntityFields:string = 'Entity fields';
        EntityName:string = 'Entity name';
        EntityDescription:string = 'Entity description';
        EntityColor:string = 'Entity color';
        EntityIcon:string = 'Entity icon';
        FieldName:string = 'Field name';
        FieldDescription:string = 'Field description';
        FieldTypeName:string = 'Field type';
        TextField:string = 'Text field';
        EmailField:string = 'Email address field';
        NumberField:string = 'Number field';
        TextareaField:string = 'Textarea field';
        BooleanField:string = 'Boolean field';
        DateField:string = 'Date field';
        ListField:string = 'List field';
        SelectField:string = 'Select field';
        RelationField:string = 'Relationship field';
        FieldAlreadyExists:string = 'Field with chosen name already exists';
        CouldNotUpdateField:string = 'Could not update field';

        Required:string = 'Required';
        DisplayInList:string = 'Display in a list view';
        RegularExpression:string = 'Regular expression';
        MaxLength:string = 'Max length';
        ThreeState:string = 'Three state';
        MinDate:string = 'Min date';
        MaxDate:string = 'Max date';
        Values:string = 'Values';
        DefaultValue:string = 'Default value';
        MaxRecordsCount:string = 'Max records count';
        MaxRecordLength:string = 'Max records length';
        RelatedEntity:string = 'Related entity';
        SearchForEntity:string = 'Search for record ...';
        Searching:string = 'Searching ...';
        NoSearchResults:string = 'Search returned no results';
        MoreResults:string = '{0} more results ...';
        DateFrom:string = '{0} from';
        DateTo:string = '{0} to';
        AnyValue:string = 'Any value ...';
        AllowFloating:string = 'Allow decimal number';
        MinValue:string = 'Minimal value';
        MaxValue:string = 'Maximal value';
        NumberFrom:string = '{0} from';
        NumberTo:string = '{0} to';

        //Form
        PleaseSelect:string = 'Please select value ...';
        Create:string = 'Create';
        Update:string = 'Update';
        Add:string = 'Add';
        AddNewField:string = 'Add new field to \'{0}\'';
        UpdateField:string = 'Update field';
        Yes:string = 'Yes';
        Nothing:string = 'N/A';
        No:string = 'No';

        //List
        NoFieldsInNewEntity:string = 'There are no fields defined for this entity';
        NoFieldsInEntity:string = 'There are no fields defined for entity \'{0}\'';
        NoRecordsOfEntity:string = 'There are no records of entity type \'{0}\'';
        NoRecordsOfFilteredEntity:string = 'There are no records of entity type \'{0}\' that match current criteria';
        ShowListOf:string = 'Show list of \'{0}\'';
        ShowFilteredList:string = 'Show filtered list';

        //Colors
        ColorDefault:string = 'System default';
        ColorKhaki:string = 'Khaki';
        ColorGray:string = 'Gray';
        ColorLightPurple:string = 'Light purple';
        ColorPurple:string = 'Purple';
        ColorDarkPurple:string = 'Dark purple';
        ColorOrange:string = 'Orange';
        ColorViolet:string = 'Violet';
        ColorBlue:string = 'Blue';
        ColorBrown:string = 'Brown';

        //Icons
        IconBriefcase:string = 'Briefcase';
        IconCalendar:string = 'Calendar';
        IconFilm:string = 'Film';
        IconEuro:string = 'Euro';
        IconCloud:string = 'Cloud';
        IconEnvelope:string = 'Envelope';
        IconPencil:string = 'Pencil';
        IconMusic:string = 'Music';
        IconHeart:string = 'Heart';
        IconStar:string = 'Star';
        IconUser:string = 'Person';
        IconOk:string = 'Ok';
        IconRemove:string = 'Remove';
        IconSearch:string = 'Search';
        IconSignal:string = 'Signal';
        IconCog:string = 'Cog';
        IconHome:string = 'Home';
        IconTime:string = 'Time';
        IconRoad:string = 'Road';
        IconBarcode:string = 'Barcode';
        IconPrint:string = 'Print';
        IconLeaf:string = 'Leaf';
        IconFire:string = 'Fire';
        IconPlane:string = 'Plane';
        IconGlobe:string = 'Globe';
        IconPaperclip:string = 'Paperclip';
        IconCutlery:string = 'Cutlery';

        //Errors
        UnknownError:string = 'An unknown error has occurred';
        DatabaseConnectionError:string = 'An error occurred while connecting to database';
        IdGeneratingError:string = 'An error occurred while generating new identifier for \'{0}\'';
        FindByIdError:string = 'An error occurred during finding element with id \'{0}\' in collection \'{1}\'';
        FindMultipleError:string = 'An error occurred when retrieving records from collection \'{0}\'';
        CreateNewError:string = 'An error occurred while creating new record in collection \'{0}\'';
        UpdateExistingError:string = 'An error occurred while updating record from collection \'{0}\'';
        NonExistingFieldType:string = 'Could not find field component \'{0}\'';
        InvalidDataLoaded:string = 'An invalid data has been received from server';
        FindPagedError:string = 'Could not load page {1} of entity \'{0}\'';
        NonExistingPage:string = 'Requested page does not exist';
        ErrorRetrievingSearchResults:string = 'An error occurred during search';
        UnknownTypeValidation:string = 'Cannot validate unknown type \'{0}\'';
        EmptyMetadataValidation:string = 'Entity type must contain some data';
        NoIconMetadataValidation:string = 'Entity type must have defined icon';
        InvalidSystemNameMetadataValidation:string = 'Entity type does not have valid name';
        CouldNotVerifySystemNameMetadataValidation:string = 'An error occurred when verifying entity type name';
        ExistingSystemNameMetadataValidation:string = 'There is an already existing type with name \'{0}\'';
        EmptyEntityValidation:string = 'Entity must contain some data';
        UnknownTypeEntityValidation:string = 'Entity type cannot be determined';
        NoDataEntityValidation:string = 'Entity must contain some data';
        CouldNotLoadSchemaEntityValidation:string = 'An error occurred during entity validation';
        UnknownSchemaEntityErrorsModel:string = 'There is no entity type with name \'{0}\' defined';
        RequiredFieldMissingEntityValidation:string = 'Required field \'{0}\' is empty';

        //Success notification messages
        EntityCreatedSuccess:string = 'New entity has been successfully created';
        EntityModifiedSuccess:string = 'Entity has been successfully updated';
        EntityDeletedSuccess:string = 'Entity has been successfully deleted';
        MetadataCreatedSuccess:string = 'New entity type has been successfully created';
        MetadataSavedSuccess:string = 'Entity type has been successfully saved';
        MetadataFieldCreatedSuccess:string = 'New field has been successfully created';

        //Dialog
        Confirmation:string = 'Confirmation';
        DoYouReallyWantToDeleteEntity:string = 'Do you really want to delete this entity?';
        DoYouReallyWantToDeleteMetadataField:string = 'Do you really want to delete this field?';

        //Plugin
        UnknownPlugin:string = 'Unknown';
        OperationCancelledByPlugin:string = 'Operation was cancelled by plugin \'{0}\'';
        OperationCancelledByPluginWithMessage:string = 'Operation was cancelled by plugin \'{0}\' with message \'{1}\'';

        //Notifications
        Error:string = 'Error';
        Warning:string = 'Warning';
        Information:string = 'Information';
        Success:string = 'Success';

        //Security
        Login:string = 'Login';
        UserName:string = 'User name';
        Password:string = 'Password';
        InvalidUserNameOrPassword:string = 'Could not login user. Invalid user name or password';
        StayLoggedIn:string = 'Keep me logged in';

        //Actions
        RetryActionsQuestion:string = 'There were some unsuccessful operations. Do you want to retry them?';
        CreateEntityMetadata:string = 'Creation of entity type';
        UpdateEntityMetadata:string = 'Update of entity type';
        CreateEntity:string = 'Creation of entity';
        UpdateEntity:string = 'Update of entity';
        DeleteEntity:string = 'Deletion of entity';

        //Dashboard
        Dashboard:string = 'Dashboard';
        DashboardFor:string = '\'{0}\' dashboard';
        RecentActivity:string = 'Recently active entities';
        NoRecentActivity:string = 'No recent activity';
        TotalCount:string = 'Total count: {0}';
        Created:string = 'Created';
        Updated:string = 'Updated';
        Deleted:string = 'Deleted';
        LastModifiedRecords:string = 'Last modified records';
        LastModifiedRecordsByMe:string = 'Last modified records by me';
    }

    (function ():void {
        _global.Localization.Resources = new Localization.ResourcesEn();
    })();
}
