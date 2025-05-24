import Breadcrumb from "@/components/Breadcrumb";
import FormOilsVehicles from "@/components/FormOilsVehicles";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Oil Vehicle",
  description:
    "Oil Vehicle",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Form Validation' />

        {/* FormValidationLayer */}
        <FormOilsVehicles />
      </MasterLayout>
    </>
  );
};

export default Page;
