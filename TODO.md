# To-do list

We might consider to do these things...

- [x] add styles to shadow roots
- [ ] see if we could remove required permissions
- more code removals?
  - [ ] maybe remove firefox stuff, builds other than chrome?
  - [ ] remove rest of usercss, UC?
  - [ ] simplify the data (e.g. `configurable` should no longer be useful)
  - [ ] remove unused files

## release process

- make changes
- test them
- commit
- check everything `pnpm build-chrome-mv3 && pnpm lint && pnpm test`
- update to-do list above
- update changelog
- update version `pnpm version <patch|minor|major>`
- make a zip file `pnpm zip-chrome-mv3`
- push everything with `git push && git push --tags`
- upload the new version at https://partner.microsoft.com/en-us/dashboard/microsoftedge/overview
