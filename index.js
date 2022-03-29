require("@babel/core").transform("code", {
    presets: ["@babel/preset-env"],
})

/** @jsx h */

import http from 'http';

// code written
// let foo = <div id="foo">Hello!</div>

// code ran
// var foo = h('div', {id:'foo'}, 'Hello!');
// function h is invoked with 3 arguments: (tag, attributes, content)

const ITEMS = 'hello there people'.split(' ');

// turn an Array into list items;
let list = (items) => items.map((p) => `<li> ${p} </li>`);

let vdom = (
    `<div id="foo">
        <p>Look, a simple JSX DOM renderer!</p>
        <ul>${ list(ITEMS) }</ul>
    </div>`
);

// render() converts our 'virtual DOM (see below) to a real DOM tree
let dom = render(vdom);

// append the new nodes somewhere
document.body.appendChild(dom);

// Remember that 'virtual DOM'? It is just JSON -each 'VNode' is an object with 3 properties.
let json = JSON.stringify(vdom, null, ' ');

// The whole process (JSX => VDOM => DOM) in one step:
document.body.appendChild(
    render(<pre id='vdom'>{json}</pre>)
)


// function to create a vnode
function h(nodeName, attributes, ...args) {
    let children = args.length ? [].concat(...args) : null;
    return { nodeName, attributes, children }
};
/* returns {
    nodeName: 'div',
    attributes: {
        'id': 'foo'
    },
    children: ['Hello!]
} */

let x = `<div id="try">Hello!</div>`

// function to grab the html tag from an html string
function extractHTMLTag(htmlStr) {
    let openRgx = /<[a-z]+/;
    let closeRgx = /(\/[a-z]+>)|(\/>)/;
    let openTag = htmlStr.match(openRgx)[0].slice(1);
    let closeTag = htmlStr.match(closeRgx)[0];
        closeTag = closeTag.slice(1);
    if (openTag !== closeTag & closeTag !=='>') return 'Syntax error';
    return openTag;
};

// function to grab all key value pair from an html string and populate an object of attributes
function extractHTMLAttributes(htmlStr) {
    let rgx = /[a-zA-Z]+="[a-zA-Z\._]+"/g;
    let matched = htmlStr.match(rgx);
    const res = {};
    console.log(matched)
    for (let i = 0; i < matched.length; i++) {
      let key = matched[i].slice(0, matched[i].indexOf('='));
      let val = matched[i].slice(matched[i].indexOf('=') + 2, matched[i].length - 1);
      res[key] = val;
    }
    return res;
};

// function that accepts virtual node and render actual DOM nodes
function render(vnode) {
    // Strings just convert to #text Nodes
    if (vnode.split) return document.createTextNode(vnode);
    // create a DOM element with the nodeName of our VDOM element
    let n = document.createElement(vnode.nodeName);
    // copy attributes onto the new node;
    let a = vnode.attributes || {};
    Object.keys(a).forEach((k) => n.setAttribute(k, a[k]));
    // render (build) and then append child nodes;
    (vnode.children || []).forEach(c => n.appendChild(render(c)));
    return n;
}

const PORT = 4001;
const server = http.createServer((req, res) => {
    res.end(vdom);
}).listen(PORT);

console.log(`Server is up and running at ${PORT}`)

export default server;
