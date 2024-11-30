import React from "react";
import MonthlyGraph from "./homepage components/MonthlyGraph";
import FourTile from "./homepage components/FourTile";
import TotalRevenue from "./homepage components/TotalRevenue";
import Footer from "./mobile components/Footer";

const Homepage = () => {
  return (
    <div className="absolute  h-[90%] w-full bg-white-800 rounded-md shadow-md">
      <main className="grid xsm:grid-rows-3 p-1 overflow-y-auto xsm:h-[95%] md:h-full w-[100%]">
        <FourTile />
        <TotalRevenue />
        <MonthlyGraph />
      </main>
      <footer className="h-[5%] w-full md:hidden xsm:block">
      <Footer/>
      </footer>
    </div>
  );
};

export default Homepage;
//mmvml
