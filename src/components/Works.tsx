import { FaSort } from "react-icons/fa";
import WorkCard from "./WorkCard";

const Works = () => {
  return (
    <div className="works">
      <div className="works-heading">
        <h2 className="works-title">Your works</h2>
        <FaSort className="sort-button" />
      </div>
      <input placeholder="Search..." className="search-works" />
      <div className="work-cards">
        <WorkCard name="New Document" date="19.03.2025" />
        <WorkCard name="New Document" date="19.03.2025" />
        <WorkCard name="New Document" date="19.03.2025" />
        <WorkCard name="New Document" date="19.03.2025" />
        <WorkCard name="New Document" date="19.03.2025" />
        <WorkCard name="New Document" date="19.03.2025" />
        <WorkCard name="New Document" date="19.03.2025" />
        <WorkCard name="New Document" date="19.03.2025" />
        <WorkCard name="New Document" date="19.03.2025" />
        <WorkCard name="New Document" date="19.03.2025" />
        <WorkCard name="New Document" date="19.03.2025" />
        <WorkCard name="New Document" date="19.03.2025" />
        <WorkCard name="New Document" date="19.03.2025" />
        <WorkCard name="New Document" date="19.03.2025" />
      </div>
    </div>
  );
};

export default Works;
