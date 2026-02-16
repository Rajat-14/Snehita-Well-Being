import './messageCard.css';
const MessageCard = (props) => {
    const message = props.message;
    console.log(props);
    return (
        // <h2>hello</h2>
        <div className="col">
            <div className='row  align-items-center'>
                <div className='col-sm-6 col-12 d-flex flex-column flex-wrap align-content-center  '>
                    <img src={props.pic} alt="Photo" width={200} />
                </div>
                <div className='col-sm-6 col-lg-4 col-12 d-flex flex-column align-align-content-start  flex-wrap fw-bold '>
                    <div className="row name flex-row justify-content-center text-primary fs-1  ">
                        {props.name}
                    </div>
                    <div className="row designation flex-row justify-content-center">
                        {props.designation}
                    </div>
                </div>
            </div>
            <div className="row my-3 mx-2">
                {message[0]}
                <br /><br />
                {message[1]}
                <br /><br />
                {message[2]},
                <br />
                <br />
                {props.telephoneNo === '' ? message[3] : ""}
                <div className="fw-bold p-0">
                    {props.telephoneNo !== '' ? message[3] : ""}
                    <br />
                    {props.emailId}
                    <br />
                    {props.telephoneNo}
                </div>
            </div>
        </div>
    );
}
export default MessageCard;