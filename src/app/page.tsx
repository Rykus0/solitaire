"use client";

import { type DragEvent } from "react";
import classes from "./page.module.css";
import Card from "./components/Card";

export default function Home() {
  function dragCardStart(e: DragEvent<HTMLDivElement>) {
    const target = e.target as HTMLDivElement;
    e.dataTransfer.clearData();
    e.dataTransfer.setData("text/plain", target.id);
  }

  function dragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  function dropCard(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();

    const id = e.dataTransfer?.getData("text");
    const target = e.currentTarget as HTMLDivElement;
    console.log(target);

    if (id && target) {
      const card = document.getElementById(id);

      if (card) {
        target.appendChild(card);
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
          <Card onDragStart={dragCardStart} />
        </div>
        <div className={classes.stack} onDragOver={dragOver} onDrop={dropCard}>
          <Card onDragStart={dragCardStart} />
          <Card onDragStart={dragCardStart} />
        </div>
        <div className={classes.stack} onDragOver={dragOver} onDrop={dropCard}>
          <Card onDragStart={dragCardStart} />
          <Card onDragStart={dragCardStart} />
          <Card onDragStart={dragCardStart} />
        </div>
        <div className={classes.stack} onDragOver={dragOver} onDrop={dropCard}>
          <Card onDragStart={dragCardStart} />
          <Card onDragStart={dragCardStart} />
          <Card onDragStart={dragCardStart} />
          <Card onDragStart={dragCardStart} />
        </div>
        <div className={classes.stack} onDragOver={dragOver} onDrop={dropCard}>
          <Card onDragStart={dragCardStart} />
          <Card onDragStart={dragCardStart} />
          <Card onDragStart={dragCardStart} />
          <Card onDragStart={dragCardStart} />
          <Card onDragStart={dragCardStart} />
        </div>
        <div className={classes.stack} onDragOver={dragOver} onDrop={dropCard}>
          <Card onDragStart={dragCardStart} />
          <Card onDragStart={dragCardStart} />
          <Card onDragStart={dragCardStart} />
          <Card onDragStart={dragCardStart} />
          <Card onDragStart={dragCardStart} />
          <Card onDragStart={dragCardStart} />
        </div>
        <div className={classes.stack} onDragOver={dragOver} onDrop={dropCard}>
          <Card onDragStart={dragCardStart} />
          <Card onDragStart={dragCardStart} />
          <Card onDragStart={dragCardStart} />
          <Card onDragStart={dragCardStart} />
          <Card onDragStart={dragCardStart} />
          <Card onDragStart={dragCardStart} />
          <Card onDragStart={dragCardStart} />
        </div>
      </div>
      <div className={classes.board}>
        <div className={classes.stack}></div>
        <div className={classes.stack}></div>
      </div>
    </main>
  );
}
