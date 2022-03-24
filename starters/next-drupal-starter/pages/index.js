import Image from "next/image";
import Link from "next/link";
import Layout from "../components/layout";

import absoluteUrl from "next-absolute-url";
import { NextSeo } from "next-seo";
import { DrupalState } from "@pantheon-systems/drupal-kit";

const drupalUrl = process.env.backendUrl;
export default function Home({ articles, hrefLang }) {
  return (
    <Layout>
      <NextSeo
        title="Decoupled Next Drupal Demo"
        description="Generated by create next app."
        languageAlternates={hrefLang || false}
      />
      <>
        <div className="prose sm:prose-xl mt-20 flex flex-col mx-auto max-w-fit">
          <h1 className="prose text-4xl text-center h-full">
            Welcome to{" "}
            <a
              className="text-blue-600 no-underline hover:underline hover:text-blue-400 active:text-purple-500 focus:text-purple-400 visited:text-purple-700"
              href="https://nextjs.org"
            >
              Next.js!
            </a>
          </h1>

          <div className="text-2xl">
            <div className="bg-black text-white rounded flex items-center justify-center p-4">
              Decoupled hosting by{" "}
              <Image
                src="/pantheon.svg"
                alt="Pantheon Logo"
                width={191}
                height={60}
              />
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-5 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-screen-lg">
          {/* Check to see if this is an object before mapping */}
          {articles.map((article) => {
            const imgSrc =
              drupalUrl + article.field_media_image.field_media_image.uri.url;
            return (
              <Link
                passHref
                href={`/${article.path.langcode}${article.path.alias}`}
                key={article.id}
              >
                <div className="flex flex-col rounded-lg shadow-lg overflow-hidden cursor-pointer border-2 hover:border-indigo-500">
                  <div className="flex-shrink-0 relative h-40">
                    <Image
                      src={imgSrc}
                      layout="fill"
                      objectFit="cover"
                      alt={
                        article.field_media_image.field_media_image
                          .resourceIdObjMeta.alt
                      }
                    />
                  </div>
                  <h2 className="my-4 mx-6 text-xl leading-7 font-semibold text-gray-900">
                    {article.title} &rarr;
                  </h2>
                </div>
              </Link>
            );
          })}
        </div>
      </>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { origin } = absoluteUrl(context.req);
  const { locales } = context;
  const hrefLang = locales.map((locale) => {
    return {
      hrefLang: locale,
      href: origin + "/" + locale,
    };
  });
  // TODO - determine apiRoot from environment variables
  const store = new DrupalState({
    apiBase: drupalUrl,
    defaultLocale: context.locale,
  });

  store.params.addInclude(["field_media_image.field_media_image"]);
  const articles = await store.getObject({
    objectName: "node--article",
    res: context.res,
  });

  // The calls below are unnecessary for rendering the page, but demonstrates
  // both that surrogate keys are de-duped when added to the response, and also
  // that they are bubbled up for GraphQL link queries.

  // A duplicate resource to ensure that keys are de-duped.
  await store.getObject({
    objectName: "node--article",
    id: articles[0].id,
    query: `{
      id
      title
    }`,
    res: context.res,
  });
  store.params.clear();

  // A new resource to ensure that keys are bubbled up.
  await store.getObject({
    objectName: "node--page",
    query: `{
      id
      title
    }`,
    res: context.res,
  });

  return {
    props: {
      articles,
      hrefLang,
    },
  };
}
