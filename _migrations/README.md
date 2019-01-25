# Contentful Migrations

Contentful has the ability to stage and migrate changes to a Space. This is done by prototyping in a test Environment and then defining a migration script in order to produce a repeatable deployment.

If necessary, please familiarize yourself with the [Contentful domain model](https://ctf-doc-app-branch-environments.netlify.com/developers/docs/concepts/domain-model/) in order to understand terminology and the various interactions that are required to complete a migration. Then read the following resources specifically about migrations:

- Scripting migrations: https://www.contentful.com/developers/docs/tutorials/general/scripting-migrations/
- Tutorial: https://www.contentful.com/blog/2017/09/18/using-the-contentful-migration-cli/
- Official examples: https://github.com/contentful/contentful-migration/tree/master/examples


## Executing Migrations

Our migration files are numbered to ensure that bulk operations involving many migrations execute in the expected order. Use the following convention to name new files:

```
XX-ACTION-IDENTIFIER.js
```

- `XX` - zero-padded integer
- `ACTION` - the primary action being taken: `create`, `update`, `delete`
- `IDENTIFIER` - a short description of what is being modified.

It's a good idea to test the migration by cloning the `master` environment into a sandbox and doing a dry run. Suppose you have a `sandbox` environment, the command would be the following:

```bash
npm run migration -- --space-id 0123456789 --environment-id 'sandbox' _migrations/01-create-keyFinancials.js
```

Note: we are using `npm run migration` because that ensures we all migrate using the same version, as opposed to a globally-installed tool that may or may not support all the features we need.

## Data types

Some data types are not obvious (e.g. a short text field is a `Symbol`). Please refer to the official docs to help formulate API calls:

Data model: https://www.contentful.com/developers/docs/concepts/data-model/


## Changes of note

- Updated to `0.16.6` in order to start migrations of `RichText` fields
