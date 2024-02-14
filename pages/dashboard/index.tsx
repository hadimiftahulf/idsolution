import React from "react";
import { signOut, useSession } from "next-auth/react";
import Slider from "@/components/section/Slider";
import Article from "@/components/section/Article";
import Galery from "@/components/section/Galery";
import { useRouter } from "next/router";

function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  // console.log(session);
  return (
    <div className="uk-container uk-container-large">
      <Slider />
      <Article />
      <Galery />
    </div>
  );
}

export default Dashboard;
