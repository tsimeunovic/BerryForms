/// <reference path="../../interfaces/services/repository/IQueryCreatorService.ts" />

'use strict';

//Service that creates database queries
module Services {
    export class QueryCreatorService implements Services.IQueryCreatorService {
        public static injection():any[] {
            return [
                QueryCreatorService
            ];
        }

        public CreateRelationSearchQuery(entityMetadata:Models.EntityMetadata, searchExpression:string):any {
            //Find field to search
            var searchFieldPredicate = function (fieldMetadata:Models.FieldMetadata) {
                return ['Text', 'Textarea', 'Select'].contains(fieldMetadata.FieldTypeName) &&
                    fieldMetadata.DisplayInListName;
            };
            var searchField:Models.FieldMetadata = entityMetadata.Fields.first(searchFieldPredicate);
            if (!searchField) return null;

            //Create query
            var query = {};
            var queryExpressionField = 'Data.' + searchField.FieldSystemName;
            if (searchField.FieldTypeName == 'Select') queryExpressionField += '.Text';
            query[queryExpressionField] = {$regex: searchExpression, $options: 'i'};
            return query;
        }
    }
}
