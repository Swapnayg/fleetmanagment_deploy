import FormNewCustomer from "@/components/FormNewCustomer";
import Breadcrumb from "@/components/Breadcrumb";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "New Customer",
  description:
    "New Customer.",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Blog Details' />

        {/* AddBlogLayer */}
        <FormNewCustomer />
      </MasterLayout>
    </>
  );
};

export default Page;
