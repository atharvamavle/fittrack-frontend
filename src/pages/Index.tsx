import StatCards from "@/components/dashboard/StatCards";
import ActivityChart from "@/components/dashboard/ActivityChart";
import ProgressChart from "@/components/dashboard/ProgressChart";
import TrainerCards from "@/components/dashboard/TrainerCards";
import DietMenu from "@/components/dashboard/DietMenu";
import RightPanel from "@/components/dashboard/RightPanel";

const Index = () => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
      {/* Main content */}
      <div className="space-y-6">
        <StatCards />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ActivityChart />
          <ProgressChart />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TrainerCards />
          <DietMenu />
        </div>
      </div>
      {/* Right panel */}
      <div className="hidden xl:block">
        <RightPanel />
      </div>
    </div>
  );
};

export default Index;
