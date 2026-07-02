using Jobby.Server.Constants;

namespace Jobby.Server.Tests;

public class RolesTests
{
    [Fact]
    public void All_ContainsExpectedRoles()
    {
        Assert.Contains(Roles.Admin, Roles.All);
        Assert.Contains(Roles.User, Roles.All);
        Assert.Equal(2, Roles.All.Length);
    }
}
