import React from "react";
import FooterNav from "../components/footerNav";
import HeaderNav from "../components/headerNav";
import styles from "../styles/Home.module.css";
import Head from "next/head";

const credits = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>ARFed || Credits</title>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.png"></link>
        <meta
          name="description"
          content="ARFED is a web-based augmented reality application, created to help both students and teachers visualize topics/subject taught in the classroom in 3D."
        />
      </Head>
      <HeaderNav />
      <div className="lg:w-2/3 mx-4 mx-auto my-10">
        <h1 className="text-3xl my-4"> 3D models referrence</h1>
        Very crunchyTaco <br />
        Frank Johnansson <br />
        johana ps
        <br />
        peter linejung
        <br />
        npbehunin
        <br />
        selvia.david.richard <br />
        Enans
        <br />
        Elliotss
        <br />
        Eugen Vahrushin <br />
        Konstantin Keller
        <br />
        Lucas Presoto
        <br />
        anggelomos
        <br />
        I.Isabelgordon
        <br />
        troy
        <br />
        ashwin
        <br />
        Enith2478
        <br />
        cgmac
        <br />
        Jake 26_26
        <br />
        Bill Bui
        <br />
        Merryed
        <br />
        cieroceramics
        <br />
        Vera4art
        <br />
        juglans
        <br />
        andrey6475u
        <br />
        zerberusx
        <br />
        michael aristov
        <br />
        illarionov.school
        <br />
        canary Games
        <br />
        gilles.schaeck
        <br />
        dubey.ujjwal1994
        <br />
      </div>
      <FooterNav />
    </div>
  );
};

export default credits;
