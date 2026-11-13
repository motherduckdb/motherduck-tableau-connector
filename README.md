# A Tableau Connector for MotherDuck

This connector lets Tableau Desktop, Server and Cloud query [MotherDuck](https://motherduck.com) through its
[Postgres endpoint](https://motherduck.com/docs/sql-reference/postgres-endpoint/). Tableau only needs the PostgreSQL
JDBC driver: no DuckDB runs inside Tableau, so there is no driver to upgrade when DuckDB releases a new version.

Compared to Tableau's built-in PostgreSQL connector, this one generates DuckDB SQL (the dialect MotherDuck actually
speaks) and doesn't ask for temporary tables, which the Postgres endpoint doesn't support.

For local DuckDB files and in-memory databases, use the
[DuckDB connector](https://github.com/motherduckdb/duckdb-tableau-connector) instead. The two can be installed side by side.

## Installation

1. Download the [PostgreSQL JDBC driver](https://jdbc.postgresql.org/download/) and copy it into the Tableau Drivers directory:
   * MacOS: `~/Library/Tableau/Drivers/`
   * Windows: `C:\Program Files\Tableau\Drivers`
   * Linux: `/opt/tableau/tableau_driver/jdbc`

2. Download the signed Tableau connector ("Taco file") from the
   [latest release](https://github.com/motherduckdb/motherduck-tableau-connector/releases) and copy it into the Connectors directory:
   * Desktop Windows: `C:\Users\[YourUser]\Documents\My Tableau Repository\Connectors`
   * Desktop MacOS: `/Users/[YourUser]/Documents/My Tableau Repository/Connectors`
   * Server Windows: `C:\ProgramData\Tableau\Tableau Server\data\tabsvc\vizqlserver\Connectors`
   * Server Linux: `[Your Tableau Server Install Directory]/data/tabsvc/vizqlserver/Connectors`

## Connecting

Launch Tableau and create a new connection by choosing "MotherDuck by MotherDuck":

* **Host**: the Postgres endpoint of your organization's region, `pg.<region>.motherduck.com`. It defaults to
  `pg.us-east-1-aws.motherduck.com`; change it if your organization is in another region, for example
  `pg.eu-central-1-aws.motherduck.com`.
* **Database**: the MotherDuck database to connect to. The connection attaches only this database
  ([single attach mode](https://motherduck.com/docs/key-tasks/authenticating-and-connecting-to-motherduck/attach-modes/)),
  which keeps Tableau's schema browsing fast; add another connection for another database.
* **Token**: an [access token](https://motherduck.com/docs/key-tasks/authenticating-and-connecting-to-motherduck/authenticating-to-motherduck/)
  from the MotherDuck UI.

## Testing

`testing/` holds the [TDVT](https://tableau.github.io/connector-plugin-sdk/docs/tdvt) setup: `testv1.sql` loads the test
dataset into MotherDuck and `tds/` has the two data sources (set their `server` attribute to test another
region or environment). Put the token in `testing/tds/motherduck_jdbc.password` as
`motherduck_jdbc;<token>`, then from `testing/`:

```sh
python -m tdvt.tdvt run motherduck_jdbc
```

## Releasing

Don't create releases or tags from the GitHub UI, and don't bump versions in the repo: the manifest and the
user agent carry `0.0.0`, and the Release workflow stamps the real version in when it packages. Run it from
Actions → Release → Run workflow, or `gh workflow run release.yml -f version=1.2.0`:

- `sha`: a `main` commit whose `Package MotherDuck Taco` run is green (defaults to the latest).
- `version`: without the `v`; a numeric suffix such as `1.2.0-1` marks a pre-release (Tableau's manifest
  schema allows only digits after the dash).
- `dry_run`: run every check, package and sign the Taco and upload it as a workflow artifact, then only print
  the release command.

The workflow fails if tag `v<version>` already exists or the commit has no green `main` build. Otherwise it
packages the commit with the version stamped in, signs the Taco with the MotherDuck code-signing certificate
through DigiCert Software Trust Manager, creates the tag on the commit and publishes the release with
`motherduck_jdbc-v<version>-signed.taco` attached and auto-generated notes. `gh release create` publishes only after
the asset is uploaded, so no release goes out without its Taco.
