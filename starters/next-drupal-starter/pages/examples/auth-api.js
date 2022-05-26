import {
  getCurrentLocaleStore,
  globalDrupalStateAuthStores,
} from "../../lib/drupalStateContext";

import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/layout";

export default function AuthApiExampleTemplate({ taxonomies }) {
  return (
    <Layout>
      <Head>
        <title>API Authorization Example</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="prose lg:prose-xl mt-10 flex flex-col mx-auto max-h-screen">
        <h1>API Authorization Example</h1>

        <Link passHref href="/">
          <span className="w-full underline cursor-pointer">Home &rarr;</span>
        </Link>

        <div className="mt-12 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-screen-lg">
          {taxonomies.length > 0 && (
            <p>
              If NextJS is able to make authorized requests to the Drupal API,
              you will see a list of taxonomy types below:
            </p>
          )}
          {taxonomies.length > 0 &&
            taxonomies.map((taxonomy) => {
              return (
                <p key={taxonomy.id}>
                  {taxonomy.name}: {taxonomy.description}
                </p>
              );
            })}
          {taxonomies.length === 0 && (
            <p>
              NextJS was unable to make an authorized request to the Drupal API.
              Please check your .env file to ensure that your CLIENT_ID and
              CLIENT_SECRET are set correctly.
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps({ locales, locale }) {
  const authstore = getCurrentLocaleStore(locale, globalDrupalStateAuthStores);

  authstore.params.clear();
  const taxonomies = await authstore.getObject({
    objectName: "taxonomy_vocabulary--taxonomy_vocabulary",
  });
  return {
    props: {
      taxonomies: taxonomies,
      revalidate: 60,
    },
  };
}
