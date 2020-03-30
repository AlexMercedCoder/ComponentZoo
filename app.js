class ColorTitle extends StyledWrapper {
    style(props) {
        return `::slotted(h1) {color: ${props.colors};}`;
    }
}

window.customElements.define('color-title', ColorTitle);

class HelloWorld extends BasicElement {
    constructor() {
        super();
    }

    render() {
        return `<h1>Hello World</h1>`;
    }
}

window.customElements.define('hello-world', HelloWorld);

class HelloWorld2 extends BasicElement {
    constructor() {
        super();
    }

    render() {
        return `<h1>Hello World2</h1>`;
    }
}

window.customElements.define('hello-world2', HelloWorld2);

class HelloWorld3 extends BasicElement {
    constructor() {
        super();
    }

    render() {
        return `<h1>Hello World3</h1>`;
    }
}

window.customElements.define('hello-world3', HelloWorld3);
