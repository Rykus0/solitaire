import { type PropsWithChildren, type DragEvent, useId } from "react";
import classes from "./Stack.module.css";

// TODO: add direction and spread (boolean) props

type StackProps = {
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
};

export default function Stack(props: PropsWithChildren<StackProps>) {
  const id = useId();

  return (
    <div
      id={id}
      className={classes.stack}
      onDragOver={props.onDragOver}
      onDrop={props.onDrop}
    >
      {props.children}
    </div>
  );
}
