import FormNewSupplier from "@/components/FormNewSupplier";
import Breadcrumb from "@/components/Breadcrumb";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "New Supplier",
  description:
    "New Supplier.",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Blog Details' />

        {/* AddBlogLayer */}
        <FormNewSupplier />
      </MasterLayout>
    </>
  );
};

export default Page;
