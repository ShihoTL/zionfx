'use client';

import { useState, useEffect } from "react";
import { CalendarClock, PlayCircle } from "lucide-react";
import { Tabs, Tab, Box } from "@mui/material";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import bgImg from "/images/bg.png";
import { RootState } from "@/store/store"

import CallList from '@/components/live-classes/CallList';
import MeetingType from '@/components/live-classes/MeetingType';

const Meetings = () => {
  const userRole = useSelector((state: RootState) => state.user.role);
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);

  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const date = new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(now);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <div className="flex justify-between h-full max-w-2/3">
      <div className="w-full flex flex-col gap-5">

        {/* Card showing next meeting */}
        <div className="w-full p-4 pt-6 md:pt-10">
          <div className="w-full text-white flex h-[320px] p-4 flex-col justify-between rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[20px] rounded-br-[20px] bg-cover bg-center shadow-xl" style={{ backgroundImage: `url(${bgImg})` }}>
            <h2 className="glassmorphism max-w-[280px] rounded-xl py-2 text-center text-base font-normal text-sm">
              No Upcoming Meetings, You can relax!
            </h2>

            <div className="flex flex-col gap-4">
              <div className="w-full flex items-center justify-between">
                <div className="w-full">
                  <div className="w-full flex items-center justify-between mb-4">
                    <h1 className="text-4xl font-extrabold md:text-7xl bg-gradient-to-b from-white to-[#C2B04A] bg-clip-text text-transparent">{time}</h1>


                    {/* Custom Dropdown */}
                    <MeetingType />
                  </div>
                  <p className="text-lg font-medium text-sky-1 lg:text-2xl bg-gradient-to-b from-white to-[#C2B04A] bg-clip-text text-transparent">{date}</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-col lg:flex-row gap-4"> 
          <div className="md:flex-1 order-2 md:order-1">
            <Box className="mt-2 md:px-10">
              <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                textColor="inherit"
                TabIndicatorProps={{ style: { backgroundColor: "#FFD700" } }}
                sx={{
                  "& .MuiTab-root": {
                    color: "#888",
                    fontSize: { xs: "0.6rem", md: "1rem" },
                    textTransform: "none",
                    padding: { xs: "8px 12px", md: "12px 20px" },
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: { xs: "1px", md: "6px" },
                  },
                  "& .Mui-selected": {
                    color: "#FFD700",
                  },
                  "& .MuiTabs-flexContainer": {
                    gap: 1,
                  },
                }}
              >
                <Tab
                  icon={<PlayCircle className="h-4 w-4" />}
                  label="Ongoing Meetings"
                  iconPosition="start"
                />
                <Tab
                  icon={<PlayCircle className="h-4 w-4" />}
                  label="Recorded Meetings"
                  iconPosition="start"
                />
                <Tab
                  icon={<PlayCircle className="h-4 w-4" />}
                  label="Previous Meetings"
                  iconPosition="start"
                />
              </Tabs>

              {/* Tabs Content */}
              <Box className="mt-4 w-full h-full p-4">
                {tabIndex === 0 && <CallList type="ongoing" />}
                {tabIndex === 1 && <CallList type="recordings" />}
                {tabIndex === 2 && <CallList type="ended" />}
              </Box>
            </Box>
          </div>
        </div>
      </div>

      <Outlet />
    </div>
  );
};

export default Meetings;