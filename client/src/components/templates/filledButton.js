
const FilledButton=(props)=>{
    return (
        <button type="button" className={`btn btn-${props.buttonColor} fw-bold`} onClick={props.onClick}>
              {props.children}
            </button>
    )
}
export default FilledButton;