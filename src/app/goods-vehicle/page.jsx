import Breadcrumb from "@/components/Breadcrumb";
import FormGoodsVehicles from "@/components/FormGoodsVehicles";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Goods Vehicle",
  description:
    "Goods Vehicle",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Form Validation' />

        {/* FormValidationLayer */}
        <FormGoodsVehicles />
      </MasterLayout>
    </>
  );
};

export default Page;
