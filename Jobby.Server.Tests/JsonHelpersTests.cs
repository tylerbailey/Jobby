using Jobby.Server.Helpers;

namespace Jobby.Server.Tests;

public class JsonHelpersTests
{
    [Theory]
    [InlineData("", "")]
    [InlineData("   ", "")]
    [InlineData("{\"score\": 90}", "{\"score\": 90}")]
    public void RemoveFence_ReturnsTrimmedInput_WhenNoFence(string input, string expected)
    {
        Assert.Equal(expected, JsonHelpers.RemoveFence(input));
    }

    [Fact]
    public void RemoveFence_StripsMarkdownJsonFence()
    {
        const string input = """
            ```json
            {"overallScore": 85}
            ```
            """;

        Assert.Equal("{\"overallScore\": 85}", JsonHelpers.RemoveFence(input));
    }

    [Fact]
    public void RemoveFence_StripsPlainCodeFence()
    {
        const string input = """
            ```
            hello
            ```
            """;

        Assert.Equal("hello", JsonHelpers.RemoveFence(input));
    }
}
