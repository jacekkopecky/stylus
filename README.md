# Stylus without network

This is a fork of Stylus with all network interaction hopefully ripped out.

The reason for creating this fork is to allow the use of Stylus with
locally-created custom styles in places where browser extensions that
sometimes do something over the network are banned.

It also removes other things that made the removal of the above easier:

- localization (transifex)
- any syncing, any cloud, usercss, meta
