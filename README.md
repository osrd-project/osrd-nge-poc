# osrd-nge-poc

Proof of concept to integrate NGE with an external webapp such as OSRD.

This branch contains the React + TypeScript PoC. Previous work includes:

- `multun` branch: out-of-tree NGE build customizations
- `custom-element` branch: basic pure JS version
- `custom-element-standalone` branch: attempt at making NGE a completely
  self-contained component without an `<iframe>`

## Setup

For development:

    npm run dev

Open [http://localhost:5173/](http://localhost:5173/) with your favorite browser.

### Working on the PoC and NGE in parallel

If you don't have NGE cloned yet:

    git clone --branch custom-element https://github.com/osrd-project/netzgrafik-editor-frontend.git
    cd netzgrafik-editor-frontend
    npm run build:standalone
    cd ..

Then update the NGE dependency to point to your local copy:

    npm link ./netzgrafik-editor-frontend

## Design decisions

### Publishing as a NPM package

To integrate NGE inside the OSRD build system, multiple options are possible:

- Pull the Git repository as a `package.json` dependency. The downside is that
  we're pulling ~1.5k new dependencies with NGE and lengthening the build time
  (since we need to build NGE when building OSRD).
- Vendor the built NGE files in the OSRD Git repository. The downside is that
  we're mixing up artifacts (build outputs) with other source files and the
  process to update the vendored files would be quite manual.
- Publish a built version of NGE as a standalone NPM package without any
  dependencies, pull it in OSRD. The downside is that we need to figure out and
  maintain some extra infrastructure (npmjs.org organization? NPM credentials?).

### Communication with an `<iframe>`

When loading an `<iframe>` with the same origin, the parent has direct access
to the `<iframe>` contents via [`HTMLIFrameElement.contentDocument`]. Thus,
there is no need to make use of [`Window.postMessage`] to communicate with the
child window. To put things bluntly, it doesn't make a big difference whether
an element is inside the `<iframe>` or outside.

In addition, the HTML document loaded by the `<iframe>` can be fully customized
out-of-tree without any change to netzgrafik-editor-frontend.

### Use of custom elements

While it is possible to manually instanciate an Angular component, it is a
cumbersome process that requires quite a bit of boilerplate and prior knowledge
about Angular.

The [`@angular/elements`] package provide a way to expose Angular components as
[Web custom elements]. With that feature enabled, the Angular components
registered as Web custom elements behave like a regular HTML element with
attributes and events, without any Angular-specific bits. As a result it's
easier to re-use and integrate into another framework.

### Dropping the `<iframe>` middle-man

With custom elements, it would be tempting to completely drop the `<iframe>`
and directly include and use the NGE custom element from the OSRD React webapp.
In othe words, loading NGE's CSS/JS files and then inserting a `<sbb-root>`
element in the DOM.

This approach happens to work, however NGE is not completely self-contained:

- The Angular router takes over `window.location` and conflicts with React's
  router. This can be fixed by injecting a custom `LocationStrategy` into
  Angular which no-ops `pushState()`.
- Some CSS styles leak outside of the NGE element. Most are harmless because
  Angular prepends a selector to all component rules and a lot of rules have
  an `sbb-` prefix. However, the Bootstrap rules are not namespaced and are
  applied to the whole document.

A few tricks to isolate the CSS were attempted but don't quite work:

- `<style scoped>` has been removed from the standard.
- [`@scope`] is not yet supported by Firefox (but looks like a good long-term
   candidate).
- Sass [nested `@import`] breaks `:root` variable declarations used by
  Bootstrap.

It should be possible to better isolate the custom element via Angular's
`ViewEncapsulation.ShadowDom`, however the CSS styles are still inserted
globally by NGE instead of inside the shadow root. The exact opposite result of
what we want is obtained: the CSS rules apply to the parent document and they
don't apply to the custom element.

### Passing data back and forth

With custom elements, Angular concepts are mapped to DOM element concepts:

- Angular input properties are mapped to DOM element attributes. `@Input foo`
  in Angular can be accessed via `<element foo=…>` in HTML and `element.foo` in
  JS.
- Angular component outputs are mapped to DOM events. `@Output bar` in Angular
  can be subscribed to via `element.addEventListener('bar', …)` in JS.

As a result Angular idioms can be used to pass data in and out of the
component. One way to define the component API would be to take the
infrastructure and train runs as an Angular input property, and expose Angular
output event emitters to broadcast train run changes.

[`HTMLIFrameElement.contentDocument`]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement/contentDocument
[`Window.postMessage`]: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
[`@angular/elements`]: https://v17.angular.io/guide/elements
[Web custom elements]: https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements
[`@scope`]: https://developer.mozilla.org/en-US/docs/Web/CSS/@scope
[nested `@import`]: https://sass-lang.com/documentation/at-rules/import/#nesting
