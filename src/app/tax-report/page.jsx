import Breadcrumb from "@/components/Breadcrumb";
import FormTaxReport from "@/components/FormTaxReport";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Tax Report",
  description:
    "Tax Report",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Form Validation' />

        {/* FormValidationLayer */}
        <FormTaxReport />
      </MasterLayout>
    </>
  );
};

export default Page;
