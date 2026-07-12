FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Build context MUST be the repository root (not Jobby.Server/).
COPY Jobby.Models/Jobby.Models.csproj Jobby.Models/
COPY Jobby.Infrastructure/Jobby.Infrastructure.csproj Jobby.Infrastructure/
COPY Jobby.Server/Jobby.Server.csproj Jobby.Server/
RUN dotnet restore Jobby.Server/Jobby.Server.csproj

COPY Jobby.Models/ Jobby.Models/
COPY Jobby.Infrastructure/ Jobby.Infrastructure/
COPY Jobby.Server/ Jobby.Server/
RUN dotnet publish Jobby.Server/Jobby.Server.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "Jobby.Server.dll"]
