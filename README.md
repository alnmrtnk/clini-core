# CliniCore

CliniCore is a full-stack healthcare application consisting of a .NET 8 backend (Server-app) and an Angular/Ionic frontend (Client-app). This README provides an overview of the main files and step-by-step instructions to set up and run the project locally.

---

## File Structure

The following is a summary of the most important files and folders in the repository:

| No. | File/Folder                            | Purpose                                                                       | Project    |
|-----|----------------------------------------|-------------------------------------------------------------------------------|------------|
| 1   | **server-app/Program.cs**              | Entry point: configures DI, middleware, and API routing                       | Server-app |
| 2   | **server-app/appsettings.json**        | Configuration (connection strings, JWT settings, AWS S3, etc.)                | Server-app |
| 3   | **server-app/CliniCore.Server.csproj** | Lists NuGet dependencies; package restore point                                | Server-app |
| 4   | **client-app/src/app/**                | Angular/Ionic modules, pages, components, and services                        | Client-app |
| 5   | **client-app/src/environments/**       | Environment-specific settings (API URLs, prod/dev flags)                      | Client-app |
| 6   | **client-app/package.json**            | npm dependencies and scripts for building/serving the frontend                | Client-app |

---

## Prerequisites

Before you begin, make sure you have the following installed on your machine:

1. **Backend:**
   - Visual Studio 2022+ (or later) with .NET 8 SDK  
     (You may also use Visual Studio Code if you prefer, but Visual Studio is recommended for a smoother backend experience.)
   - PostgreSQL 13+ database server

2. **Frontend:**
   - Node.js 18+ (includes npm)
   - Ionic CLI (install globally):
          npm install -g @ionic/cli

---

## Clone Repository

Open a terminal and run:
    
    git clone https://github.com/alnmrtnk/clini-core.git  
    cd clini-core  

---

## Backend Setup (Server-app)

1. Navigate to the server project  
        cd server-app  

2. Restore NuGet packages  
        dotnet restore  

3. Apply EF Core migrations  
   Ensure PostgreSQL is running and the connection string in appsettings.json is correct. Then run:  
        dotnet ef database update  

4. Build the project  
        dotnet build  

5. Run the API  
        dotnet run  
   By default, the backend will listen on:  
   • HTTPS: https://localhost:5001  
   • HTTP: http://localhost:5000  

   Tip: If you see any SSL errors in the browser, trust the development certificate by running:  
        dotnet dev-certs https --trust  

---

## Frontend Setup (Client-app)

1. Open a new terminal window/tab and go to the client directory:  
        cd ../client-app  

2. Install npm dependencies  
        npm install  

3. Serve the Ionic application  
        ionic serve --external  
   This will start the frontend at http://localhost:8100 (or another port if 8100 is occupied). It will automatically open your default browser.

---

## Environment Configuration

- **Backend (server-app/appsettings.json):**  
   • ConnectionStrings:DefaultConnection  
      "ConnectionStrings": {  
         "DefaultConnection": "Host=localhost;Port=5432;Database=CliniCoreDB;Username=YOUR_DB_USER;Password=YOUR_DB_PASSWORD"  
      }  

   • JwtSettings  
      "JwtSettings": {  
         "Issuer": "YourIssuer",  
         "Audience": "YourAudience",  
         "SecretKey": "YourSuperSecretKey"  
      }  

   • AWS (if used)  
      "AWS": {  
         "AccessKey": "YOUR_AWS_ACCESS_KEY",  
         "SecretKey": "YOUR_AWS_SECRET_KEY",  
         "Region": "us-east-1",  
         "BucketName": "your-bucket-name"  
      }  

- **Frontend (client-app/src/environments/):**  
   • environment.ts (development)  
      export const environment = {  
         production: false,  
         apiUrl: 'https://localhost:5001/api'  
      };  

   • environment.prod.ts (production)  
      export const environment = {  
         production: true,  
         apiUrl: 'https://your-production-domain.com/api'  
      };  

---

## Running the Full Stack Locally

1. Start PostgreSQL and verify the database exists.  
2. Run the Backend (steps under “Backend Setup”).  
3. Run the Frontend (steps under “Frontend Setup”).  
4. Open your browser to http://localhost:8100 to access the Ionic app. The frontend will call the backend at https://localhost:5001/api.

---

## Useful Scripts

- **Backend (inside server-app/):**  
    • dotnet restore – restore NuGet packages  
    • dotnet ef database update – apply EF Core migrations  
    • dotnet build – compile the project  
    • dotnet run – launch the API server  

- **Frontend (inside client-app/):**  
    • npm install – install dependencies  
    • ionic serve --external – serve the Ionic app with live reload  
    • npm run build – create a production build in the www/ folder  

---

## Troubleshooting

- **Port Conflicts**  
   If 5001 (backend) or 8100 (frontend) are already in use, specify a different port:  
        dotnet run --urls "https://localhost:5002;http://localhost:5001"  
        ionic serve --external --port=8200  

- **SSL/HTTPS Errors**  
   Trust the .NET development certificate:  
        dotnet dev-certs https --trust  

- **Database Migration Failures**  
   Verify PostgreSQL is running and the connection string is correct.  
   Confirm that the database user has permission to create/update schemas.

- **CORS Errors**  
   In Program.cs, ensure CORS is enabled before mapping controllers:  
    
      builder.Services.AddCors(options =>  
      {  
         options.AddPolicy("AllowAll", policy =>  
         {  
             policy  
               .AllowAnyOrigin()  
               .AllowAnyMethod()  
               .AllowAnyHeader();  
         });  
      });  

      var app = builder.Build();  

      app.UseCors("AllowAll");  
      app.UseAuthentication();  
      app.UseAuthorization();  
      app.MapControllers();  

---

## Contributing

1. Fork the repository.  
2. Create a new branch for your feature:  
        git checkout -b feature/your-feature-name  
3. Make your changes, commit with clear messages.  
4. Push to your fork and open a Pull Request against main.

