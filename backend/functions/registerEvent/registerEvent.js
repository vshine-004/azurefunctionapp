const sql = require('mssql');
const { EmailClient } = require('@azure/communication-email');

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
        const eventId = context.bindingData.eventId;
        const { email, name } = req.body;

        // Validate required fields
        if (!email || !name) {
            context.res = {
                status: 400,
                body: { error: "Email and name are required" }
            };
            return;
        }

        // Connect to database
        await sql.connect(config);

        // Check if event exists and has capacity
        const eventResult = await sql.query`
            SELECT Title, MaxParticipants, 
                   (SELECT COUNT(*) FROM Registrations WHERE EventId = ${eventId}) as CurrentRegistrations
            FROM Events 
            WHERE EventId = ${eventId}
        `;

        if (eventResult.recordset.length === 0) {
            context.res = {
                status: 404,
                body: { error: "Event not found" }
            };
            return;
        }

        const event = eventResult.recordset[0];
        if (event.CurrentRegistrations >= event.MaxParticipants) {
            context.res = {
                status: 400,
                body: { error: "Event is full" }
            };
            return;
        }

        // Check if user exists, if not create user
        let userId;
        const userResult = await sql.query`
            SELECT UserId FROM Users WHERE Email = ${email}
        `;

        if (userResult.recordset.length === 0) {
            const newUserResult = await sql.query`
                INSERT INTO Users (Email, Name)
                VALUES (${email}, ${name});
                SELECT SCOPE_IDENTITY() AS UserId;
            `;
            userId = newUserResult.recordset[0].UserId;
        } else {
            userId = userResult.recordset[0].UserId;
        }

        // Create registration
        await sql.query`
            INSERT INTO Registrations (EventId, UserId, Status)
            VALUES (${eventId}, ${userId}, 'Confirmed')
        `;

        // Send confirmation email
        const emailClient = new EmailClient(process.env.COMMUNICATION_SERVICES_CONNECTION_STRING);
        await emailClient.send({
            senderAddress: process.env.EMAIL_SENDER,
            recipients: {
                to: [{ address: email }]
            },
            subject: `Registration Confirmed - ${event.Title}`,
            htmlContent: `
                <h1>Registration Confirmed!</h1>
                <p>Dear ${name},</p>
                <p>Your registration for "${event.Title}" has been confirmed.</p>
                <p>We look forward to seeing you there!</p>
            `
        });

        context.res = {
            status: 201,
            body: {
                message: "Registration successful",
                eventTitle: event.Title
            }
        };
    } catch (error) {
        context.log.error('Error registering for event:', error);
        context.res = {
            status: 500,
            body: { error: "Failed to register for event" }
        };
    } finally {
        sql.close();
    }
}; 