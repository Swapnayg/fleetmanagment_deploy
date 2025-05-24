import Breadcrumb from "@/components/Breadcrumb";
import FormAllOilsReport from "@/components/FormAllOilsReport";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Oils Report",
  description:
    "Oils Report",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Form Validation' />

        {/* FormValidationLayer */}
        <FormAllOilsReport />
      </MasterLayout>
    </>
  );
};

export default Page;
