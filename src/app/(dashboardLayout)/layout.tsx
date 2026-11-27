import DashboardHeader from "@/components/module/Dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/module/Dashboard/DashboradSidebar";
import React from "react";

const RootDashboardLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardSidebar />

      <div className="lg:pl-64">
        <DashboardHeader />

        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default RootDashboardLayout;
