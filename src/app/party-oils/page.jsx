import Breadcrumb from "@/components/Breadcrumb";
import PartyOilsLayer from "@/components/PartyOilsLayer";
import MasterLayout from "@/masterLayout/MasterLayout";
//import PartyLedgerTemplate from "@/components/child/PartyLedgerTemplate";

export const metadata = {
  title: "Party Oils",
  description:
    "Party Oils.",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="Wizard" />

        {/* WizardLayer */}
        <PartyOilsLayer />
        {/* <PartyLedgerTemplate /> */}
      </MasterLayout>
    </>
  );
};

export default Page;
