// Evaluates the connector scripts the way Tableau does and prints the JDBC URL (first line) and the
// driver properties (key=value lines) for Smoke.java.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const connectionHelper = {
    attributeServer: 'server',
    attributeDatabase: 'dbname',
    attributePassword: 'password',
    GetProductName: () => 'smoke-test',
    GetProductVersion: () => '0',
    GetPlatform: () => process.platform,
    ThrowTableauException: (message) => { throw new Error(message); },
};
const connector = new URL('../../tableau_connectors/motherduck_jdbc/', import.meta.url);
const load = (file) => new Function('connectionHelper', 'return ' + readFileSync(new URL(file, connector), 'utf8'))(connectionHelper);
const buildUrl = load('connectionBuilder.js');
const buildProperties = load('connectionProperties.js');

assert.deepEqual(buildUrl({ server: 'pg.example.com', dbname: 'my db' }),
    ['jdbc:postgresql://pg.example.com:5432/my%20db?sslmode=require&options=-c%20attach_mode%3Dsingle%20-c%20return_pg_command_tags%3Dtrue']);
assert.throws(() => buildUrl({ server: 'pg.example.com' }), /specify the MotherDuck database/);
assert.deepEqual(buildProperties({ password: 'secret' }),
    { user: 'postgres', password: 'secret', ApplicationName: `tableau/0.0.0 smoke-test/0 ${process.platform}` });

const [host, database, token] = process.argv.slice(2);
assert.ok(host && database && token, 'usage: connection.mjs <host> <database> <token>');
const attr = { server: host, dbname: database, password: token };
console.log(buildUrl(attr)[0]);
for (const [key, value] of Object.entries(buildProperties(attr))) console.log(`${key}=${value}`);
