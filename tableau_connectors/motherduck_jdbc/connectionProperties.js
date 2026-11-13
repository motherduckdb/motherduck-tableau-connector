(function propertiesbuilder(attr) {
    const MOTHERDUCK_CONNECTOR_VERSION = '0.0.0';

    var props = {};
    // The Postgres endpoint authenticates on the token alone; the user name is ignored.
    props['user'] = 'postgres';
    props['password'] = attr[connectionHelper.attributePassword];
    // The endpoint reports this to MotherDuck as its user agent: pgendpoint(<application name>).
    // No parentheses: the endpoint replaces them.
    props['ApplicationName'] = 'tableau/' + MOTHERDUCK_CONNECTOR_VERSION
        + ' ' + connectionHelper.GetProductName()
        + '/' + connectionHelper.GetProductVersion()
        + ' ' + connectionHelper.GetPlatform();
    return props;
})
