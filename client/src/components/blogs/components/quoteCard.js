import "./quoteCard.css";
// import RandomColorGenerator from "./randomColorGenerator";
const QuoteCard = (props) => {
  return (
    <div className="card h-100 shadow rounded mx-3 " data-aos="fade-up">
      <div className="card-body">
        <img src={props.quotePic} alt={"Quote"} style={{
        borderRadius: '2%',
        width: '100%', 
        height:"100%",
      }} loading="lazy" />
      </div>
    </div>
  );
};
export default QuoteCard;
