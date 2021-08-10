[![dependencies Status](https://david-dm.org/bootstrapworld/codemirror-blocks/status.svg)](https://david-dm.org/bootstrapworld/pyret-blocks)
[![devDependencies Status](https://david-dm.org/bootstrapworld/codemirror-blocks/dev-status.svg)](https://david-dm.org/bootstrapworld/pyret-blocks?type=dev)
[![Code Climate](https://codeclimate.com/github/bootstrapworld/codemirror-blocks/badges/gpa.svg)](https://codeclimate.com/github/bootstrapworld/pyret-blocks)

# pyret-blocks
A screenreader-accessible, hybrid block and text editor for the [Pyret programming language](https://www.pyret.org).

## Usage

Export the pyret-blocks module using the normal `npm run build` mechanism, then include it in your favorite Pyret-using, CodeMirror-enabled project. You can now use the new `CodeMirrorBlocks` constructor to replace an existing CodeMirror instance with blocks. In other words, you'd replace code that looks like this:

    // make a new CM instance inside the container elt, passing in CM ops
    this.editor = CodeMirror(container, {/* CodeMirror options  */}});
With code that looks like this:

    // make a new CMB instance inside the container elt, passing in CMB ops
    this.editor = CodeMirrorBlocks(container, {/* CodeMirrorBlocks options  */});

NOTE: your IDE will need to load CodeMirror as an external dependency. We assume it already does (otherwise, why would you be here?), so you'll need to provide it yourself.

## Development

To get your dev environment up and running, follow these steps. Note that to run tests,
you will need either Chrome or Chromium and point the variable `CHROME_BIN` to the binary
like this:

```
export CHROME_BIN=/usr/bin/chromium
```

You must enter the following command in every session before you run the test.
Alternatively, you can put it in your `.{bash,zsh}rc`, which will run them automatically.

1. Checkout the repository in your favorite manner

2. install dependencies with `npm`

        npm install

3. start the webpack development server:

        npm start

4. browse to http://localhost:8080/ and fire away!

5. while you work, be sure to run the unit tests (early and often!) with:

        npm run test

Language-specific code is in the **src/languages/pyret/** directory. The files there include:
- `ast.tsx` - a TypeScript file describing the AST nodes for this language, over-and-above the builtin nodes that the CMB library includes natively. If you are *adding support for language features* or *changing the way existing nodes render*, this is where you'll do most of your work. You'll need some JS and minimal JSX/React chops to work here.
- `index.js` - the interface where the language mode declares itself to the CMB library. It's unlikely you will edit anything here (except *maybe* some of the strings).
- `Parser.js` - this file contains that code that takes an AST produced by your language's native parser and converts it to a CMB AST. **Pay special attention to the `aria-label` fields**! These strings are what the screenreader will announce to describe an AST node.
- `style.less` - this is where the CSS rules are declared, for styling the rendered AST nodes. If you know CSS, learning [LESS](http://lesscss.org/features/) is pretty easy and downright fun!

6. you can generate local coverage reports in the **.coverage/** folder by running:

        COVERAGE=true npm test

7. you can generate a static, minified ball of JS and CSS in the **dist/** folder by running:

        npm run build

## Inserting New Themes
We have also given the option for you to add your own themes into the application during development. Style-specific code is in the **src/languages/pyret/style-selection** directory, where you will find:
- `style-list.js` - which exports an array of JSONs indicating the Styles available in the editor. More on this below.
- `style-selector.js` - the script that exports a constructor that will create the selector of styles for the editor in the application. If you are only concerned with adding new styles, you probably won't need to edit this.
- `\style\` - a directory where all the less files for the theme are at. More on this below. Inside this directory, you will find a file called **default.less**, this is a template for what you can modifiy into any other style.

Once you have your style compiled, all you need to insert a new style is to:

1. Upload your file to the **style** directory mentioned above if you haven't already.

2. Open up **style-list.js**, and insert a json of the following format:

        {
                displayName: STRING,
                themeName: STRING,
                id: STRING
        }

- `displayName` - Theme Name of your Style that will be displayed on the UI
- `themeName` - the ClassName of the Wrapper around Code Mirror, add this to style.less
- `id` - id of the option block in the UI, formatted in the style of "[name]-block-style"

3. In **style.less** referenced in Development, add the following to the less file:

        .[themeName]{
                @import "./style-selection/style/[file you uploaded]";
        }

#TODO (Check off in commit when complete)

- [x] Dragging things into the function/lambda body (class `Block`) does not place it in the correct place (cannot append to the top)
- [x] Make drop targets in a `block` properly highlight/respond to hover (might have something to do with appending to the list)
- [x] Make the drop targets within the functions extend all the way to the left (looks strange otherwise)

- [x] Fix navigations tests
        - [x] Come up with a way to emulate hover properly (since some boxes will only display on hover)

