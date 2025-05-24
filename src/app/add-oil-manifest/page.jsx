import Breadcrumb from "@/components/Breadcrumb";
import FormValidationLayer from "@/components/ManifestOilEntryPage";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Manifest (OIL)s",
  description:
    "Manifest (OIL)s Details",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Form Validation' />

        {/* FormValidationLayer */}
        <FormValidationLayer />
      </MasterLayout>
    </>
  );
};

export default Page;
