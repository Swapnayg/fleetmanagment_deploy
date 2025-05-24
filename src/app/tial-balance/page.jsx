import FormTrialBalance from "@/components/FormTrialBalance";
import Breadcrumb from "@/components/Breadcrumb";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Trial Balance",
  description:
    "Trial Balance.",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Blog Details' />

        {/* AddBlogLayer */}
        <FormTrialBalance />
      </MasterLayout>
    </>
  );
};

export default Page;
