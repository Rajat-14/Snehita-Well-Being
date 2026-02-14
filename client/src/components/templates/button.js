const Button=(props)=>{
    return (
        <button className={`btn btn-outline-${props.color} fw-bold`} onClick={props.onClick}>
              {props.children}
            </button>
    )
}
export default Button;