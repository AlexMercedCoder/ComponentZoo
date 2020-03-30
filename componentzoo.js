////////////////////////////
// getQueryHash
////////////////////////////

const getQueryHash = () => {
    const hash = window.location.href.split('#')[1];

    const queryArray1 = window.location.href.split('?')[1];

    const queryArray2 = queryArray1 ? queryArray1.split('#')[0].split('&') : [];

    const queryEntries = queryArray2.map((value) => {
        return value.split('=');
    });

    return [Object.fromEntries(queryEntries), hash];
};

/////////////
//CaptureProps
/////////////

const captureProps = (element) => {
    const att = [...element.attributes];
    const entries = att.map((value) => {
        return [value.name, value.value];
    });

    return Object.fromEntries(entries);
};

/////////////////////////
//BasicElement
/////////////////////////

class BasicElement extends HTMLElement {
    constructor(state = {}) {
        super();
        this.state = state;
        this.props = captureProps(this);
        this.attachShadow({ mode: 'open' });
        this.rend();
    }

    static tag(name, element) {
        window.customElements.define(name, element);
    }

    rend() {
        this.props = captureProps(this);
        this.shadowRoot.innerHTML = this.render(this.state, this.props);
    }

    render(state, props) {
        return ``;
    }

    setState(newState) {
        this.state = newState;
        this.rend();
    }
}

///////////////////////////
//ChainElement
//////////////////////////

class ChainElement extends HTMLElement {
    constructor(state = {}) {
        super();
        this.state = state;
        this.props = captureProps(this);
        this.attachShadow({ mode: 'open' });
        ChainElement.list.push(this);
        this.build();
    }
    static list = [];
    static storage = {};
    static query = getQueryHash()[0];

    static buildAll() {
        ChainElement.list.forEach((value) => value.build());
    }

    static doc = {
        select: (q) => {
            return document.querySelector(q);
        },
        selectAll: (q) => {
            return document.querySelectorAll(q);
        },
        byId: (q) => {
            return document.getElementById(q);
        },
        byTag: (q) => {
            return document.getElementsByTagName(q);
        },
        byClass: (q) => {
            return document.getElementsByClassName(q);
        },
        create: (q) => {
            return document.createElement(q);
        },
        remove: (q) => {
            return document.removeChild(q);
        },
        append: (q) => {
            return document.appendChild(q);
        },
        replace: (q, y) => {
            return document.replaceChild(q, y);
        }
    };

    static shad = {
        select: (e, q) => {
            return e.shadowRoot.querySelector(q);
        },
        selectAll: (e, q) => {
            return e.shadowRoot.querySelectorAll(q);
        },
        byId: (e, q) => {
            return e.shadowRoot.getElementById(q);
        },
        byTag: (e, q) => {
            return e.shadowRoot.getElementsByTagName(q);
        },
        byClass: (e, q) => {
            return e.shadowRoot.getElementsByClassName(q);
        },
        create: (e, q) => {
            return e.shadowRoot.createElement(q);
        },
        remove: (e, q) => {
            return e.shadowRoot.removeChild(q);
        },
        append: (e, q) => {
            return e.shadowRoot.appendChild(q);
        },
        replace: (e, q, y) => {
            return e.shadowRoot.replaceChild(q, y);
        }
    };

    static makeTag(name, element) {
        window.customElements.define(name, element);
    }

    builder(state, props, global, query) {
        return '';
    }

    build() {
        this.props = captureProps(this);
        this.shadowRoot.innerHTML = this.builder(
            this.state,
            this.props,
            ChainElement.storage,
            ChainElement.query
        );
    }

    setState(newState) {
        this.state = newState;
        this.build();
    }
}

//////////////////
//MercedElement
/////////////////

class MercedElement extends HTMLElement {
    constructor(builder, state, reducer) {
        super();
        this.builder = builder;
        this.state = state;
        this.reducer = reducer;
        this.props = {};
        this.attachShadow({ mode: 'open' });
        this.build();
    }

    build() {
        this.props = captureProps(this);
        this.shadowRoot.innerHTML = this.builder(this.state, this.props);
    }

    setState(newState) {
        this.state = newState;
        this.build();
    }

    dispatch(payload) {
        this.setState(this.reducer(this.state, payload));
    }

    static gState = {};

    static gRegistry = [];

    static gRegister(element) {
        this.gRegistry.push(element);
    }

    static clearRegister() {
        this.gRegistry = [];
    }

    static gSetState(newState) {
        this.gState = newState;
        this.gRegistry.forEach((value) => {
            value.setState(this.gState);
        });
    }

    static gDispatch(reducer, payload) {
        this.gSetState(reducer(this.gState, payload));
    }

    static makeTag(name, element) {
        window.customElements.define(name, element);
    }
}

/////////////////////////
//StyledWrapper
/////////////////////////

class StyledWrapper extends HTMLElement {
    constructor() {
        super();
        this.props = captureProps(this);
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `<style>${this.style(
            this.props
        )}</style><div><slot></slot></div>`;
    }

    style(props) {
        return '';
    }
}

const makeWrapper = (name, styler) => {
    window.customElements.define(
        name,
        class extends StyledWrapper {
            style(props) {
                return styler(props);
            }
        }
    );
};

////////////////////////////
// FormTool
////////////////////////////

class FormTool {
    constructor(form) {
        this.form = form;
        this.fields = [...this.form.children].filter((value) => {
            return (
                (value.tagName === 'INPUT' || value.tagName === 'TEXTAREA') &&
                value.type != 'submit'
            );
        });
    }

    grabValues() {
        const entries = this.fields.map((value) => {
            return [value.name, value.value];
        });
        return Object.fromEntries(entries);
    }

    fillFields(object) {
        const keys = Object.keys(object);
        const values = Object.values(object);
        keys.forEach((key) => {
            this.fields.forEach((field) => {
                if (field.name === key) {
                    field.value = object[key];
                }
            });
        });
    }

    clearForm() {
        const entries = this.fields.forEach((value) => {
            value.value = null;
        });
    }
}
