/// <reference path="../../../../jasmine.d.ts" />
/// <reference path="../../../../../client/angular/services/communication/queueService.ts" />

'use strict';

describe('Service: QueueService', function () {
    var systemUnderTest:Services.QueueService;

    beforeEach(function(){
        systemUnderTest = new Services.QueueService();
    });

    it('should be able to retrieve all messages in queue', function() {
        //Arrange
        systemUnderTest.Queues.NextPage.Notifications.add('FirstError', Services.NotificationSeverity.Error);
        systemUnderTest.Queues.NextPage.Notifications.add('SecondWarning', Services.NotificationSeverity.Warning);

        //Act
        var messages = systemUnderTest.Queues.NextPage.Notifications.retrieveAll();
        var messagesAfter = systemUnderTest.Queues.NextPage.Notifications.retrieveAll();

        //Assert
        expect(messages.length).toEqual(2);
        expect(messages[0].Message).toEqual('FirstError');
        expect(messages[0].Severity).toEqual(Services.NotificationSeverity.Error);
        expect(messages[1].Message).toEqual('SecondWarning');
        expect(messages[1].Severity).toEqual(Services.NotificationSeverity.Warning);
        expect(messagesAfter.length).toEqual(0);
    });

    it('should be able to retrieve first message in queue', function() {
        //Arrange
        systemUnderTest.Queues.NextPage.Notifications.add('FirstError', Services.NotificationSeverity.Error);
        systemUnderTest.Queues.NextPage.Notifications.add('SecondWarning', Services.NotificationSeverity.Warning);

        //Act
        var message = systemUnderTest.Queues.NextPage.Notifications.retrieveFirst();
        var message2 = systemUnderTest.Queues.NextPage.Notifications.retrieveFirst();
        var message3 = systemUnderTest.Queues.NextPage.Notifications.retrieveFirst();

        //Assert
        expect(message).not.toBe(null);
        expect(message.Message).toEqual('FirstError');
        expect(message.Severity).toEqual(Services.NotificationSeverity.Error);
        expect(message2).not.toBe(null);
        expect(message3).toBe(null);
    });

    it('should be able to retrieve last message in queue', function() {
        //Arrange
        systemUnderTest.Queues.NextPage.Notifications.add('FirstError', Services.NotificationSeverity.Error);
        systemUnderTest.Queues.NextPage.Notifications.add('SecondWarning', Services.NotificationSeverity.Warning);

        //Act
        var message = systemUnderTest.Queues.NextPage.Notifications.retrieveLast();
        var message2 = systemUnderTest.Queues.NextPage.Notifications.retrieveLast();
        var message3 = systemUnderTest.Queues.NextPage.Notifications.retrieveLast();

        //Assert
        expect(message).not.toBe(null);
        expect(message.Message).toEqual('SecondWarning');
        expect(message.Severity).toEqual(Services.NotificationSeverity.Warning);
        expect(message2).not.toBe(null);
        expect(message3).toBe(null);
    });
});
