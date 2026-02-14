import QuoteCard from "../components/quoteCard";

const Quotes = () => {
  const AllQuoteFilenames = [
    "AlbusDumbeldore.png",
    "NanditaDas.png",
    "ChristopherGermer.png",
    "DanMillman.png",
    "GautamBuddha.png",
    "MileyCyrus.png",
    "NelsonMandela.png",
    "PemaChodron.png",
    "PriyankaChopra.png",
    "RobertFrost.png",
    "WayenDyer.png",
    "YokoYono.png",
  ];

  const AllQuotes = AllQuoteFilenames.map(filename => 
    require(`../../assets/AllQuotes/${filename}`)
  );

  return (
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 quotes-custom">
      {AllQuotes.map((item,index) => {
        return (
          <div className="col mb-4 mr-1 " key={index}>
            <QuoteCard quotePic={item} />
          </div>
        );
      })}
    </div>
  );
};
export default Quotes;
