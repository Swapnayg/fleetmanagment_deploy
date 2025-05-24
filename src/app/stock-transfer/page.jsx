import FormStockTransfer from "@/components/FormStockTransfer";
import Breadcrumb from "@/components/Breadcrumb";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Stock Transfer",
  description:
    "Stock Transfer.",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Blog Details' />

        {/* AddBlogLayer */}
        <FormStockTransfer />
      </MasterLayout>
    </>
  );
};

export default Page;
