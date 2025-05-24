import FormProductCategory from "@/components/FormProductCategory";
import Breadcrumb from "@/components/Breadcrumb";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Product Category",
  description:
    "Product Category.",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Blog Details' />

        {/* AddBlogLayer */}
        <FormProductCategory />
      </MasterLayout>
    </>
  );
};

export default Page;
