import Breadcrumb from "@/components/Breadcrumb";
import FormOilsParties from "@/components/FormOilsParties";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Oil Parties",
  description:
    "Oil Parties",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Form Validation' />

        {/* FormValidationLayer */}
        <FormOilsParties />
      </MasterLayout>
    </>
  );
};

export default Page;
