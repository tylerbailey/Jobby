namespace Jobby.Server.Entities
{
    public class LocationType : BaseModel, IEntity
    {
        public string Type { get; set; }
        public virtual List<JobApp> JobApps { get; set; }
    }
}
