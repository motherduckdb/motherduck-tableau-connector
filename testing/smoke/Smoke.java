import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.Properties;

/** Connects with the URL and properties from connection.mjs and runs what Tableau needs to work. */
public class Smoke {
    public static void main(String[] args) throws Exception {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        String url = in.readLine();
        Properties properties = new Properties();
        for (String line; (line = in.readLine()) != null; ) {
            properties.setProperty(line.substring(0, line.indexOf('=')), line.substring(line.indexOf('=') + 1));
        }

        try (Connection connection = DriverManager.getConnection(url, properties);
             Statement statement = connection.createStatement()) {
            String database = query(statement, "SELECT current_database()");
            check(url.contains("/" + database + "?"), "connected to " + database + ", not the database in " + url);
            String userAgent = query(statement, "SELECT current_setting('custom_user_agent')");
            check(userAgent.startsWith("pgendpoint(tableau/"), "user agent is " + userAgent);

            // The schema browser: tables and their columns through the driver's catalog queries.
            DatabaseMetaData metadata = connection.getMetaData();
            String schema, table;
            try (ResultSet tables = metadata.getTables(database, null, "%", new String[]{"TABLE", "VIEW"})) {
                check(tables.next(), "no tables listed in " + database);
                schema = tables.getString("TABLE_SCHEM");
                table = tables.getString("TABLE_NAME");
            }
            try (ResultSet columns = metadata.getColumns(database, schema, table, "%")) {
                check(columns.next(), "no columns listed for " + schema + "." + table);
            }
            // Catalog-qualified names, as CAP_JDBC_INCLUDE_CATALOG_NAME makes Tableau write them.
            query(statement, String.format("SELECT count(*) FROM \"%s\".\"%s\".\"%s\"", database, schema, table));
            System.out.println("ok: " + database + " as " + userAgent + ", read " + schema + "." + table);
        }
    }

    static String query(Statement statement, String sql) throws Exception {
        try (ResultSet result = statement.executeQuery(sql)) {
            result.next();
            return result.getString(1);
        }
    }

    static void check(boolean condition, String message) {
        if (!condition) throw new AssertionError(message);
    }
}
