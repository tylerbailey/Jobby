using DocumentFormat.OpenXml.Packaging;
using Google.GenAI;
using Google.GenAI.Types;
using Jobby.Server.Data;
using Jobby.Server.Domain;
using Jobby.Server.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using MiniSoftware;
using NJsonSchema;
using OpenXmlPowerTools;
using System.Text.Json;
using System.Xml.Linq;

namespace Jobby.Server.Services
{
    public class ResumeService(IDbContextFactory<AppDbContext> dbContextFactory, IOptions<ApiKeys> settings) : ServiceBase(dbContextFactory), IResumeService
    {
        private readonly ApiKeys _options = settings.Value;

        public async Task<ResumeAnalysisResponse> RateResumeAsync(IFormFile file)
        {
            // 1. Read the uploaded IFormFile into an in-memory stream
            using var inputDocStream = new MemoryStream();
            await file.CopyToAsync(inputDocStream);
            inputDocStream.Position = 0;

            // 2. Convert the Word document stream directly to PDF bytes using MiniPdf
            byte[] pdfBytes = MiniPdf.ConvertToPdf(inputDocStream);

            // 3. Generate your Structured Output JSON schema
            var schema = JsonSchema.FromType<ResumeAnalysisResponse>();
            var schemaElement = JsonDocument.Parse(schema.ToJson()).RootElement;

            // 4. Initialize the Gemini Client
            var geminiClient = new Client(apiKey: _options.Gemini);

            // 5. Configure settings and structured output requirements
            var contentConfig = new GenerateContentConfig
            {
                ResponseJsonSchema = schemaElement,
                ResponseMimeType = "application/json",
                Temperature = 0.2f,
                SystemInstruction = new Content
                {
                    Parts = [Part.FromText("You are an expert ATS scanner and career coach. Meticulously analyze both the visual layout and text content of this PDF resume.")]
                }
            };

            // 6. Construct the payload using the generated PDF bytes
            var contents = new Content
            {
                Parts = [
                    Part.FromBytes(pdfBytes, "application/pdf"),
            Part.FromText(ResumePrompts.ResumeRating())
                ]
            };

            // 7. Execute the call against the model
            var geminiResponse = await geminiClient.Models.GenerateContentAsync(
                model: "gemini-2.5-flash",
                contents: contents,
                config: contentConfig
            );
            var report = JsonSerializer.Deserialize<ResumeAnalysisResponse>(geminiResponse.Text ?? string.Empty);
            return report ?? throw new Exception("error");
        }
    }
}
