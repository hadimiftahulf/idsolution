import Image from "next/image";
import React from "react";

function Article() {
  return (
    <div className="uk-section">
      <div className="uk-card uk-card-default uk-card-body ">
        <article className="uk-article">
          <div uk-grid="">
            <div className="uk-width-1-2">
              <Image
                src={"/images/nextjs.png"}
                sizes="100vw"
                // fill
                width={400}
                height={400}
                alt=""
              />
            </div>
            <div className="uk-width-1-2">
              <h1 className="uk-article-title ">
                <a className="uk-link-reset" href="">
                  Nexjt JS
                </a>
              </h1>

              <p className="uk-article-meta">
                Written by <a href="#">Super User</a> on 12 April 2012. Posted
                in <a href="#">Blog</a>
              </p>

              <p className="uk-text-lead">
                In Next.js, we set the title and description in the Head
                component. This is how meta title and description tags might
                look like in Next.js
              </p>

              <p>
                Next.js is a React framework for building full-stack web
                applications. You use React Components to build user interfaces,
                and Next.js for additional features and optimizations. Under the
                hood, Next.js also abstracts and automatically configures
                tooling needed for React, like bundling, compiling, and more
              </p>
            </div>

            {/* <div className="uk-grid-small uk-child-width-auto" uk-grid>
            <div>
              <a className="uk-button uk-button-text" href="#">
                Read more
              </a>
            </div>
            <div>
              <a className="uk-button uk-button-text" href="#">
                5 Comments
              </a>
            </div>
          </div> */}
          </div>
        </article>
      </div>
    </div>
  );
}

export default Article;
