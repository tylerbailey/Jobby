using Jobby.Server.Data;
using Microsoft.EntityFrameworkCore;

namespace Jobby.Server.Services
{
    public class ServiceBase(IDbContextFactory<AppDbContext> dbContextFactory)
    {
        protected readonly IDbContextFactory<AppDbContext> _dbContextFactory = dbContextFactory;
    }
}