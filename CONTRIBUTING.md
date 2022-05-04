# Contributing Guidelines

| Audience |
| :------- |
| Everyone |

This file contains some instructions for installing, developing for, and preparing releases for Digital Situation Reports. Each section is marked with an Audience to help you decide whether the docs are for your current task.

- [Commit messages](#commit-messages)
- [Creating Releases](#creating-releases)

## Commit messages

| Audience     |
| :----------- |
| Contributors |

We are using [standard-version](https://github.com/conventional-changelog/standard-version#standard-version) to generate a `CHANGELOG.md` for each release. This automation is only possible if our commits follow the [Conventional Commits 1.0.0 specification](https://www.conventionalcommits.org/en/v1.0.0/).

Here are a few brief examples:

```sh
#
# All examples assume you're on version 4.0.0 when creating the example commit.
#

# a normal bugfix
# Outcome: new patch version (4.0.1)
git cm -m "fix: fix typo in header"

# a new feature that relates to "cards"
# Outcome: new minor version (4.1.0)
git cm -m "feat(cards): cards can now do a new thing"

# a bugfix that creates a breaking change
# Outcome: new major version (5.0.0)
git cm -m "fix(cards)!: new share URLs for Card component

Refs: DSR-XXXX
BREAKING CHANGE: New Share URLs when using social sharing links. Old legacy URLs
have been sunset and no longer function."

```

## Creating Releases

| Audience    |
| :---------- |
| Maintainers |

See our [DSR Standard Operating Procedure][dsr-sop] for details about our release process. The rest of this section provides technical guidance for creating Releases.

  [dsr-sop]: https://docs.google.com/document/d/1FQJjn469wod3Z_Oc6Y_321tXobIbER7AftcIs7vWduE/edit#heading=h.3t9e3dv1ao2z

Create a new branch from `dev` and run the release command to generate the new CHANGELOG and increment the version number in our `package.json` and other related files. There's a dry-run flag to preview what will happen:

```sh
# Example with the dry-run flag.
$ npm run release -- --dry-run

> reports-site@4.0.0 release
> standard-version "--dry-run"

✔ bumping version in package.json from 4.0.0 to 4.0.1
✔ bumping version in package-lock.json from 4.0.0 to 4.0.1
✔ outputting changes to CHANGELOG.md
```

The command to make a release contains no flags:

```sh
$ npm run release
```

Review the commit and make any necessary adjustments to the CHANGELOG, using `git commit --amend` to add your changes to the existing commit that `standard-version` just created. Push your branch and open a PR to `dev`, which you can merge without review.

[Create the new Release][new-release] using the GitHub UI with the following properties:

- **Tag:** new tag with format `v0.0.0` — numbers should match [`package.json` in the `dev` branch][dev-package].
- **Target branch:** `dev`
- **Title:** `Production YYYY-MM-DD` using the expected PROD deployment date
- **Release notes:** Copy the new CHANGELOG bullets. If dependabot made any updates during this cycle, you can include "regular security updates" without being specific.

Once the tagged Release has been created, [create a PR from `dev` to `master`][pr-dev-master] which will include all work within the tagged release. You can merge that without review as well. This step allows hotfixes to be created from `main` should the need arise.

  [new-release]: https://github.com/UN-OCHA/reports-site/releases/new?target=dev
  [dev-package]: https://github.com/UN-OCHA/reports-site/blob/dev/package.json#L3
  [pr-dev-master]: https://github.com/UN-OCHA/reports-site/compare/master...dev
