//Interface for Dialog service (entry point for creating dialogs)
module Services {
    'use strict';

    export interface IDialogService {
        CreateConfirmationDialog(confirmationText:string[], callback:(result:boolean) => void): void;
        RemoveDialog():void;
    }
}
