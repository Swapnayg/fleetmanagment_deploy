import Breadcrumb from "@/components/Breadcrumb";
import FormSalesReport from "@/components/FormSalesReport";
import MasterLayout from "@/masterLayout/MasterLayout";


export const metadata = {
  title: "Sales Report",
  description:
    "Sales Report",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Form Validation' />

        {/* FormValidationLayer */}
        <FormSalesReport />
      </MasterLayout>
    </>
  );
};

export default Page;
