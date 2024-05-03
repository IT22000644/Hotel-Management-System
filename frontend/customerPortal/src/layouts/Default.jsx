import PropTypes from "prop-types";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Default(props) {
  return (
    <>
      <Header />
      {props.children}
      <Footer />
    </>
  );
}

Default.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Default;
