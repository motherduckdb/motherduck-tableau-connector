# Developing the MotherDuck Tableau Connector

## Notes on manifest.xml
### <connector-plugin> tag
* `plugin-version` attribute is the version seen by users in Tableau Exchange. The repo carries `0.0.0`;
the Release workflow stamps the real version in when it packages, so don't edit it.
* `version` attribute refers to an internal Tableau version and should not be changed.

### <connection-customization>
* `version` attribute is not used by Tableau.
Leave it at 1.0 unless connection-customization changes.

## Releasing

See [Releasing in the README](./README.md#releasing). The Release workflow stamps the version into both
`manifest.xml` (`plugin-version`) and `connectionProperties.js` (`MOTHERDUCK_CONNECTOR_VERSION`); never bump
them in the repo.

## Running an unsigned connector

[See the detailed steps](./docs/unsigned_connector.md).

## Running connector under development

On Windows:
```
tableau.exe -DConnectPluginsPath=[CONNECTOR_LOCATION]
```

## Testing

CI smoke-tests the connection on every pull request. It doesn't cover the dialect: run the TDVT suite before
releasing a change to the connection files or `dialect.tdd`. See [Testing in the README](./README.md#testing).
