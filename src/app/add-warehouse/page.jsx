import FormInWarehouse from "@/components/FormInWarehouse";
import Breadcrumb from "@/components/Breadcrumb";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Add Warehouse",
  description:
    "Add Warehouse.",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Blog Details' />

        {/* AddBlogLayer */}
        <FormInWarehouse />
      </MasterLayout>
    </>
  );
};

export default Page;
