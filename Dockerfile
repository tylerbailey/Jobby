FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080

FROM node:22-alpine AS client
WORKDIR /client
COPY jobby.client/package.json jobby.client/package-lock.json ./
RUN npm ci
COPY jobby.client/ ./
ENV VITE_API_URL=/api
RUN npm run build

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
RUN dotnet publish Jobby.Server/Jobby.Server.csproj -c Release -o /app/publish /p:UseAppHost=false /p:SkipSpaPublish=true

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
COPY --from=client /client/dist ./wwwroot
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "Jobby.Server.dll"]
