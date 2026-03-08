import { Suspense } from "react";
import SearchPage from "./main-page";

export default function Page() {
  return (
    <Suspense>
      <SearchPage />
    </Suspense>
  );
}
