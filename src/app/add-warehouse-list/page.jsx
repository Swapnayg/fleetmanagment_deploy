import Breadcrumb from "@/components/Breadcrumb";
import FormWarehouses from "@/components/FormWarehouses";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Add Warehouse Lists",
  description:
    "Add Warehouse Lists.",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Input Layout' />

        {/* FormLayoutLayer */}
        <FormWarehouses />
      </MasterLayout>
    </>
  );
};

export default Page;
