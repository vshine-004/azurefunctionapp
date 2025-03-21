# Event Registration & Notification System

A full-stack event registration system built with Azure services, featuring event creation, registration, and email notifications.

## Azure Services Used

- Azure SQL Database (Serverless)
- Azure Functions (Consumption Plan)
- Azure Communication Services
- Azure Static Web Apps
- Azure Blob Storage

## Prerequisites

- Azure subscription
- Node.js (v14 or later)
- Azure CLI
- Visual Studio Code with Azure Functions extension

## Setup Instructions

    ### 1. Azure SQL Database Setup

    1. Create a new SQL Database in Azure Portal
    2. Choose Serverless tier for cost optimization
    3. Configure firewall rules to allow your IP
    4. Note down the connection string

### 2. Azure Functions Setup

1. Create a new Function App in Azure Portal
2. Choose Consumption plan
3. Deploy the backend code from the `backend` folder
4. Configure the following application settings:
   - SQL_SERVER
   - SQL_DATABASE
   - SQL_USERs
   - SQL_PASSWORD
   - STORAGE_CONNECTION_STRING
   - COMMUNICATION_SERVICES_CONNECTION_STRING
   - EMAIL_SENDER

### 3. Azure Blob Storage Setup

1. Create a new Storage Account
2. Create a container named 'event-images'
3. Note down the connection string

### 4. Azure Communication Services Setup

1. Create a new Communication Services resource
2. Configure email sending capabilities
3. Note down the connection string

### 5. Frontend Setup

1. Update the `.env` file with your Azure Function App URL
2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

### 6. Database Setup

1. Connect to your Azure SQL Database
2. Run the SQL scripts from `backend/database/schema.sql`

## Deployment

### Backend Deployment

1. Install Azure Functions Core Tools
2. Deploy using Azure CLI:
   ```bash
   cd backend
   func azure functionapp publish your-function-app-name
   ```

### Frontend Deployment

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```
2. Deploy to Azure Static Web Apps:
   ```bash
   az staticwebapp deploy
   ```

## Features

- Create and manage events
- Register for events
- Email notifications for registrations
- Image upload for events
- Real-time registration count
- Responsive design

## Cost Optimization

- Using Serverless SQL Database (auto-pauses when inactive)
- Consumption plan for Azure Functions (pay per execution)
- Free tier for Azure Communication Services
- Minimal Blob Storage usage
- Static Web Apps free tier

## Security

- SQL injection prevention using parameterized queries
- Secure file upload validation
- Environment variable configuration
- Azure AD integration (optional)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 