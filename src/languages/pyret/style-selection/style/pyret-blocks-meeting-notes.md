
### General points
- optimize for bootstrap curriculum
- average american teacher only has certain marker colors (take that into consideration)
- use color, shape and pattern
- consider using badges, background patterns, icons for constructors
- low usage of binary/control in scratch
- treat untype and conditional blocks with the same color (maybe light red, indicates "not great, but still valid")

### Subset that we care about
- commonly used types: numbers, string, bool, images, tables, lists, (tuples, sets)
- function, value definitions, check blocks, if/else, asks, function application, operators, reactors
- punting on these: mutability, when, anon functions, for

- two ways of building tables
1. methods (eg: filter) used now, more uniform. However, suffers from fatal flaw, type checkers dont work on it
2. [something that looks like SQL (can see types). However, syntax error problems](https://code.pyret.org/editor#share=1qhWbxdU4svyBEW7LlT2eGSZxDUk18wtb&v=1599623)
	

### Other suggestions
- set up git issues
- imports, provides, includes treated the same way as utils (faded orange) to ensure code pops, everything utils in the background
- add Contracts (colored like the utility thing)
- allow users to "Grow out of" blocks, switch back and forth between text and blocks
- save complex literals for the end

### Example for looking up types in ast.tsx
Config file for toolbar on the left (allows you to group them with drawers): 
Create a doc that looks like this (primitives-config)
	https://github.com/bootstrapworld/wescheme-blocks/tree/master/src/languages/wescheme
Anything that isn't built into the language already, treat as untyped


### Pyret files for testing benchmarks
[file1](https://code.pyret.org/editor#share=1-qNe5C9dhIQMtEis5cVbyXzSCLu4VhNN&v=1599623)
[file2](https://code.pyret.org/editor#share=1IDmNL5ysgh3L4IGry7P3dMgiw1woZBW4&v=1599623)
[file3](https://code.pyret.org/editor#share=1qhWbxdU4svyBEW7LlT2eGSZxDUk18wtb&v=1599623)

