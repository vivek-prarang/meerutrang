"use client";

import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import VisitorCounter from "../VisitorCounter";
import AnimatedCounter from "../AnimatedCounter";
import api from "@/lib/api";
import Subscriber from "./Subscriber";

export default function Header() {
  const [visitorship, setVisitorship] = useState(1500);
  const [reader, setReader] = useState(12802);
  useEffect(() => {
    const fetchReaderCount = async () => {
      const data = localStorage.getItem("internateData_c2");
      if (data) {
        const parsedData = JSON.parse(data);
        setReader(Number(parsedData.reader_info.a1) + Number(parsedData.reader_info.a2) + Number(parsedData.reader_info.a3));
      }
    };
    fetchReaderCount();
  }, []);


  useEffect(() => {
    const fetchVisitorData = async () => {
      try {
        const { data, error } = await api.get("/daily-posts/list", { client: "prarang", params: { language: 'hi', location: 'c2', per_page: 10 } });
        if (data) {
          const totalVisitors = data.data.viewership;
          setVisitorship(totalVisitors);
          console.log("Total Visitors:", totalVisitors);
        } else if (error) {
          console.error("Error fetching posts:", error);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchVisitorData();
  }, []);


  return (
    <header className="grid grid-cols-12 p-4 items-center gap-4">
      {/* LEFT – 3 Columns */}
      <div className="col-span-12 md:col-span-3 flex items-center gap-4">
        <img
          src="https://i.ibb.co/6c4JQSpJ/Prarang-logox.png"
          alt="Logo"
          className="w-34 md:w-32"
        />
        <div className="w-full mx-4">  <VisitorCounter /></div>

      </div>
      {/* MIDDLE – 6 Columns */}
      <div className="col-span-12 md:col-span-6 flex justify-center items-center h-full">
        {/* <div className="mb-2 p-3 py-5 w-full bg-[blue] rounded  mx-4"> */}
        {/* <h2 className="text-2xl text-[yellow] font-bold text-center"> <sup> <small>प्रारंग के</small></sup>  मेरठ रंग: मेरठवासियों की अपनी वेबसाइट  </h2> */}
        <Subscriber />
        {/* </div> */}
      </div>

      {/* RIGHT – 3 Columns */}
      <div className="col-span-12 md:col-span-3 flex flex-col justify-center md:justify-end">


        <div className="p-3 bg-black border rounded text-white text-center w-full ">
          <table className="table-auto mx-auto text-left">
            <tbody>
              <tr>
                <td className="pr-2">मेरठ स्थानीय सब्सक्राइबर:</td>
                <td><AnimatedCounter number={reader} label=" " size="small" color="" />
                </td>
              </tr>
              <tr>
                <td className="pr-2">
                  मासिक मेरठ  वेबपेज व्यू :</td>
                <td><AnimatedCounter number={3.2} label="लाख" size="small" color="" decimals={1} /> </td>
              </tr>
              <tr>
                <td className="pr-2">आज के मेरठ पाठक:</td>
                <td><AnimatedCounter number={visitorship} label="" size="small" color="" /></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-1 pb-1 text-center flex  gap-2">
          <a target="_blank" href="https://b2b.prarang.in/login?lt=partner" className="btn btn-yellow w-full bg-amber-300 p-1 rounded-sm shadow-md">Business  Login</a>
          <a target="_blank" href="https://b2b.prarang.in/login?lt=g2c" className="btn btn-yellow w-full bg-amber-300 p-1 rounded-sm shadow-md">Govt. & NGO Login</a>
        </div>
      </div>


    </header >
  );
}
