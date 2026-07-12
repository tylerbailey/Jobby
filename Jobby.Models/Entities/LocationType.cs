namespace Jobby.Models.Entities
{
    public class LocationType : BaseModel, IEntity
    {
        public string Type { get; set; } = string.Empty;
    }
}
