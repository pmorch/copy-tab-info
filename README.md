# Copy Tab Info

# Description

This is a Chrome extension that allows you to copy links to the pages in a tab
or multiple tabs.

When you click the extension icon, an rich-text HTML version of the tab(s) is
put on the clipboard along with a plain-text version spanning two lines. If you paste into a
rich-text document (such as a document or email) the HTML version is pasted as a
rich-text link, but if you use `CTRL-V` to paste, or paste in e.g. a text editor
or into a terminal the plain-text version is pasted.

If you right click on the menu, you can also copy Markdown or Asciidoc
_Formats_ or versions of link(s) for the selected tab(s) to the clipboard.

By default there is special _URL Rules_ handing for Google Docs, GitHub issues
and Pastebin links so the pasted links are more appropriate and useful in an
email, document or wiki page.

## `URL Rule` Examples

Here are four examples of what `URL Rules` can do:

### Example 1: a link to the Google homepage

Aa simple example without any `URL Rule`s:
[Google](https://google.com)
renders as (the same link):
[Google](https://google.com)

And three more examples in increasing complexity. In each example, we show what the link would look like without any `URL Rule`s, and then what we can modify them to be by using `URL Rules`:

### Example 2: A link to a Google Doc

[My Google Doc - Google Docs](https://docs.google.com/document/d/abcdefghijklm/edit)
The trailing "- Google Docs" was removed, so it renders as:
[My Google Doc](https://docs.google.com/document/d/abcdefghijklm/edit)

### Example 3: A link to a Github Issue

[issue title · Issue #1234 · user/repo · GitHub](https://github.com/user/repo/issues/1234)
The issue title is moved to the end as a a "suffix", and other unnecessary text is removed:
[user/repo#1234](https://github.com/user/repo/issues/1234) "issue title"

### Example 4: A link to a pastebin

[foobar - Pastebin.com](https://pastebin.com/U2FSNpDX)
The pastebin ID is extracted from the URL to get:
[pastebin/U2FSNpDX](https://pastebin.com/U2FSNpDX) "foobar"

# Customization

The above description is what you get with the "factory" configuration.

In addition to the built in _Formats_: HTML, text, Markdown and AsciiDoc, you
can modify these or add your own custom formats (using
[Mustache](https://mustache.github.io) templates).

And in addition to the _URL Rules_ for Google Docs, GitHub issues and
Pastebin links you modify these and add your own _URL Rules_ to determine what
the link ends up looking like based on the URL or page title (using regular
expressions).

We'll explore the `URL Rules` first.

## The examples revisited

The "`URL Rule` Examples" section above shows 4 example links to pages. The
first one leaves `title` and `URL` unchanged. In the second one, any trailing "-
Google Docs" was removed from `title`, and in the third and fourth one, the
`title` of the link was reduced to almost nothing, but a new `suffix` field was
extraced using information from `title` and `URL` respectively. This is then
used in e.g. the default HTML template which is:

```
<a href="{{url}}">{{title}}<a>{{#suffix}}: "{{.}}"{{/suffix}}
```

This is a [Mustache](https://mustache.github.io) and can be read as:

> Create a normal HTML link as `<a href="$url">$title</a>`. If there is a suffix field, append `: "$suffix"`.

Lets now look in more detail at some...

## `URL Rules`

A `URL Rule` has a `urlPattern`, and a number of rules. Each rule as a `field` (either `title` or `URL`) a `match` regular expression and an optional `replacement` field.

Here is the one for Google Docs (Example 2 above)

```yaml
  - urlPattern: https://docs.google.com/document/d/*
    rules:
      - field: title
        match: ' - Google Docs$'
        replacement: ""
```

The `urlPattern` matches any URL beginning with
`https://docs.google.com/document/d/` (all Google Docs). It uses the [Match patterns](https://developer.chrome.com/docs/extensions/mv3/match_patterns/) that are also used for Chrome Extensions .

"` - Google Docs$`" is `match`-ed in the `title` and the empty string is used as
a `replacement`, effectively removing it.

The next URL Rule is for git hub issues:

```yaml
  - urlPattern: https://github.com/*/*/issues/*
    rules:
      # Turn "Some Title · Issue #1234 · user/proj"
      # Into "user/proj#1234: Some Title"
      # and store Some Title as field 'suffix'
      # (we'll also create fields _issue_number and _project
      # but discard them because of the leading '_')
      - field: title
        match: '^(?<suffix>.+) · Issue #(?<_issue_number>\d+) · (?<_project>.+)$'
        replacement: '$<_project>#$<_issue_number>'
```

It is really just standard regular expressions here, using [Named capturing groups](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Regular_expressions/Named_capturing_group). We modify the `title` field by matching with the `match` regexp and replacing with the `replacement`.

But we're using Regexp Named Capture Groups

## The process of creating a link

This is an overview, details will be added later:

When a link needs to be created, the we start out with two fields: `title` and `URL`.

These two initial fields can be modified by _URL Rules_. The rules that match
the `URL` can extract additional metadata fields and/or modify the original
`title` and `URL` fields (examples below). If no _URL Rules_ match (the default)
the original `title` and `URL` fields remain unchanged.

These fields are then given to the appropriate _Format_ for rendering, where a
format-specific template is used to create the final link.

## Whats in the box?



## Formats

By default, Copy Tab Info provides these formats: HTML, text, Markdown and AsciiDoc, but you are free to add your own formats.

Formats are written using the [Mustache](https://mustache.github.io) template
language. Here is the [Mustache
documentation](https://mustache.github.io/mustache.5.html), but to give you an
idea, here is a simple HTML format:

```
<a href="{{url}}">{{title}}<a>
```

or for Markdown:

```
[{{{title}}}]({{{url}}})
```

Note how the Markdown format uses tripple curly braces. That is because Mustache
will HTML encode special characters when using double curly braces as
appropriate for HTML, but triple curly braces will just replace the raw value.
Mustache also supports option optional fields.

## Prerequisites

You'll need `make` to build this software.

## Code and Icon generation

We generate icons and schema validator.

The icons so we don't have to commit any font-awesome icons but use them form
npm, and the schema validator because ajv otherwise tries to compile the schema
validator which is not allowed under unsafe-eval in a chrome extension.

That is what the `generate` script is for in `package.json`'s `scripts` section.
`run-s` runs multiple npm scripts one after the other.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Dependency Generation

The `./generate` folder generates some dependencies:

### Icons

The extension icons are generated from font awesome

### Schema Validator

When running inside an extension, we cannot use `eval` or `new Function()`
because of the CORS `unsafe-eval` security limitation while running as an
extension.

And `ajv` uses `new Function()` when compiling a schema validator, so that
cannot be done at runtime and so is done here.

### Pre-bundling the Monaco Editor

We're using the [Monaco editor](https://microsoft.github.io/monaco-editor/) for
YAML editing. It _is_ rather huge. Which normally under `vite` dev builds is not
so bad, only that during extension development, we cannot use `vite dev` but
have to use `vite build`, and monaco raises the build time from around 0.6s to
annoying 5.6s. So in `./generate/monaco` we run a separate vite build of monaco,
setting it up with global variables in `window` so the main build becomes much
faster.

I've used [this
example](https://github.com/microsoft/monaco-editor/tree/main/samples/browser-esm-webpack-small),
where I've used the imports from `./index.js`. Keep in mind that this repo uses
a slightly older version of `monaco-editor`, but to update the imports to fit
whatever version we're using e.g. `0.37.1`:

```sh
cd monaco-editor/samples
npm install monaco-editor@0.37.1
cd browser-esm-webpack-small
npm run generate-imports
```

That will update the example's `./index.js` with the imports appropriate for
that version. See also this [stackoverflow
answer](https://stackoverflow.com/a/76151598/345716).
