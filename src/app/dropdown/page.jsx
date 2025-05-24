import Breadcrumb from "@/components/Breadcrumb";
import DropdownLayer from "@/components/DropdownLayer";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Dropdown",
  description:
    "Dropdown.",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Components / Dropdown' />

        {/* DropdownLayer */}
        <DropdownLayer />
      </MasterLayout>
    </>
  );
};

export default Page;
