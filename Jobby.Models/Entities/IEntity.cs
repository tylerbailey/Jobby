namespace Jobby.Server.Entities
{
    public interface IEntity
    {
        int Id { get; set; }
        DateTime Created { get; set; }
        DateTime? Modified { get; set; }
        bool Disabled { get; set; }
    }
}
