import Breadcrumb from "@/components/Breadcrumb";
import FormPurchaseReport from "@/components/FormPurchaseReport";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Purchase Report",
  description:
    "Purchase Report",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Form Validation' />

        {/* FormValidationLayer */}
        <FormPurchaseReport />
      </MasterLayout>
    </>
  );
};

export default Page;
