/// <reference path="../../interfaces/services/repository/IQueryCreatorService.ts" />

//Service that creates database queries
module Services {
    'use strict';

    export class QueryCreatorService implements Services.IQueryCreatorService {
        //@ngInject
        constructor() {
            //Nothing to do here
        }

        public CreateRelationSearchQuery(entityMetadata:Models.EntityMetadata, searchExpression:string):any {
            //Find field to search
            var searchFieldPredicate:(fm:Models.FieldMetadata) => boolean = function (fieldMetadata:Models.FieldMetadata):boolean {
                return ['Text', 'Textarea', 'Select'].contains(fieldMetadata.FieldTypeName) &&
                    fieldMetadata.DisplayInListName;
            };
            var searchField:Models.FieldMetadata = entityMetadata.Fields.first(searchFieldPredicate);
            if (!searchField) {
                return null;
            }

            //Create query
            var query:any = {};
            var queryExpressionField:string = 'Data.' + searchField.FieldSystemName;
            if (searchField.FieldTypeName === 'Select') {
                queryExpressionField += '.Text';
            }
            query[queryExpressionField] = {$regex: searchExpression, $options: 'i'};
            return query;
        }
    }
}
