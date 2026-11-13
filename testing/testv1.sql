-- Loads the TDVT TestV1 dataset into MotherDuck. Run it through the Postgres endpoint:
--   psql "host=pg.us-east-1-aws.motherduck.com user=postgres dbname=tableau_tdvt sslmode=require" -f testv1.sql
-- after `CREATE DATABASE tableau_tdvt`, from tests/datasets/TestV1 of https://github.com/tableau/connector-plugin-sdk.
CREATE SCHEMA IF NOT EXISTS "TestV1";
USE tableau_tdvt."TestV1";
\i DDL/Calcs.sql
\i DDL/Staples.sql
INSERT INTO "Calcs" FROM read_csv('https://raw.githubusercontent.com/tableau/connector-plugin-sdk/master/tests/datasets/TestV1/Calcs_headers.csv', header = true);
INSERT INTO "Staples" FROM read_csv('https://raw.githubusercontent.com/tableau/connector-plugin-sdk/master/tests/datasets/TestV1/Staples_utf8.csv', header = false);
