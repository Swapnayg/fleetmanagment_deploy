import Breadcrumb from "@/components/Breadcrumb";
import FormGoodsDashboard from "@/components/FormGoodsDashboard";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Goods Dashboard",
  description:
    "Goods Dashboard",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Form Validation' />

        {/* FormValidationLayer */}
        <FormGoodsDashboard />
      </MasterLayout>
    </>
  );
};

export default Page;
