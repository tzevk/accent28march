import Head from 'next/head';
import styles from '../styles/layout.module.css';

export const siteTitle = "Accent CRM";

export default function Layout({ pageTitle, children }) {
  return (
    <div className={styles.container}>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="description" content="Accent Techno Solutions" />
        <meta property="og:image" content="/accent.png" />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="og:site_name" content={siteTitle} />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="Website" />
        <title>{pageTitle}</title>
      </Head>
      <div className={styles.formContainer}>
        <main className={styles.formBox}>{children}</main>
      </div>
    </div>
  );
}