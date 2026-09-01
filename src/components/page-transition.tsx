import { useEffect, useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [key, setKey] = useState(pathname);
  const [content, setContent] = useState<ReactNode>(children);

  useEffect(() => {
    setKey(pathname);
    setContent(children);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [pathname, children]);

  return (
    <div key={key} className="page-enter">
      {content}
    </div>
  );
}
