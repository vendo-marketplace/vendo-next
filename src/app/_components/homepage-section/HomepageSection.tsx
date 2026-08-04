"use client";

import api from "@/axios/axios";
import { useQuery } from "@tanstack/react-query";

const HomepageSection = () => {
  const { data } = useQuery({
    queryKey: ["asd"],
    queryFn: async () => {
      const res = await api.post("/search");
      return res.data;
    },
  });
  console.log("Data: ", data);
  return <div className="bg-gray-700 h-full flex flex-1">Homepage</div>;
};

export default HomepageSection;
