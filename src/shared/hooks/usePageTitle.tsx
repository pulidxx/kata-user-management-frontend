"use client";

import { useEffect } from "react";

export function usePageTitle(title: string) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${title} | Portal BdB`;

    return () => {
      document.title = prevTitle;
    };
  }, [title]);
}
