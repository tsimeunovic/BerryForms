var Model;
(function (Model) {
    'use strict';
    var ErrorsModel = (function () {
        function ErrorsModel() {
            this.Errors = [];
        }
        ErrorsModel.prototype.HasErrors = function () {
            return this.Errors && this.Errors.length > 0;
        };
        return ErrorsModel;
    })();
    Model.ErrorsModel = ErrorsModel;
})(Model = exports.Model || (exports.Model = {}));
//# sourceMappingURL=ErrorsModel.js.map