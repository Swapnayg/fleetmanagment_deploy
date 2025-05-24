import FormNewOrder from "@/components/FormNewOrder";
import Breadcrumb from "@/components/Breadcrumb";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "New Order",
  description:
    "New Order.",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Blog Details' />

        {/* AddBlogLayer */}
        <FormNewOrder />
      </MasterLayout>
    </>
  );
};

export default Page;
