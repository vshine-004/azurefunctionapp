-- Create Users table
CREATE TABLE Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    Name NVARCHAR(100) NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- Create Events table
CREATE TABLE Events (
    EventId INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX),
    EventDate DATETIME2 NOT NULL,
    Location NVARCHAR(200),
    MaxParticipants INT,
    ImageUrl NVARCHAR(500),
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- Create Registrations table
CREATE TABLE Registrations (
    RegistrationId INT IDENTITY(1,1) PRIMARY KEY,
    EventId INT FOREIGN KEY REFERENCES Events(EventId),
    UserId INT FOREIGN KEY REFERENCES Users(UserId),
    Status NVARCHAR(20) DEFAULT 'Pending',
    RegisteredAt DATETIME2 DEFAULT GETDATE(),
    UNIQUE(EventId, UserId)
); 