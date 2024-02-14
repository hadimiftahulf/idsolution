import Image from "next/image";
import React from "react";

function Slider() {
  const sliderData = [
    {
      image: "/images/nextjs.png",
      title: "Next JS",
      description:
        "Next.js is a React framework for building full-stack web applications. You use React Components to build user interfaces, and Next.js for additional features and optimizations. Under the hood, Next.js also abstracts and automatically configures tooling needed for React, like bundling, compiling, and more",
    },
    {
      image: "/images/next-auth.png",
      title: "Next Auth",
      description:
        "NextAuth.js is an easy to implement, full-stack (client/server) open source authentication library originally designed for Next.js and Serverless. Our goal is to support even more frameworks in the future. Go to next-auth.js.org for more information and documentation.",
    },
    {
      image: "/images/prisma.png",
      title: "Prisma",
      description:
        "What is PRISMA? PRISMA stands for Preferred Reporting Items for Systematic Reviews and Meta-Analyses. It is an evidence-based minimum set of items for reporting in systematic reviews and meta-analyses. The PRISMA statement consists of a 27-item checklist and a 4-phase flow diagram",
    },
    {
      image: "/images/sql.png",
      title: "SQL",
      description:
        "Structured query language (SQL) is a programming language for storing and processing information in a relational database. A relational database stores information in tabular form, with rows and columns representing different data attributes and the various relationships between the data values.",
    },
    {
      image: "/images/getuikit.png",
      title: "Get UI Kit",
      description:
        "UIkit is a lightweight and modular front-end framework for developing fast and powerful web interfaces.",
    },
  ];
  return (
    <div className="uk-section ">
      <div className="uk-slider-container-offset " uk-slider={""}>
        <div className="uk-position-relative uk-visible-toggle uk-light">
          <ul className="uk-slider-items uk-child-width-1-2@s uk-grid">
            {sliderData.map((item, index) => (
              <li key={index}>
                <div className="uk-card uk-card-default">
                  <div className="uk-card-media-top uk-inline-clip uk-width-1-1">
                    <center>
                      <Image
                        src={item.image}
                        sizes="100vw"
                        // fill
                        width={200}
                        height={300}
                        alt=""
                      />
                    </center>
                  </div>
                  <div className="uk-card-body">
                    <h3 className="uk-card-title">{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <a
            className="uk-position-center-left uk-position-small uk-hidden-hover"
            href="#"
            uk-slidenav-previous
            uk-slider-item="previous"
          ></a>
          <a
            className="uk-position-center-right uk-position-small uk-hidden-hover"
            href="#"
            uk-slidenav-next
            uk-slider-item="next"
          ></a>
        </div>

        <ul className="uk-slider-nav uk-dotnav uk-flex-center uk-margin"></ul>
      </div>
    </div>
  );
}

export default Slider;
