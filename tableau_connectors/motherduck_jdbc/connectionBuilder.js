(function dsbuilder(attr) {
    var database = attr[connectionHelper.attributeDatabase];
    if (!database) {
        return connectionHelper.ThrowTableauException('Please specify the MotherDuck database to connect to.');
    }

    // Single attach mode keeps Tableau's catalog queries scoped to this database; Postgres command
    // tags are what the PostgreSQL JDBC driver expects back from statements.
    var options = "-c attach_mode=single -c return_pg_command_tags=true";

    return ["jdbc:postgresql://" + attr[connectionHelper.attributeServer] + ":5432/" + encodeURIComponent(database)
        + "?sslmode=require&options=" + encodeURIComponent(options)];
})
