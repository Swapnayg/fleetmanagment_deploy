import FormManageProduct from "@/components/FormManageProduct";
import Breadcrumb from "@/components/Breadcrumb";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Manage Product",
  description:
    "Manage Product.",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Blog Details' />

        {/* AddBlogLayer */}
        <FormManageProduct />
      </MasterLayout>
    </>
  );
};

export default Page;
