# ComponentZoo

A Library of Classes for Building Web Components

CDN Link: http://www.alexmercedcoder.com/componentzoo.js (11kb)

CDN Link (ES 6 MODULE VERSION): http://www.alexmercedcoder.com/componentzoomodule.js (13 kb)

CDN Link (Node MODULE.Exports VERSION): http://www.alexmercedcoder.com/componentzoonpm.js (14 kb)

# StyledWrapper

This class is to make a wrapper to style element slotted within the component. Since you are styling slotted element your selector must use the ::slotted(selector) syntax. There is also a makeWrapper function to abbreviate the syntax. Your style function generate your styles and can make use of props.

Making the wrapper using the class directly

```
class ColorTitle extends StyledWrapper {
    style(props) {
        return `::slotted(h1) {color: ${props.colors};}`;
    }
}

window.customElements.define('color-title', ColorTitle);
```

Making the Wrapper using the makeWrapper functions

```
makeWrapper('color-title', (props) => {
    return `::slotted(h1) {color: ${props.colors};}`;
});
```

Using the component in your HTML

```
<color-title colors="blue">
    <h1>Hello World</h1>
</color-title>
```

# BasicElement

## Creating a Component

```
class TestTest extends BasicElement {
    constructor() {
        super({ hello: 'hello' });
    }
    render(state, props) {
        return `<h1>${state.hello}</h1>
            <h2>${props.user}</h2>`;
    }
}

BasicElement.tag('test-test', TestTest);

```

Using the Component in your HTML

```
<test-test user="james"></test-test>
<button
    onclick="document.querySelector('test-test').setState({hello: 'cheese'})"
>
    Click Me
</button>
```

Two rules in constructing a new components:

1. Pass the initial state to super() in the constructor (defaults to an empty object)
2. define a render function that returns your template string

-   Override the postRender(state, props) function which will run after every render

# ChainElement

## Creating a component

```

const initialState = {};

class TestTest extends ChainElement {
    constructor() {
        super(initialState);
    }

    builder(state, props, storage, query) {
        const style = `<style>h1{color: blue;}</style>`;

        const template = `<h1>Hello World</h1>`;

        return `${style} ${template}`;
    }
}

ChainElement.makeTag('test-test', TestTest);


```

using the component in your HTMLElement

```
<body>
    <test-test></test-test>
</body>
```

### Instance Methods

**instance.build()** => re-renders the component

**instance.builder(state, props, storage, query)** => override this function that returns the template for the component. It takes four arguments.

state => The state of the component Instance
props => The props of the component instance
storage => The global ChainElement data store, you can add to this global data store like so...

```
ChainElement.storage.newPropertyName = value
```

query => Object of url queries present when the page loaded

**instance.setState(newState)** set a new state, re-renders component

### Class Methods and Properties

ChainElement.storage => (object of data available to all ChainElement derived components, adding data does NOT automatically re-render components)

ChainElement.list => array of all component instances of components derived from ChainElement

ChainElement.buildAll() => re-renders all components in the list array

ChainElement.query => Object with any URL queries that existed when the page loaded

_abbreviations of standard DOM functions to make using them easier_

ChainElement.doc.select(query) => document.querySelector(query)

ChainElement.doc.selectAll(query) => document.querySelectorAll(query)

ChainElement.doc.byId(query) => document.getElementById(query)

ChainElement.doc.byTag(query) => document.getElementsByTagName(query)

ChainElement.doc.byClass(query) => document.getElementsByClassName(query)

ChainElement.doc.create(query) => document.createElement(query)

ChainElement.doc.remove(query) => document.removeChild(query)

ChainElement.doc.append(query) => document.appendChild(query)

ChainElement.doc.replace(old, new) => document.replaceChild(old, new)

_abbreviations of shadow DOM functions to make using them easier_

ChainElement.shad.select(element, query) => element.shadowRoot.querySelector(query)

ChainElement.shad.selectAll(element, query) => element.shadowRoot.querySelectorAll(query)

ChainElement.shad.byId(element, query) => element.shadowRoot.getElementById(query)

ChainElement.shad.byTag(element, query) => element.shadowRoot.getElementsByTagName(query)

ChainElement.shad.byClass(element, query) => element.shadowRoot.getElementsByClassName(query)

ChainElement.shad.create(element, query) => element.shadowRoot.createElement(query)

ChainElement.shad.remove(element, query) => element.shadowRoot.removeChild(query)

ChainElement.shad.append(element, query) => element.shadowRoot.appendChild(query)

ChainElement.shad.replace(element, old, new) => element.shadowRoot.replaceChild(old, new)

## Lifecycle functions

Use the standard Web Component callbacks for lifecycle Functions

connectedCallback() => on mount
disconnectedCallback() => on dismount

-   can also define a postBuild(state, props, global, query) function that will run immediately after each render, good for adding eventlisteners to your template

# MercedElement

MercedElement is a base class for creating components. In the constructor use the super to define the template builder function, state, and reducer. Afterwards use the MercedElement.makeTag(name, class) static function to register the HTML tag

```
class TestTest extends MercedElement {
    constructor() {
        super(
            (state, props) => { // Argument 1: The Build Function
                return `<h1>${state.hello}</h1><h2>${props.user}</h2>`;
            },

            { hello: 'Hello World' }, //Argument 2: The Initial State

            (oldstate, payload) => { //Argument 3: Reducer Function (think redux)
                if (payload.action === 'goodbye') {
                    return { hello: 'goodbye' };
                }
            }
        );
    }
}

MercedElement.makeTag('test-test', TestTest);
```

