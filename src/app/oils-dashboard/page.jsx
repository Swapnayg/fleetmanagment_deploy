import Breadcrumb from "@/components/Breadcrumb";
import FormOilsDashboard from "@/components/FormOilsDashboard";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Oil Dashboard",
  description:
    "Oil Dashboard",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Form Validation' />

        {/* FormValidationLayer */}
        <FormOilsDashboard />
      </MasterLayout>
    </>
  );
};

export default Page;
