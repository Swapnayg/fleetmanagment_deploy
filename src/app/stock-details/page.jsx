import Breadcrumb from "@/components/Breadcrumb";
import FormStockDetails from "@/components/FormStockDetails";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Stock Details",
  description:
    "Stock Details",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Form Validation' />

        {/* FormValidationLayer */}
        <FormStockDetails />
      </MasterLayout>
    </>
  );
};

export default Page;
