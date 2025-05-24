import Breadcrumb from "@/components/Breadcrumb";
import FormAllGoodsReport from "@/components/FormAllGoodsReport";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Goods Report",
  description:
    "Goods Report",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Form Validation' />

        {/* FormValidationLayer */}
        <FormAllGoodsReport />
      </MasterLayout>
    </>
  );
};

export default Page;
