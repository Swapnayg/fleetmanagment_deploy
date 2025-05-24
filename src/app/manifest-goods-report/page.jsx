import FormGoodsManifestReport from "@/components/FormGoodsManifestReport";
import Breadcrumb from "@/components/Breadcrumb";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Manifest Goods Report",
  description:
    "Manifest Goods Report.",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Blog Details' />

        {/* AddBlogLayer */}
        <FormGoodsManifestReport />
      </MasterLayout>
    </>
  );
};

export default Page;
