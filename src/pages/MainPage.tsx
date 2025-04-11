import Header from "@/components/Header/Header";
import Hero from "@/components/Hero/Hero";
import Works from "@/components/Works/Works";

const MainPage = () => {
  return (
    <>
      <div className="main-page">
        <Header />
        <div className="main-page-content">
          <Hero />
          <Works />
        </div>
      </div>
    </>
  );
};

export default MainPage;
