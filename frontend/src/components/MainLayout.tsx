import SideNavbar from "../components/SideNavbar";

const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <div>
    <SideNavbar />
    <div>{children}</div>
  </div>
);

export default MainLayout;