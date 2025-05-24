import Breadcrumb from "@/components/Breadcrumb";
import FormValidationLayer from "@/components/ManifestEntryPage";
import MasterLayout from "@/masterLayout/MasterLayout";


export const metadata = {
  title: "Manifest (Good)s",
  description:
    "Manifest (Good)s Details",
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
