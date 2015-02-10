/// <reference path="../../../../jasmine.d.ts" />
/// <reference path="../../../mocks/callbackMock.ts" />
/// <reference path="../../../../../client/angular/services/state/stateService.ts" />

'use strict';

describe('Service: EntityListCacheService', function () {
    var systemUnderTest:Services.StateService;
    var callbackMock:Mocks.CallbackMock;

    beforeEach(function () {
        callbackMock = new Mocks.CallbackMock();
        systemUnderTest = new Services.StateService();
    });

    it('should be able to persist edited entity', function(){
        //Arrange
        var editedEntity = new Models.Entity('EditedEntityName');
        editedEntity.Id = 10;
        systemUnderTest.SetEditedEntity(editedEntity);

        //Act
        var editedEntity = systemUnderTest.GetEditedEntity('EditedEntityName', 10);

        //Assert
        expect(editedEntity).toBe(editedEntity);
    });

    it('should delete edited entity when other entity is requested', function(){
        //Arrange
        var editedEntity = new Models.Entity('EditedEntityName');
        editedEntity.Id = 10;
        systemUnderTest.SetEditedEntity(editedEntity);

        //Act
        var editedEntity1 = systemUnderTest.GetEditedEntity('EditedEntityName', 2);
        var editedEntity2 = systemUnderTest.GetEditedEntity('EditedEntityName', 10);

        //Assert
        expect(editedEntity1).toEqual(null);
        expect(editedEntity2).toEqual(null);
    });
});
