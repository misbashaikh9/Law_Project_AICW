import LawNavbar from "./LawNavbar";
import ServicesSection from "./Services";
import LawFooter from "./LawFooter";

const ServicesPage = () => {
  return (
    <div className="bg-offwhite">
      <LawNavbar />
      <div className="h-16" />
      <ServicesSection />
      <LawFooter />
    </div>
  );
};

export default ServicesPage;
