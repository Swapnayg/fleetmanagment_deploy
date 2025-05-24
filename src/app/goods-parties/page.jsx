import Breadcrumb from "@/components/Breadcrumb";
import FormGoodsParties from "@/components/FormGoodsParties";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Goods Parties",
  description:
    "Goods Parties",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Form Validation' />

        {/* FormValidationLayer */}
        <FormGoodsParties />
      </MasterLayout>
    </>
  );
};

export default Page;
