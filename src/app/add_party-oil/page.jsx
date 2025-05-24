import Breadcrumb from "@/components/Breadcrumb";
import PartyOilsLayer from "@/components/NewPartyOilsLayer";
import MasterLayout from "@/masterLayout/MasterLayout";
//import PartyLedgerTemplate from "@/components/child/PartyLedgerTemplate";

export const metadata = {
  title: "New Party Oils",
  description:
    "New Party Oils.",
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
