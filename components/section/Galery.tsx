"use client";
import Image from "next/image";
import React from "react";

function Galery() {
  const galeryData = [
    {
      image: "/images/nextjs.png",
      title: "Next JS",
    },
    {
      image: "/images/next-auth.png",
      title: "Next Auth",
    },
    {
      image: "/images/prisma.png",
      title: "Prisma",
    },
    {
      image: "/images/sql.png",
      title: "SQL",
    },
    {
      image: "/images/getuikit.png",
      title: "Get UI Kit",
    },
  ];
  return (
    <div
      className="uk-grid-column-small uk-grid-row-large uk-child-width-1-3@s uk-text-center"
      uk-grid=""
    >
      {galeryData.map((galery, key) => (
        <div key={key}>
          <div className="uk-card uk-card-default uk-card-body">
            <a
              className="uk-inline"
              href={galery.image}
              data-caption={galery.title}
            >
              <Image src={galery.image} width="1800" height="1200" alt="" />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Galery;
