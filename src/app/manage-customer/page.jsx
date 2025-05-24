import FormManageCustomer from "@/components/FormManageCustomer";
import Breadcrumb from "@/components/Breadcrumb";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Manage Customer",
  description:
    "Manage Customer.",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Blog Details' />

        {/* AddBlogLayer */}
        <FormManageCustomer />
      </MasterLayout>
    </>
  );
};

export default Page;
