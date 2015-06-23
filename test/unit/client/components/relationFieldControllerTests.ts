/// <reference path="../../../jasmine.d.ts" />
/// <reference path="../../mocks/scopeMock.ts" />
/// <reference path="../../mocks/entityRepositoryServiceMock.ts" />
/// <reference path="../../mocks/entityMetadataListCacheServiceMock.ts" />
/// <reference path="../../mocks/redirectServiceMock.ts" />
/// <reference path="../../../../client/extensions/stringExtensions.ts" />
/// <reference path="../../../../client/angular/models/core/entityModel.ts" />
/// <reference path="../../../../client/angular/components/fieldTypes/relation/relationFieldMetadataModel.ts" />
/// <reference path="../../../../client/angular/components/fieldTypes/relation/relationFieldController.ts" />

describe('Field Controller: RelationFieldController', function ():void {
    var scopeMock:any;
    var entity:Models.Entity;
    var fieldMetadata:Models.RelationFieldMetadata;
    var entityRepositoryServiceMock:Mocks.EntityRepositoryServiceMock;
    var entityMetadataListCacheServiceMock:Mocks.EntityMetadataListCacheServiceMock;
    var redirectServiceMock:Mocks.RedirectServiceMock;
    var originalSearchTypingWaitTimeMs:number;
    var systemUnderTest:Components.FieldTypes.RelationFieldController;

    var createRelationFieldController:() => void = function ():void {
        systemUnderTest = new Components.FieldTypes.RelationFieldController(scopeMock,
            entityRepositoryServiceMock, entityMetadataListCacheServiceMock, redirectServiceMock);
    };

    beforeEach(function ():void {
        entity = new Models.Entity('Test');
        fieldMetadata = new Models.RelationFieldMetadata();
        fieldMetadata.FieldSystemName = 'TestField';
        fieldMetadata.RelatedEntity = new Models.SelectFieldOptionMetadata(null, 'RelatedEntity');

        scopeMock = new Mocks.ScopeMock();
        scopeMock.Entity = entity;
        scopeMock.field = fieldMetadata;

        entityRepositoryServiceMock = new Mocks.EntityRepositoryServiceMock();
        entityMetadataListCacheServiceMock = new Mocks.EntityMetadataListCacheServiceMock();
        redirectServiceMock = new Mocks.RedirectServiceMock();
        originalSearchTypingWaitTimeMs = Config.Client.SearchTypingWaitTimeMs;

        createRelationFieldController();
    });

    afterEach(function ():void {
        Config.Client.SearchTypingWaitTimeMs = originalSearchTypingWaitTimeMs;
    });

    it('should be able to create url for item', function ():void {
        //Arrange
        var itemOption:Models.SelectFieldOptionMetadata = new Models.SelectFieldOptionMetadata('Item text', '12');

        //Act
        var url:string = systemUnderTest.GetFollowItemUrl(itemOption);

        //Assert
        expect(url).toEqual('mockEditEntityUrl/RelatedEntity/12');
    });

    it('should not schedule search when search expression length does not reach minimum configured length', function ():void {
        //Arrange
        var loadEntityMetadataFromCacheSpy:any = entityMetadataListCacheServiceMock.LoadEntityMetadataFromCache;
        systemUnderTest.SearchExpression = 'a';
        systemUnderTest.SearchResults = [];

        //Act
        systemUnderTest.ScheduleSearch();

        //Assert
        expect(systemUnderTest.SearchTimer).toBeFalsy();
        expect(systemUnderTest.SearchResults).toBeFalsy();
        expect(loadEntityMetadataFromCacheSpy.calls.any()).toEqual(false);
    });

    it('should schedule search when search expression length reach minimum configured length', function ():void {
        //Arrange
        var loadEntityMetadataFromCacheSpy:any = entityMetadataListCacheServiceMock.LoadEntityMetadataFromCache;
        systemUnderTest.SearchExpression = 'abcdefg';

        //Act
        systemUnderTest.ScheduleSearch();

        //Assert
        expect(systemUnderTest.SearchTimer).toBeGreaterThan(0);
        expect(loadEntityMetadataFromCacheSpy.calls.any()).toEqual(false);
        clearTimeout(systemUnderTest.SearchTimer); //Cleanup
    });

    it('should cancel previously scheduled search when user start typing again', function ():void {
        //Arrange
        var loadEntityMetadataFromCacheSpy:any = entityMetadataListCacheServiceMock.LoadEntityMetadataFromCache;
        systemUnderTest.SearchExpression = 'abcdefg';

        //Act
        systemUnderTest.ScheduleSearch();
        systemUnderTest.SearchExpression = 'a';
        systemUnderTest.ScheduleSearch();

        //Assert
        expect(systemUnderTest.SearchTimer).toBeFalsy();
        expect(loadEntityMetadataFromCacheSpy.calls.any()).toEqual(false);
    });

    describe('when search expression is long enough and user is inactive for given period of time', function ():void {
        beforeEach(function (done:any):void {
            //Arrange
            systemUnderTest.SearchExpression = 'abcdefg';
            Config.Client.SearchTypingWaitTimeMs = 0;

            //Act (and Wait)
            systemUnderTest.ScheduleSearch();
            setTimeout(done, 1);
        });

        it('should start searching for records', function ():void {
            //Arrange
            var loadEntityMetadataFromCacheSpy:any = entityMetadataListCacheServiceMock.LoadEntityMetadataFromCache;
            var loadSearchResultsSpy:any = entityRepositoryServiceMock.LoadSearchResults;

            //Assert
            expect(systemUnderTest.SearchTimer).toBeFalsy();
            expect(loadEntityMetadataFromCacheSpy.calls.any()).toEqual(true);
            expect(loadEntityMetadataFromCacheSpy.calls.first().args[0]).toEqual('RelatedEntity');
            expect(loadSearchResultsSpy.calls.any()).toEqual(true);
            expect(loadSearchResultsSpy.calls.first().args[1]).toEqual('abcdefg');
        });

        it('should create \'SearchResults\' object from response data', function ():void {
            //Assert
            expect(systemUnderTest.SearchResults).toBeTruthy();
            expect(systemUnderTest.SearchResults.length).toEqual(4);
            expect(systemUnderTest.SearchResults.HasError).toEqual(false);
            expect(systemUnderTest.SearchResults.MoreResults).toEqual(16);
        });
    });

    it('should set entity value and reset search result when item is selected', function ():void {
        //Arrange
        var item:Models.SelectFieldOptionMetadata = new Models.SelectFieldOptionMetadata('Text', 'Value');
        systemUnderTest.SearchResults = [];
        systemUnderTest.SearchExpression = 'abc';

        //Act
        systemUnderTest.SelectItem(item);

        //Assert
        expect(systemUnderTest.GetBoundFieldValue()).toEqual(item);
        expect(systemUnderTest.SearchResults).toBeFalsy();
        expect(systemUnderTest.SearchExpression).toBeFalsy();
    });
});
