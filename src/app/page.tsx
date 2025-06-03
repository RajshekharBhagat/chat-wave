import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";


export default async function Home() {
  return (
    <div>
      <MaxWidthWrapper>
        <div className="flex items-center gap-2 justify-center mt-16">
          Hello World
          <Button  isLoading={true} spinner loadingText="Loading"></Button>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
