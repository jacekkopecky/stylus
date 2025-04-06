# Stylus without network

This is a fork of [Stylus](https://github.com/openstyles/stylus) with all network interaction hopefully ripped out.

The reason for creating this fork is to allow the use of Stylus with
locally-created custom styles in places where browser extensions that
might exfiltrate data over the network are banned.

It also removes other things that made the removal of the above easier:

- localization (transifex)
- any syncing, any cloud, usercss, meta
- manifest versions other than v3

## Highlights

- Lightweight content script (10kB) runs in about a millisecond so it doesn't slow down web pages
- A backup feature which is compatible with other userstyles managers.
- Customizable UI, optional layouts, and tweaks.
- Two different optional code validators with user-configurable rules: CSSLint and Stylelint.
  - Both validators use Web Worker API to run in a separate background thread inside the editor tab without blocking your interaction with the code.
  - CSSLint is heavily modified compared to the effectively frozen original one and supports various CSS3 features as well as CSS4 Color and CSS Grid syntax.

## License

Inherited code from the original [Stylish](https://github.com/stylish-userstyles/stylish/):

Copyright &copy; 2005-2014 [Jason Barnabe](jason.barnabe@gmail.com)

Current Stylus:

Copyright &copy; 2017-2023 [Stylus Team](https://github.com/openstyles/stylus/graphs/contributors)

Network removal updates done by Jacek Kopecky.

### External libraries

The licenses of [external libraries](./vendor) used in this project or [modified versions of external libraries](./vendor-overwrites) can be found in their respective directory.

## todo

- [x] remove other manifests, look for MV3 and remove branching
  - [x] check all modified files for unused imports,
- [x] remove greasy*, sleazy*, userstyles*, *.world
- [x] edit page says "edit stylenull" - why?
- [x] remove fetch and XMLHttpRequest except where only called locally
- [x] remove "drive", token-manager, sync
- [x] in all console.log statements, add "Stylus-without-network: "
- [x] remove transifex
- [x] remove most locales
- [x] remove find button, search.js etc?
- [x] fix "manage site styles" - the automatic search current doesn't work
  - [x] report bug: Manage site styles breaks when all styles match
  - https://github.com/openstyles/stylus/issues/1955
  - manage.html doesn't show the styles when search is set?
- [x] review all extension pages for stuff to remove
- [ ] push to master so that github repo shows the right readme
- [ ] see if we could remove required permissions
- more code removals?
  - [ ] maybe remove firefox stuff, builds other than chrome?
  - [.] remove rest of usercss, UC
    - [x] remove SourceEditor? (seems only to be used for Usercss)
  - [ ] remove unused files
