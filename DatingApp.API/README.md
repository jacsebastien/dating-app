Notes with commands or process to remember

Create new dotnet webapi project:
    dotnet new webapi -o DatingApp.API -n DatingApp.API

Setup environment:
On Mac:
    export ASPNETCORE_ENVIRONMENT=Development
On Windows:
    $env:ASPNETCORE_ENVIRONMENT = "Development"

If changes made in .csproj:
    dotnet restore  # apply changes

Launch API:
    dotnet run
    OR
    dotnet watch run    # if Microsoft.DotNet.Watcher.Tools is setup in .csproj file

Entityframework commands:
    dotnet ef

Create migrations based on Models creation and DataContext:
    dotnet ef migrations add MigrationName

Update database from migration files
    dotnet ef database update

Go back to a previous migration
    dotnet ef database update MigrationName (Don't work with SQLite)

Drop ALL Database
    dotnet ef database drop