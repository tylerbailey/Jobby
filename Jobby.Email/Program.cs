using Jobby.Email;
using Jobby.Email.Services;
using Jobby.Infrastructure.Data;
using Jobby.Models.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = Host.CreateApplicationBuilder(args);
builder.Services.AddDbContextFactory<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddHostedService<Worker>();
builder.Services.AddHttpClient();
builder.Services
    .AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

builder.Services.Configure<MailJetOptions>(
    builder.Configuration.GetSection("MailJet"));

builder.Services.AddSingleton<IEmailService, EmailService>();

var host = builder.Build();
host.Run();
