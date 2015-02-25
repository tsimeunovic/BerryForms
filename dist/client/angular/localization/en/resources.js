/// <reference path="../../interfaces/localization/IResources.ts" />
'use strict';
//Resource file with translations for English language
var Localization;
(function (Localization) {
    var ResourcesEn = (function () {
        function ResourcesEn() {
            //Records
            this.CreateNewRecord = 'Create new \'{0}\'';
            this.UpdateExistingRecord = 'Update \'{0}\'';
            this.ListOfRecords = 'List of \'{0}\'';
            //Schema
            this.EditSchema = 'Edit schema';
            this.CreateNewEntity = 'Create new entity';
            this.CreateNewField = 'Create new field';
            this.ListOfEntityFields = 'Entity fields';
            this.EntityName = 'Entity name';
            this.EntityDescription = 'Entity description';
            this.EntityColor = 'Entity color';
            this.EntityIcon = 'Entity icon';
            this.FieldName = 'Field name';
            this.FieldDescription = 'Field description';
            this.FieldTypeName = 'Field type';
            this.TextField = 'Text field';
            this.EmailField = 'Email address field';
            this.NumberField = 'Number field';
            this.TextareaField = 'Textarea field';
            this.BooleanField = 'Boolean field';
            this.DateField = 'Date field';
            this.ListField = 'List field';
            this.SelectField = 'Select field';
            this.RelationField = 'Relationship field';
            this.FieldAlreadyExists = 'Field with chosen name already exists';
            this.CouldNotUpdateField = 'Could not update field';
            this.Required = 'Required';
            this.DisplayInList = 'Display in a list view';
            this.RegularExpression = 'Regular expression';
            this.MaxLength = 'Max length';
            this.ThreeState = 'Three state';
            this.MinDate = 'Min date';
            this.MaxDate = 'Max date';
            this.Values = 'Values';
            this.DefaultValue = 'Default value';
            this.MaxRecordsCount = 'Max records count';
            this.MaxRecordLength = 'Max records length';
            this.RelatedEntity = 'Related entity';
            this.SearchForEntity = 'Search for record ...';
            this.Searching = 'Searching ...';
            this.NoSearchResults = 'Search returned no results';
            this.MoreResults = '{0} more results ...';
            this.DateFrom = '{0} from';
            this.DateTo = '{0} to';
            this.AnyValue = 'Any value ...';
            this.AllowFloating = 'Allow decimal number';
            this.MinValue = 'Minimal value';
            this.MaxValue = 'Maximal value';
            this.NumberFrom = '{0} from';
            this.NumberTo = '{0} to';
            //Form
            this.PleaseSelect = 'Please select value ...';
            this.Create = 'Create';
            this.Update = 'Update';
            this.Add = 'Add';
            this.AddNewField = 'Add new field to \'{0}\'';
            this.UpdateField = 'Update field';
            this.Yes = 'Yes';
            this.Nothing = 'N/A';
            this.No = 'No';
            //List
            this.NoFieldsInNewEntity = 'There are no fields defined for this entity';
            this.NoFieldsInEntity = 'There are no fields defined for entity \'{0}\'';
            this.NoRecordsOfEntity = 'There are no records of entity type \'{0}\'';
            this.NoRecordsOfFilteredEntity = 'There are no records of entity type \'{0}\' that match current criteria';
            this.ShowListOf = 'Show list of \'{0}\'';
            this.ShowFilteredList = 'Show filtered list';
            //Colors
            this.ColorDefault = 'System default';
            this.ColorKhaki = 'Khaki';
            this.ColorGray = 'Gray';
            this.ColorLightPurple = 'Light purple';
            this.ColorPurple = 'Purple';
            this.ColorDarkPurple = 'Dark purple';
            this.ColorOrange = 'Orange';
            this.ColorViolet = 'Violet';
            this.ColorBlue = 'Blue';
            this.ColorBrown = 'Brown';
            //Icons
            this.IconBriefcase = 'Briefcase';
            this.IconCalendar = 'Calendar';
            this.IconFilm = 'Film';
            this.IconEuro = 'Euro';
            this.IconCloud = 'Cloud';
            this.IconEnvelope = 'Envelope';
            this.IconPencil = 'Pencil';
            this.IconMusic = 'Music';
            this.IconHeart = 'Heart';
            this.IconStar = 'Star';
            this.IconUser = 'Person';
            this.IconOk = 'Ok';
            this.IconRemove = 'Remove';
            this.IconSearch = 'Search';
            this.IconSignal = 'Signal';
            this.IconCog = 'Cog';
            this.IconHome = 'Home';
            this.IconTime = 'Time';
            this.IconRoad = 'Road';
            this.IconBarcode = 'Barcode';
            this.IconPrint = 'Print';
            this.IconLeaf = 'Leaf';
            this.IconFire = 'Fire';
            this.IconPlane = 'Plane';
            this.IconGlobe = 'Globe';
            this.IconPaperclip = 'Paperclip';
            this.IconCutlery = 'Cutlery';
            //Errors
            this.UnknownError = 'An unknown error has occurred';
            this.DatabaseConnectionError = 'An error occurred while connecting to database';
            this.IdGeneratingError = 'An error occurred while generating new identifier for \'{0}\'';
            this.FindByIdError = 'An error occurred during finding element with id \'{0}\' in collection \'{1}\'';
            this.FindMultipleError = 'An error occurred when retrieving records from collection \'{0}\'';
            this.CreateNewError = 'An error occurred while creating new record in collection \'{0}\'';
            this.UpdateExistingError = 'An error occurred while updating record from collection \'{0}\'';
            this.NonExistingFieldType = 'Could not find field component \'{0}\'';
            this.InvalidDataLoaded = 'An invalid data has been received from server';
            this.FindPagedError = 'Could not load page {1} of entity \'{0}\'';
            this.NonExistingPage = 'Requested page does not exist';
            this.ErrorRetrievingSearchResults = 'An error occurred during search';
            this.UnknownTypeValidation = 'Cannot validate unknown type \'{0}\'';
            this.EmptyMetadataValidation = 'Entity type must contain some data';
            this.NoIconMetadataValidation = 'Entity type must have defined icon';
            this.InvalidSystemNameMetadataValidation = 'Entity type does not have valid name';
            this.CouldNotVerifySystemNameMetadataValidation = 'An error occurred when verifying entity type name';
            this.ExistingSystemNameMetadataValidation = 'There is an already existing type with name \'{0}\'';
            this.EmptyEntityValidation = 'Entity must contain some data';
            this.UnknownTypeEntityValidation = 'Entity type cannot be determined';
            this.NoDataEntityValidation = 'Entity must contain some data';
            this.CouldNotLoadSchemaEntityValidation = 'An error occurred during entity validation';
            this.UnknownSchemaEntityErrorsModel = 'There is no entity type with name \'{0}\' defined';
            this.RequiredFieldMissingEntityValidation = 'Required field \'{0}\' is empty';
            //Success notification messages
            this.EntityCreatedSuccess = 'New entity has been successfully created';
            this.EntityModifiedSuccess = 'Entity has been successfully updated';
            this.EntityDeletedSuccess = 'Entity has been successfully deleted';
            this.MetadataCreatedSuccess = 'New entity type has been successfully created';
            this.MetadataSavedSuccess = 'Entity type has been successfully saved';
            this.MetadataFieldCreatedSuccess = 'New field has been successfully created';
            //Dialog
            this.Confirmation = 'Confirmation';
            this.DoYouReallyWantToDeleteEntity = 'Do you really want to delete this entity?';
            this.DoYouReallyWantToDeleteMetadataField = 'Do you really want to delete this field?';
            //Plugin
            this.UnknownPlugin = 'Unknown';
            this.OperationCancelledByPlugin = 'Operation was cancelled by plugin \'{0}\'';
            this.OperationCancelledByPluginWithMessage = 'Operation was cancelled by plugin \'{0}\' with message \'{1}\'';
            //Notifications
            this.Error = 'Error';
            this.Warning = 'Warning';
            this.Information = 'Information';
            this.Success = 'Success';
            //Security
            this.Login = 'Login';
            this.UserName = 'User name';
            this.Password = 'Password';
            this.InvalidUserNameOrPassword = 'Could not login user. Invalid user name or password';
            //Actions
            this.RetryActionsQuestion = 'There were some unsuccessful operations. Do you want to retry them?';
            this.CreateEntityMetadata = 'Creation of entity type';
            this.UpdateEntityMetadata = 'Update of entity type';
            this.CreateEntity = 'Creation of entity';
            this.UpdateEntity = 'Update of entity';
            this.DeleteEntity = 'Deletion of entity';
        }
        return ResourcesEn;
    })();
    Localization.ResourcesEn = ResourcesEn;
    (function () {
        _global.Localization.Resources = new Localization.ResourcesEn();
    })();
})(Localization || (Localization = {}));
