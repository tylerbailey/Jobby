using System.Text.Json;

namespace Jobby.Server.Helpers
{
    public static class JsonHelpers
    {
        public static string RemoveFence(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
                return string.Empty;

            input = input.Trim();

            // Remove markdown code fences
            if (input.StartsWith("```"))
            {
                var firstNewline = input.IndexOf('\n');

                if (firstNewline >= 0)
                    input = input[(firstNewline + 1)..];

                var lastFence = input.LastIndexOf("```", StringComparison.Ordinal);

                if (lastFence >= 0)
                    input = input[..lastFence];
            }

            return input.Trim();

        }
    }
}
