import Breadcrumb from "@/components/Breadcrumb";
import LanguageLayer from "@/components/LanguageLayer";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Language",
  description:
    "Language.",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Settings - Languages' />

        {/* LanguageLayer */}
        <LanguageLayer />
      </MasterLayout>
    </>
  );
};

export default Page;
