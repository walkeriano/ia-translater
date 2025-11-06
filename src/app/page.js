"use client";
import styles from "./page.module.css"
import { useState, useRef } from "react";
import CameraFeed from "@/components/camera/CameraFeed";
import HandProcessor from "@/components/camera/HandProcessor";
import TranslationDisplay from "@/components/display/TranslationDisplay";
import TitleGenerator from "@/components/titleGenerator/TitleGenerator";

export default function Page() {
  const videoRef = useRef(null);
  const [letter, setLetter] = useState(null);

  return (
    <section className={styles.pagestyles}>
      <TitleGenerator/>
      <CameraFeed ref={videoRef} />
      <HandProcessor videoRef={videoRef} onLetter={setLetter} />
      <TranslationDisplay letter={letter} />
    </section>
  );
}