import { useNavigate } from "react-router-dom";
import HeroVideo from "../assets/hero-video.webm";
import generateId from "../utils/generateId";

const Hero = () => {
  const navigate = useNavigate();

  const onClick = () => {
    navigate("/" + generateId());
  };

  return (
    <div className="hero">
      <div className="video-container">
        <video
          className="hero-video"
          src={HeroVideo}
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
      <h1 className="hero-title">Create your piece of art!</h1>
      <button className="hero-button" onClick={onClick}>
        Create
      </button>
    </div>
  );
};

export default Hero;
