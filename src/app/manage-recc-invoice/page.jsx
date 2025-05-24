import FormManageReccInvoice from "@/components/FormManageReccInvoice";
import Breadcrumb from "@/components/Breadcrumb";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Manage Reccuring Invoice",
  description:
    "Manage Reccuring Invoice.",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Blog Details' />

        {/* AddBlogLayer */}
        <FormManageReccInvoice />
      </MasterLayout>
    </>
  );
};

export default Page;
