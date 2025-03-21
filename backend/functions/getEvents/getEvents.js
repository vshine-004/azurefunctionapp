const sql = require('mssql');

const config = {
    server: process.env.SQL_SERVER,
    database: process.env.SQL_DATABASE,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

module.exports = async function (context, req) {
    try {
        // Connect to database
        await sql.connect(config);

        // Get all events with registration count
        const result = await sql.query`
            SELECT 
                e.EventId,
                e.Title,
                e.Description,
                e.EventDate,
                e.Location,
                e.MaxParticipants,
                e.ImageUrl,
                e.CreatedAt,
                (SELECT COUNT(*) FROM Registrations WHERE EventId = e.EventId) as CurrentRegistrations
            FROM Events e
            ORDER BY e.EventDate ASC
        `;

        context.res = {
            status: 200,
            body: result.recordset
        };
    } catch (error) {
        context.log.error('Error fetching events:', error);
        context.res = {
            status: 500,
            body: { error: "Failed to fetch events" }
        };
    } finally {
        sql.close();
    }
}; 