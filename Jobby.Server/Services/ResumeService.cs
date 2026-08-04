using DocumentFormat.OpenXml.Packaging;
using Jobby.Infrastructure.Data;
using Jobby.Models.Dto;
using Jobby.Server.Helpers;
using Microsoft.EntityFrameworkCore;
using NJsonSchema;
using System.Text.Json;

namespace Jobby.Server.Services
{
    public class ResumeService(IDbContextFactory<AppDbContext> dbContextFactory, IOllamaService ollamaService) : ServiceBase(dbContextFactory), IResumeService
    {
        private readonly IOllamaService _ollamaService = ollamaService;

        public async Task<ResumeAnalysisResponse> RateResumeAsync(IFormFile file)
        {
            using var inputDocStream = new MemoryStream();
            await file.CopyToAsync(inputDocStream);
            inputDocStream.Position = 0;

            string resumeText;
            using (var wordDoc = WordprocessingDocument.Open(inputDocStream, false))
            {
                resumeText = wordDoc.MainDocumentPart?.Document?.Body?.InnerText ?? string.Empty;
            }

            if (string.IsNullOrWhiteSpace(resumeText))
                throw new InvalidOperationException("Could not extract text from the uploaded resume.");

            var schema = JsonSchema.FromType<ResumeAnalysisResponse>();
            var prompt = $"""
                {ResumePrompts.ResumeRating()}

                JSON Schema:
                {schema.ToJson()}

                Resume text:
                {resumeText}
                """;

            var response = await _ollamaService.GenerateJsonAsync(
                prompt,
                "You are an expert ATS scanner and career coach. Meticulously analyze the resume text provided.");

            var report = JsonSerializer.Deserialize<ResumeAnalysisResponse>(
                JsonHelpers.RemoveFence(response),
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            return report ?? throw new InvalidOperationException("The AI response could not be parsed.");
        }
    }
}
