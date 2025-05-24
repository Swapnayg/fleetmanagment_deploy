import FormManageSupplier from "@/components/FormManageSupplier";
import Breadcrumb from "@/components/Breadcrumb";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Manage Supplier",
  description:
    "Manage Supplier.",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Blog Details' />

        {/* AddBlogLayer */}
        <FormManageSupplier />
      </MasterLayout>
    </>
  );
};

export default Page;
