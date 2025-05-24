import FormOilManifestReport from "@/components/FormOilManifestReport";
import Breadcrumb from "@/components/Breadcrumb";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Manifest Oils Report",
  description:
    "Manifest Oils Report.",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Blog Details' />

        {/* AddBlogLayer */}
        <FormOilManifestReport />
      </MasterLayout>
    </>
  );
};

export default Page;
