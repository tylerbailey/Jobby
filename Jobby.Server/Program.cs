using Jobby.Server.Constants;
using Jobby.Server.Data;
using Jobby.Server.Entities;
using Jobby.Server.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// -------------------- SERVICES --------------------

builder.Services.AddControllers();

builder.Services.AddDbContextFactory<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
// Identity
builder.Services
    .AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequiredLength = 8;
    options.Password.RequireDigit = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = false;
});

// App settings
builder.Services.AddOllama(builder.Configuration);

// -------------------- JWT --------------------

var jwt = builder.Configuration.GetSection("Jwt");

var key = new SymmetricSecurityKey(
    Encoding.UTF8.GetBytes(jwt["Key"]!)
);

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwt["Issuer"],
            ValidateAudience = true,
            ValidAudience = jwt["Audience"],
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = key,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(1)
        };
    });

// -------------------- CUSTOM SERVICES --------------------

builder.Services.AddScoped<IAppService, AppService>();
builder.Services.AddScoped<IStageService, StageService>();
builder.Services.AddScoped<IHistoryService, HistoryService>();
builder.Services.AddScoped<IEventService, EventService>();
builder.Services.AddScoped<IRecruiterService, RecruiterService>();
builder.Services.AddScoped<IResumeService, ResumeService>();
builder.Services.AddScoped<IAdminUserService, AdminUserService>();

builder.Services.AddAuthorization();

// -------------------- CORS (FIXED) --------------------
var origins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>() ?? [];

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactClient", policy =>
    {
        policy.WithOrigins(origins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// -------------------- OPENAPI --------------------

builder.Services.AddOpenApi();

// -------------------- BUILD APP --------------------

var app = builder.Build();

using var scope = app.Services.CreateScope();
var factory = scope.ServiceProvider.GetRequiredService<IDbContextFactory<AppDbContext>>();
using var db = factory.CreateDbContext();
db.Database.Migrate();

var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
foreach (var roleName in Roles.All)
{
    if (!await roleManager.RoleExistsAsync(roleName))
        await roleManager.CreateAsync(new IdentityRole(roleName));
}

app.UseStaticFiles();
app.UseDefaultFiles();
app.MapStaticAssets();

// OpenAPI dev only
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseCors("ReactClient");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();