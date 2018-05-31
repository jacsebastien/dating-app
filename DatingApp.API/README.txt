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

Create migrations:
    dotnet ef migrations add InitialCreate

Update database from migration files
    dotnet ef database update