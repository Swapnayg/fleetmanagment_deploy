import FormNewInvoice from "@/components/FormNewInvoice";
import Breadcrumb from "@/components/Breadcrumb";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "New Invoice",
  description:
    "New Invoice.",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Blog Details' />

        {/* AddBlogLayer */}
        <FormNewInvoice />
      </MasterLayout>
    </>
  );
};

export default Page;
