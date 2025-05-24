import FormProfitLoss from "@/components/FormProfitLoss";
import Breadcrumb from "@/components/Breadcrumb";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Profit Loss",
  description:
    "Profit Loss.",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Blog Details' />

        {/* AddBlogLayer */}
        <FormProfitLoss />
      </MasterLayout>
    </>
  );
};

export default Page;
