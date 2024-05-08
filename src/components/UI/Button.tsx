"use client";
import Link from "next/link";
import React from "react";

interface ButtonProps {
  label?: string;
  onClick?: () => void;
  href?: string;
  outlined?: boolean;
  color?: string;
  icon?: React.ReactNode;
}

export default function Button(props: ButtonProps) {
  const color = props.color || "primary";
  return (
    <Link
      href={props.href || "#"}
      onClick={props.onClick}
      className={
        props.outlined
          ? `inline-flex items-center justify-center rounded-md border px-4 py-3 text-center font-medium hover:bg-opacity-90 lg:px-8 xl:px-10 border-${color} text-${color}`
          : `inline-flex items-center justify-center rounded-md px-4 py-3 text-center font-medium hover:bg-opacity-90 lg:px-8 xl:px-10 bg-${color} text-white`
      }
    >
      {props.icon && <span className="mr-6">{props.icon}</span>}
      {props.label || "Button"}
    </Link>
  );
}
