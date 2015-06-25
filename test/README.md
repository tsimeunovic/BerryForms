## Testing
Automated tests falls into 2 categories. Unit tests and end-to-end tests.

### Unit tests
Unit tests aim to test individual typescript classes without **any** involvement of angular code. Therefor no `$inject`, `$apply`, `$digest`, `$controller`, etc. are used.

> **Unit** test just code you wrote. Don't invoke any 3rd party library/framework with lots of side effects. It has been already tested by somebody else

At the beginning of every test, tested component is manually instantiated using regular `constructor(...)`. Instead of dependency resolution from angular, mock object is passed that implements dependency interface and usually contains spies for public methods. All unit tests follows this pattern regardless if they test controller or service.

```javascript
//Dependency interface
export interface IDependency {
    DoSomething():void;
}

//Component
export class Component {
    constructor(private Dependency:IDependency) {
    }

    public SomeMethod():void {
        //Implementation
    }

    //Additional code
}

//Mock
export class DependencyMock implements IDependency {
    constructor() {
        spyOn(this, 'DoSomething').and.callThrough();
    }

    public DoSomething():void {
        //May contain mock implementation
    }
}

//Test
describe('Component', function ():void {
    var dependencyMock:DependencyMock;
    var systemUnderTest:Component;

    beforeEach(function ():void {
        //Create tested component with all dependencies mocked
        dependencyMock = new DependencyMock();
        systemUnderTest = new Component(dependencyMock);
    });

    it('should do something with dependency', function ():void {
        //Arrange
        var doSomethingSpy:any = dependencyMock.DoSomething;

        //Act
        systemUnderTest.SomeMethod();

        //Assert
        expect(doSomethingSpy.calls.any()).toEqual(true);
    });
});
```

Once mock component is created it is easily reusable for all tests that require dependency that it implements. No module creation like `beforeEach(module('app'));` is required as it represents only unnecessary overhead. If any of more complex angular constructs are used in code we would like to test then we provide our own mock implementation. For example when `$scope.$watch(...)` is used, then we mock `$watch` function and if needed simulate its execution.

```javascript
//Scope mock
export class ScopeMock {
    constructor() {
        spyOn(this, '$watch').and.callThrough();
    }

    public $watch(expression:string, handler:() => void):void {
    }
}

//Test
describe('Component with $watch', function ():void {
    //Initialization code

    it('should do something with dependency', function ():void {
        //Arrange
        var watchSpy:any = scopeMock.$watch;
        var firstWatchExpression:string = watchSpy.calls.first().args[0];
        var firstWatchHandler:() => void = watchSpy.calls.first().args[1];

        //Act
        //Simulate $watch change
        firstWatchHandler();

        //Assert
        //Test something
    });
});
```

Same principle can be applied to `$on`, `$broadcast`, `$apply`, etc. and also to any other angular dependency like `$document`, `$timeout`, etc. For directives all logic is isolated into separate controller which is then tested same way so there is no need for `var element = $compile("<directive></directive>")($rootScope);` type of tests. Thanks to Typescript and explicit objects creation we have very good control over all dependencies so all tests are testing single unit instead of cross components integration. Once new dependency is added to component, Typescript compiler will make sure that its supplied in every test where component is create so we don't accidentally miss it. Thanks to that it never happens that change in xxx.ts file breaks unrelated yyyTests.ts tests.
