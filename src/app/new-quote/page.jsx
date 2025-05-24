import FormNewQuote from "@/components/FormNewQuote";
import Breadcrumb from "@/components/Breadcrumb";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "New Quote",
  description:
    "New Quote.",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Blog Details' />

        {/* AddBlogLayer */}
        <FormNewQuote />
      </MasterLayout>
    </>
  );
};

export default Page;
