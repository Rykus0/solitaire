"use client";

import { DragEvent } from "react";
import classes from "./page.module.css";

export default function Home() {
  function dragCardStart(e: DragEvent<HTMLDivElement>) {
    const target = e.target as HTMLDivElement;
    console.log("drag");
    e.dataTransfer.clearData();
    e.dataTransfer.setData("text/plain", target.id);
  }

  function dragEnter(e: DragEvent<HTMLDivElement>) {
    console.log("enter");
    e.preventDefault();
  }

  function dragOver(e: DragEvent<HTMLDivElement>) {
    console.log("over");
    e.preventDefault();
  }

  function dropCard(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    console.log("drop");

    const id = e.dataTransfer?.getData("text");

    if (id && e.target instanceof HTMLDivElement) {
      const card = document.getElementById(id);

      if (card) {
        e.target.appendChild(card);
      }
    }
  }

  return (
    <main className={classes.main}>
      <div className={classes.board}>
        <div className={classes.stack}></div>
        <div className={classes.stack}></div>
        <div className={classes.stack}></div>
        <div className={classes.stack}></div>
      </div>
      <div className={classes.board}>
        <div className={classes.stack} onDragOver={dragOver} onDrop={dropCard}>
          <div className={classes.card}></div>
        </div>
        <div className={classes.stack}>
          <div className={classes.card}></div>
          <div className={classes.card}></div>
        </div>
        <div className={classes.stack}>
          <div className={classes.card}></div>
          <div className={classes.card}></div>
          <div className={classes.card}></div>
        </div>
        <div className={classes.stack}>
          <div className={classes.card}></div>
          <div className={classes.card}></div>
          <div className={classes.card}></div>
          <div className={classes.card}></div>
        </div>
        <div className={classes.stack}>
          <div className={classes.card}></div>
          <div className={classes.card}></div>
          <div className={classes.card}></div>
          <div className={classes.card}></div>
          <div className={classes.card}></div>
        </div>
        <div className={classes.stack}>
          <div className={classes.card}></div>
          <div className={classes.card}></div>
          <div className={classes.card}></div>
          <div className={classes.card}></div>
          <div className={classes.card}></div>
          <div className={classes.card}></div>
        </div>
        <div className={classes.stack}>
          <div className={classes.card}></div>
          <div className={classes.card}></div>
          <div className={classes.card}></div>
          <div className={classes.card}></div>
          <div className={classes.card}></div>
          <div className={classes.card}></div>
          <div
            id="drag-card"
            className={classes.card}
            draggable="true"
            onDragStart={dragCardStart}
          ></div>
        </div>
      </div>
      <div className={classes.board}>
        <div className={classes.stack}></div>
        <div className={classes.stack}></div>
      </div>
    </main>
  );
}
