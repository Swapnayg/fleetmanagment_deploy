import Breadcrumb from "@/components/Breadcrumb";
import FormChartofAccnt from "@/components/FormChartofAccnt";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Chart of Account",
  description:
    "Chart of Account",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Form Validation' />

        {/* FormValidationLayer */}
        <FormChartofAccnt />
      </MasterLayout>
    </>
  );
};

export default Page;