in HTML

```
<test-test user="joe"></test-test>
```

#### Instance methods

instance.build() - captures the current props and state and renders a template

instance.setState(newState) - updates the components state and runs build

instance.dispatch(payload) - updates the state by running the reducer defined in the constructor

#### Static methods

MercedElement.gRegister(classInstance) - registers a component instance with the global state

MercedElement.clearRegister() - removes all components from global registry

MercedElement.gSetState(newState) - set the global state and re-render all registered components

MercedElement.gDispatch(reducer, payload) - update the global state with the given reducer function and payload, then re-render all registered components

MercedElement.makeTag(name, class) - register your custom components with HTML tags, the name must have a dash like ('hello-world')

#### LifeCycle Functions

Outside the constructor just override the same functions used in the native web components api.

connectedCallback(){} => Runs when components mounted

disconnectedCallback(){} => Runs when component is removed from dom

postBuild(state, props){} => runs after every render completes

_read JavaScript Documentation regarding adoptedCallback and attributeChangedCallback_

# m-router and m-link

Very similar to most routers, the router tag specifies where links will render and link creates a link that when clicked will render a particular component to the router with the same name attribute. Each router must have a unique name attribute.

-   routers have a default attribute to specify a component to start with
-   links have a target attribute to specify what component will be rendered if clicked.

Given these two Components

```
makeLiveComponent({
    prefix: 'hello',
    name: 'world',
    store: '{hello: ""}',
    builder: (store) => {
        const props = captureProps(this);
        return `<h1>Hello World</h1>`;
    }
});

makeLiveComponent({
    prefix: 'goodbye',
    name: 'world',
    store: '{hello: ""}',
    builder: (store) => {
        const props = captureProps(this);
        return `<h1>Goodbye World</h1>`;
    }
});
```

Here is an example of using the router and link tags

```
<m-router name="main" default="hello-world" props="user='steve'"></m-router>
<m-link name="main" target="goodbye-world" props="user='steve'">
    Click Me to Say Goodbye
</m-link>
```

# my-form

This is an element for tracking forms, give the element a form attribute that matches the id of the form it tracks

**this.grabValues()** returns object with form values with name property as keys

**this.clearForm()** clears all form Values

**this.fillFields(object)** takes object fills in the form fields where key matches input name property

```
<my-form form="myform">
<form id="myform">
    <input type="text" name="one" />
    <input type="text" name="two" />
    <input type="text" name="three" />
    <textarea name="four"></textarea>
</form>
<button onclick="console.log(document.querySelector('my-form').grabValues())">Form Data</button>
<button onclick="document.querySelector('my-form').clearForm()">Clear Values</button>
</my-form>
```

FormTool has two methods, grabValues() which will return you an object with the forms values using the name property as the key and the value property as the value. The second method is clearForm which will render the property of value of all form elements to null. Won't grab or clear the value on submit inputs but will for all others.

# RenderGroup

You can group components as children of render group and call on RenderGroups render function to re-render all slotted components.

your html

```
<render-group>
    <hello-world></hello-world>
    <hello-world></hello-world>
    <hello-world></hello-world>
</render-group>
<button onclick="update()">Click Me</button>

```

your JavaScript

```
let storage = 'hello';

class HelloWorld extends BasicElement {
    constructor() {
        super();
    }

    render() {
        return `<h1>${storage}</h1>`;
    }
}

window.customElements.define('hello-world', HelloWorld);

const update = () => {
    storage = 'goodbye';
    document.querySelector('render-group').render();
};
```

# FunComponent

## Creating a Component

```
//Create The Element
funComponent({
    name: 'test-test',
    render: (state, props) => `<h1>${state.hello} ${props.user}</h1>`,
    connected: (element) => console.log(element),
    state: { hello: 'Hello' },
    hookGen: (element) => () => console.log(element),
    construct: (element) => console.log('hello'),
    disconnected: (element) => console.log('goodbye')
});

// storing the element in a variable
const sampleElement = document.querySelector('[user="joe"]');

//Getting a hook and using it
myFunc = sampleElement.hookGen();
myFunc();

//changing the components state
sampleElement.setState({hello: 'goodbye'})

//Removing the element from the dom to trigger the 'disconnected' function
sampleElement.parentNode.removeChild(sampleElement);

//changing the components state
sampleElement.setState({hello: 'goodbye'})

```

Using the Component in your HTML

```
<test-test user="joe"></test-test>
```

Properties that can be passed into the config object when creating components with the funComponent(config) function.

-   name: string that will be the name of the component, must be in kebab case (name-name)

-   render: a function that takes in state and props and returns a template string

-   state: The Initial state of the component, can be changed on the instance using the setState method passing the new state as an argument.

-   connected: a function that takes the instance as an argument that is run when the component is mounted

-   disconnected: a function that takes the instance as an argument that is run when the component is removed from dom

-   construct: a function that takes the instance as an argument that is called in the constructor, can be used to add actions to the constructor.

-   hookGen: a function that takes the instance as an argument that is meant to define addtional function/methods and return them when the hookGen method is called on the instance.

-   postRender: (element, state, props) => function that runs after each render, use for adding event listeners

## Functions

### getQueryHash

_getQueryHash()_
This function will return an array, the first element being an object with all URL queries, the second being any URL hashes that may exist.

```
const [queries, hash] = getQueryHash()
```

### captureProps

_captureProps(element)_
Pass in any html element and this function returns all of its properties as an object.
