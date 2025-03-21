const sql = require('mssql');
const { BlobServiceClient } = require('@azure/storage-blob');

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
        const { title, description, eventDate, location, maxParticipants, imageFile } = req.body;

        // Validate required fields
        if (!title || !eventDate) {
            context.res = {
                status: 400,
                body: { error: "Title and event date are required" }
            };
            return;
        }

        // Handle image upload if provided
        let imageUrl = null;
        if (imageFile) {
            const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.STORAGE_CONNECTION_STRING);
            const containerClient = blobServiceClient.getContainerClient('event-images');
            const blobName = `${Date.now()}-${imageFile.name}`;
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            
            // Upload image (implementation depends on how you receive the file)
            // This is a simplified version
            await blockBlobClient.upload(imageFile, imageFile.length);
            imageUrl = blockBlobClient.url;
        }

        // Connect to database
        await sql.connect(config);

        // Insert event
        const result = await sql.query`
            INSERT INTO Events (Title, Description, EventDate, Location, MaxParticipants, ImageUrl)
            VALUES (${title}, ${description}, ${eventDate}, ${location}, ${maxParticipants}, ${imageUrl});
            
            SELECT SCOPE_IDENTITY() AS EventId;
        `;

        context.res = {
            status: 201,
            body: {
                message: "Event created successfully",
                eventId: result.recordset[0].EventId
            }
        };
    } catch (error) {
        context.log.error('Error creating event:', error);
        context.res = {
            status: 500,
            body: { error: "Failed to create event" }
        };
    } finally {
        sql.close();
    }
}; 