/// <reference path="../../../../jasmine.d.ts" />
/// <reference path="../../../../../client/angular/services/communication/queueService.ts" />

'use strict';

describe('Service: QueueService', function ():void {
    var systemUnderTest:Services.QueueService;

    beforeEach(function():void {
        systemUnderTest = new Services.QueueService();
    });

    it('should be able to retrieve all messages in queue', function():void {
        //Arrange
        systemUnderTest.Queues.NextPage.Notifications.add('FirstError', Static.NotificationSeverity.Error);
        systemUnderTest.Queues.NextPage.Notifications.add('SecondWarning', Static.NotificationSeverity.Warning);

        //Act
        var messages:any[] = systemUnderTest.Queues.NextPage.Notifications.retrieveAll();
        var messagesAfter:any[] = systemUnderTest.Queues.NextPage.Notifications.retrieveAll();

        //Assert
        expect(messages.length).toEqual(2);
        expect(messages[0].Message).toEqual('FirstError');
        expect(messages[0].Severity).toEqual(Static.NotificationSeverity.Error);
        expect(messages[1].Message).toEqual('SecondWarning');
        expect(messages[1].Severity).toEqual(Static.NotificationSeverity.Warning);
        expect(messagesAfter.length).toEqual(0);
    });

    it('should be able to retrieve first message in queue', function():void {
        //Arrange
        systemUnderTest.Queues.NextPage.Notifications.add('FirstError', Static.NotificationSeverity.Error);
        systemUnderTest.Queues.NextPage.Notifications.add('SecondWarning', Static.NotificationSeverity.Warning);

        //Act
        var message:any = systemUnderTest.Queues.NextPage.Notifications.retrieveFirst();
        var message2:any = systemUnderTest.Queues.NextPage.Notifications.retrieveFirst();
        var message3:any = systemUnderTest.Queues.NextPage.Notifications.retrieveFirst();

        //Assert
        expect(message).not.toBe(null);
        expect(message.Message).toEqual('FirstError');
        expect(message.Severity).toEqual(Static.NotificationSeverity.Error);
        expect(message2).not.toBe(null);
        expect(message3).toBe(null);
    });

    it('should be able to retrieve last message in queue', function():void {
        //Arrange
        systemUnderTest.Queues.NextPage.Notifications.add('FirstError', Static.NotificationSeverity.Error);
        systemUnderTest.Queues.NextPage.Notifications.add('SecondWarning', Static.NotificationSeverity.Warning);

        //Act
        var message:any = systemUnderTest.Queues.NextPage.Notifications.retrieveLast();
        var message2:any = systemUnderTest.Queues.NextPage.Notifications.retrieveLast();
        var message3:any = systemUnderTest.Queues.NextPage.Notifications.retrieveLast();

        //Assert
        expect(message).not.toBe(null);
        expect(message.Message).toEqual('SecondWarning');
        expect(message.Severity).toEqual(Static.NotificationSeverity.Warning);
        expect(message2).not.toBe(null);
        expect(message3).toBe(null);
    });
});
