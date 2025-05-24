import Breadcrumb from "@/components/Breadcrumb";
import FormInvDashboard from "@/components/FormInvDashboard";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Inventory Dashboard",
  description:
    "Inventory Dashboard",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Form Validation' />

        {/* FormValidationLayer */}
        <FormInvDashboard />
      </MasterLayout>
    </>
  );
};

export default Page;
