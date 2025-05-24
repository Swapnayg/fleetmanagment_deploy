import Breadcrumb from "@/components/Breadcrumb";
import FormAllPartyDetails from "@/components/FormAllPartyDetails";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "All Party Report",
  description:
    "All Party Report",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Form Validation' />

        {/* FormValidationLayer */}
        <FormAllPartyDetails />
      </MasterLayout>
    </>
  );
};

export default Page;
