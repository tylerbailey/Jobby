FROM node:22-alpine AS client-build
WORKDIR /src/jobby.client
COPY jobby.client/package.json jobby.client/package-lock.json ./
RUN npm ci
COPY jobby.client/ ./
RUN npm run build

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY . .
COPY --from=client-build /src/jobby.client/dist ./Jobby.Server/wwwroot
RUN dotnet restore Jobby.Server/Jobby.Server.csproj
RUN dotnet publish Jobby.Server/Jobby.Server.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "Jobby.Server.dll"]
