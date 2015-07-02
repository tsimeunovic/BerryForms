## Client architecture
Core of the client architecture is based upon few basic concepts. Every data object is represented by `Entity` class. That contains few basic metadata properties like identifier, creation time, creator, type etc. and `Data` property containing key/value pairs with data. Schema of any type is described by `EntityMetadata` class. Except properties like name, icon and description it contains also list of **fields** that will then entity of that type contain.

### Entity fields
Each field is represented by specific field metadata class that extends `FieldMetadata` class and adds specific property for given field (ie: maximum allowed length for text field, allowed date ranges for date field etc.). New field type can be easily added to the system by implementing `IFieldType` interface. That defines its name, directive, controller and functions that can format value, create form for field creation, parse/create query parameter and create database query from filter value. When new form is created each field is passed to `FieldComponentCreator` directive. This one then retrieves right field type from global `FieldTypesRegistry` and instantiate it so that appropriate instance can take care of further data manipulation.

### Messaging
Entire communication between components is done via `MessagingService`. It contains list of application-wide events with common interface for subscribing to event and publishing it. Events are described in `IMessagingServiceType` and are being organized by category.

```javascript
//Other event categories omitted
//...
public User:any = {
    LoggedOut: {
        subscribe: function (subscriber:(m:any) => void):() => void { throw new Error(); },
        unsubscribe: function (subscriber:(m:any) => void):void { throw new Error(); },
        publish: function (loggedOutUser:Models.UserSession):void { throw new Error(); }
    },
    LoggedIn: {
        subscribe: function (subscriber:(m:any) => void):() => void { throw new Error(); },
        unsubscribe: function (subscriber:(m:any) => void):void { throw new Error(); },
        publish: function (user:Models.UserSession):void { throw new Error(); }
    }
};
//...
```

Service itself keeps track of subscribers for particular event.

Base class for controllers `BaseController` contains method `AddSubscription` which automatically unsubscribe handlers when controller is destroyed. Controller event handler is registered as follows:

```javascript
this.AddSubscription(this.MessagingService.Messages.MessageCategory.Message.subscribe(this.HandlerFunction.bind(this)));
```

Services do not follow this practice as single instance exists entire application time.

### Repositories
Any external data that needs to be retrieved is accessed through particular repository service. For example user related data are available trough `UserRepositoryService` which contains specific methods for user related data. Same principle applies for `EntityRepositoryService` and `DashboardRepositoryService`. Except resolving correct url and retrieving data it often has to apply additional deserialization or post-retrieval logic. Http requests are not issued directly, but instead one additional abstraction layer is added. `HttpWrapperService` automatically adds authentication headers, handles expired session and in case of unauthenticated user it reschedules request for execution after user login and chains promises so that original invoker receives data afterwards.

### State
Repositories acts as proxy to data stored on server. They do not cache data nor do they know when they need to be refreshed. This are responsibilities of state services which caches data, monitor dependencies to determine when they need to be refreshed and maintain state that need to be persisted between views switching or application restart. There are 3 cache services that maintain different areas. `EntityListCacheService` takes care of entity records. `EntityMetadataListCacheService` stores data about entity schemas and `StateService` mainly operates with date related to user session. One additional service is `PersistentStorageService` which writes and reads data to and from *HTML5 Local Storage*.

For example `EntityListCacheService` keeps local copy of data for currently displayed page as well as next one and previous one. Once user switch to next page new data are available immediately and loading for next one is triggered on background. New data will contain unique `VersionIdentifier` which will be used to determine if data are still valid. Data will also be invalidated when user switch to page with different entity list where different data are needed.

### Localization
All localized strings in application are read from `LocalizationService` which contains both instance and static properties for accessing resources collection. Resources object for any language needs to implement `IResources` interface which contains all needed keys. When application starts, language is determined and appropriate resources are loaded from server and then registered. Angular bootstrapping is delayed till that point so when all controllers and services are created they can already access resources in right language.

### Plugins
Before some of the operations take place all plugins of certain type are executed. These can then react by any action or verify operation and cancel it if needed (not every operation can be cancelled). Every plugin needs to implement `IPlugin` interface which has 2 operations. One to return boolean variable determining whether plugin should be executed and second one implementing the action handler. Handler will then receive plugin context with informations about operation and methods for cancellation. After it does all necessary actions it then calls asynchronous callback which then continues with next plugin. All plugins are registered within global *Plugins Registry* object which is then queried by `PluginsExecutorService` to retrieve available plugins.
