using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using Jobby.Server.Dto;

namespace Jobby.Server.Helpers
{
    public static class DocxHelper
    {
        public static List<ResumeBlock> GetResumeBlocks(WordprocessingDocument wordDoc)
        {
            var data = wordDoc.MainDocumentPart!.Document!.Body;
            var paragraphs = data!.Descendants<Paragraph>().ToList();
            var blocks = paragraphs?.Select((p, index) => new ResumeBlock() { Id = index, Text = p.InnerText }).ToList();
            return blocks ?? [];
        }

        public static void ReplaceParagraphText(Paragraph paragraph, string newText)
        {
            var pPr = paragraph.ParagraphProperties?.CloneNode(true);

            paragraph.RemoveAllChildren();

            if (pPr != null)
            {
                paragraph.AppendChild(pPr);
            }

            paragraph.AppendChild(
                new Run(
                    new Text(newText)
                    {
                        Space = SpaceProcessingModeValues.Preserve
                    }));
        }
    }
}
