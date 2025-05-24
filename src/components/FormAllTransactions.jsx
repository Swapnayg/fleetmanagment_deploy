//import AddPartiesForm from "./child/AddPartiesForm";
import InputFormWithIcons from "./child/InputFormWithIcons";
import HorizontalInputForm from "./child/HorizontalInputForm";
import HorizontalInputFormWithIcons from "./child/HorizontalInputFormWithIcons";
import AllTransactionsLists from "./child/AllTransactionsLists";

const FormAllTransactions = () => {

  return (
    <div className="row gy-4">
      {/* VerticalInputForm */}
      {/* <AddPartiesForm /> */}
      <AllTransactionsLists />

      {/* InputFormWithIcons */}
      {/* <InputFormWithIcons /> */}

      {/* HorizontalInputForm */}
      {/* <HorizontalInputForm /> */}

      {/* HorizontalInputFormWithIcons */}
      {/* <HorizontalInputFormWithIcons /> */}
    </div>
  );
};

export default FormAllTransactions;
