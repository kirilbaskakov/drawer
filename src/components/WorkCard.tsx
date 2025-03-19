const WorkCard = ({ name, date }: { name: string; date: string }) => {
  return (
    <div className="work-card">
      <div style={{ width: "100%", height: "200px", background: "#eee" }} />
      <div className="work-card-info">
        <p className="work-card-title">{name}</p>
        <p className="work-card-date">{date}</p>
      </div>
    </div>
  );
};

export default WorkCard;
